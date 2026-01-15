
import { prisma } from "./lib/prisma";

// Logic to test: Review Creation + Rating Aggregation
async function verifyReviewLogic() {
    console.log("🔍 Verifying Review System Logic...");


    // Ensure Users Exist
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
                create: { price: 50000, university: "Test", major: "Test" }
            }
        },
        include: { tutorProfile: true }
    });


    console.log(`📝 Client-side simulation: Student (${student.name}) writing review...`);

    // Simulate Action Logic Directly
    await prisma.$transaction(async (tx) => {
        // 1. Create
        await tx.review.create({
            data: {
                authorId: student.id,
                tutorId: tutor.id,
                tutorProfileId: tutor.tutorProfile!.id,
                rating: 5,
                content: "Direct DB Test: Excellent!"
            }
        })

        // 2. Aggregate
        const aggregations = await tx.review.aggregate({
            where: { tutorProfileId: tutor.tutorProfile!.id },
            _avg: { rating: true },
            _count: { rating: true }
        })

        // 3. Update result
        await tx.tutorProfile.update({
            where: { id: tutor.tutorProfile!.id },
            data: {
                rating: aggregations._avg.rating || 0,
                reviewCount: aggregations._count.rating || 0
            }
        })
    });

    console.log("✅ Review Created & Aggregated.");

    // Verify
    const updatedProfile = await prisma.tutorProfile.findUnique({
        where: { id: tutor.tutorProfile!.id },
        include: { reviews: true }
    });

    console.log(`📊 Updated Rating: ${updatedProfile?.rating} / Count: ${updatedProfile?.reviewCount}`);

    if (updatedProfile?.reviewCount! >= 1 && updatedProfile?.rating! > 0) {
        console.log("✨ Verification PASSED.");
    }
}

verifyReviewLogic();
