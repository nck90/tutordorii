
import { prisma } from "./lib/prisma";

// We will use direct prisma calls to simulate actions since we can't easily invoke actions with cookies in standalone script.

async function main() {
    console.log("🚀 Starting Production Flow Test...");

    // 1. Check Tutor Data
    const tutor = await prisma.user.findFirst({
        where: { name: "Sarah Kim" },
        include: { tutorProfile: true }
    });

    if (!tutor || !tutor.tutorProfile) {
        console.error("❌ Tutor Sarah Kim not found or missing profile");
        process.exit(1);
    }

    console.log(`✅ Tutor Found: ${tutor.name}`);
    console.log(`   Price: ${tutor.tutorProfile.price}`);
    console.log(`   Education: ${tutor.tutorProfile.education}`);

    // 2. Create Request
    const student = await prisma.user.findUnique({ where: { email: "student@demo.com" } });
    if (!student) {
        console.error("❌ Student not found");
        process.exit(1);
    }

    const request = await prisma.lessonRequest.create({
        data: {
            studentId: student.id,
            tutorId: tutor.id,
            subject: "Final Test Subject",
            message: "Testing full flow.",
            status: "PENDING"
        }
    });
    console.log(`✅ Request Created: ${request.id}`);

    // 3. Accept Request & Create Chat (Simulating acceptRequestAction)
    const chatRoom = await prisma.chatRoom.create({
        data: {
            requestId: request.id,
            studentId: request.studentId,
            tutorId: request.tutorId,
            messages: {
                create: {
                    senderId: tutor.id,
                    content: "Hello from Tutor!"
                }
            }
        }
    });

    await prisma.lessonRequest.update({
        where: { id: request.id },
        data: { status: "ACCEPTED" }
    });

    console.log(`✅ Chat Room Created: ${chatRoom.id}`);

    // 4. Send Message (Simulating sendMessageAction)
    const msg = await prisma.message.create({
        data: {
            chatRoomId: chatRoom.id,
            senderId: student.id,
            content: "Hello from Student via Script!"
        }
    });
    console.log(`✅ Student Message Sent: ${msg.content}`);

    console.log("🎉 All System Checks Passed!");
}

main();
