
import { prisma } from "./lib/prisma";

async function verifySchedule() {
    console.log("🔍 Verifying Schedule Logic...");

    // 1. Find the student and tutor from previous tests
    const student = await prisma.user.findUnique({ where: { email: "bi-student@demo.com" } });
    const tutor = await prisma.user.findUnique({ where: { email: "bi-tutor@demo.com" } });

    if (!student || !tutor) {
        console.error("❌ Test users not found. Run bidirectional test first.");
        return;
    }

    // 2. Query Schedule for Student
    console.log(`Checking schedule for Student: ${student.name} (${student.id})`);

    // Logic from getMyScheduleAction
    const studentSchedule = await prisma.lessonRequest.findMany({
        where: { studentId: student.id, status: "ACCEPTED" },
        include: { tutor: true }
    });

    console.log(`✅ Student has ${studentSchedule.length} accepted lessons.`);
    studentSchedule.forEach(s => console.log(` - Subject: ${s.subject}, Tutor: ${s.tutor.name}`));

    if (studentSchedule.length > 0) {
        console.log("✨ Verification PASSED: Schedule data is retrievalbe.");
    } else {
        console.error("⚠️ No accepted lessons found. Did bidirectional test finish?");
    }
}

verifySchedule();
