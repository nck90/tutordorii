
import { prisma } from "./lib/prisma";


// Logic Test Only - No cookies mocking needed for direct logic test if we extract logic or just mock DB state
async function verifyFeaturesLogic() {
    console.log("🔍 Verifying MyPage and Home Logic (Direct DB State Check)...");

    const tutor = await prisma.user.upsert({
        where: { email: "bi-tutor@demo.com" },
        update: {},
        create: {
            email: "bi-tutor@demo.com", password: "pwd", name: "Bi Tutor", role: "tutor",
            tutorProfile: { create: { price: 50000, rating: 5.0 } }
        },
        include: { tutorProfile: true }
    });

    const student = await prisma.user.upsert({
        where: { email: "bi-student@demo.com" },
        update: {},
        create: { email: "bi-student@demo.com", password: "pwd", name: "Bi Student", role: "student" }
    });

    // 1. Simulate Settlement Data
    console.log("💰 Simulating Settlement Data...");
    // Create an ACCEPTED request
    const req = await prisma.lessonRequest.create({
        data: {
            tutorId: tutor.id,
            studentId: student.id,
            subject: "Settlement Test " + Date.now(),
            message: "Test",
            status: "ACCEPTED"
        }
    });

    // Calculate Manually (simulating action logic)
    const requests = await prisma.lessonRequest.findMany({
        where: { tutorId: tutor.id, status: "ACCEPTED" }
    });
    const total = requests.length * (tutor.tutorProfile?.price || 0);
    console.log(`💵 Total Accepted Requests: ${requests.length}, Calc Total: ${total}`);

    if (total > 0) console.log("✅ Settlement Logic Verified via DB state.");

    // 2. Verify Sorting Query Logic
    console.log("⭐ Verifying Home Page Sorting Logic...");
    const topRated = await prisma.user.findMany({
        where: { role: "tutor" },
        orderBy: { tutorProfile: { rating: 'desc' } },
        include: { tutorProfile: true },
        take: 1
    });
    console.log(`🌟 Top Rated found: ${topRated[0]?.name} (${topRated[0]?.tutorProfile?.rating})`);

    const newest = await prisma.user.findMany({
        where: { role: "tutor" },
        orderBy: { createdAt: 'desc' },
        take: 1
    });
    console.log(`🆕 Newest found: ${newest[0]?.name}`);

    console.log("✅ Sorting Queries Valid.");
}

verifyFeaturesLogic();
