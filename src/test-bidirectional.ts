
import { prisma } from "./lib/prisma";

async function main() {
    console.log("🚀 Starting Bidirectional Flow Test...");

    // 1. Setup Users
    const student = await prisma.user.upsert({
        where: { email: "bi-student@demo.com" },
        update: {},
        create: { email: "bi-student@demo.com", password: "pwd", name: "Bi Student", role: "student" }
    });

    const tutor = await prisma.user.upsert({
        where: { email: "bi-tutor@demo.com" },
        update: {},
        create: {
            email: "bi-tutor@demo.com", password: "pwd", name: "Bi Tutor", role: "tutor",
            tutorProfile: {
                create: { price: 50000, university: "Test Uni", major: "Test Major", bio: "Hi" }
            }
        }
    });

    console.log(`Step 1: Users Ready (${student.name}, ${tutor.name})`);

    // 2. Student Requests Lesson
    const request = await prisma.lessonRequest.create({
        data: {
            studentId: student.id,
            tutorId: tutor.id,
            subject: "Bidirectional Test",
            message: "Can you teach me?",
            status: "PENDING"
        }
    });
    console.log(`Step 2: Request Sent (ID: ${request.id}, Status: ${request.status})`);

    // 3. Tutor Accepts (Simulating Action)
    // Transcation simulating 'acceptRequestAction'
    await prisma.$transaction(async (tx) => {
        await tx.lessonRequest.update({ where: { id: request.id }, data: { status: "ACCEPTED" } });
        await tx.chatRoom.create({
            data: {
                requestId: request.id,
                studentId: student.id,
                tutorId: tutor.id,
                messages: {
                    create: { senderId: tutor.id, content: "Sure, accepted!" }
                }
            }
        });
    });
    console.log("Step 3: Tutor Accepted Request & Created Chat");

    // 4. Verify Chat Exists
    const chat = await prisma.chatRoom.findUnique({ where: { requestId: request.id } });
    if (!chat) throw new Error("Chat not created");

    // 5. Student Sends Message
    await prisma.message.create({
        data: { chatRoomId: chat.id, senderId: student.id, content: "Thanks! When do we start?" }
    });
    console.log("Step 5: Student Sent Message");

    // 6. Tutor Responds
    await prisma.message.create({
        data: { chatRoomId: chat.id, senderId: tutor.id, content: "Right now!" }
    });
    console.log("Step 6: Tutor Responded");

    // 7. Final Check
    const messages = await prisma.message.findMany({ where: { chatRoomId: chat.id }, orderBy: { createdAt: 'asc' } });
    console.log("🎉 Conversation Log:");
    messages.forEach(m => console.log(`[${m.senderId === student.id ? 'Student' : 'Tutor'}]: ${m.content}`));
}

main();
