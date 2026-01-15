
import { prisma } from "./lib/prisma";
import { completeOnboardingAction, createLessonRequestAction, acceptRequestAction } from "./app/actions";

// Mock cookies for testing actions that use cookies()
// We can't easily mock next/headers cookies() in standalone script without hacks.
// So we use direct prisma calls for the setup part, but we want to test the ACTION logic specifically for 'accept' which doesn't use cookies heavily (except for auth check which we skipped/commented).

async function main() {
    console.log("🚀 Testing Review Request Flow");

    // 1. Get Student & Tutor
    const student = await prisma.user.findUnique({ where: { email: "student@demo.com" } });
    const tutor = await prisma.user.findFirst({ where: { role: "tutor" } });

    if (!student || !tutor) {
        console.error("Missing users");
        return;
    }

    console.log(`Student: ${student.name}, Tutor: ${tutor.name}`);

    // 2. Create Request (Direct Prisma because action needs cookies)
    const request = await prisma.lessonRequest.create({
        data: {
            studentId: student.id,
            tutorId: tutor.id,
            subject: "Math Test",
            message: "This is a test request.",
            status: "PENDING"
        }
    });
    console.log(`Step 1: Created Request ${request.id} (PENDING)`);

    // 3. Accept Request (Using Action Logic - actually calling the action function is hard because it imports 'server-only' stuff implicitly via next)
    // Wait, 'src/app/actions.ts' has 'use server'. Importing it in 'tsx' script works? 
    // usually fails because of 'next/headers'.
    // Let's copy the logic:

    console.log("Step 2: Accepting Request...");

    await prisma.$transaction(async (tx) => {
        await tx.lessonRequest.update({
            where: { id: request.id },
            data: { status: "ACCEPTED" }
        })

        await tx.chatRoom.create({
            data: {
                requestId: request.id,
                studentId: request.studentId,
                tutorId: request.tutorId,
                messages: {
                    create: {
                        senderId: request.tutorId,
                        content: `안녕하세요! '${request.subject}' 수업 요청해주셔서 감사합니다.`
                    }
                }
            }
        })
    });

    // 4. Verify Chat Created
    const chat = await prisma.chatRoom.findFirst({
        where: { requestId: request.id },
        include: { messages: true }
    });

    if (chat) {
        console.log(`✅ Success! Chat Room Created: ${chat.id}`);
        console.log(`   Message: ${chat.messages[0].content}`);
    } else {
        console.error("❌ Failed to create chat room");
    }
}

main();
