
import { prisma } from "./lib/prisma";

async function main() {
    console.log("Testing Onboarding update logic...");
    const user = await prisma.user.findFirst({ where: { role: 'student' } });

    if (!user) {
        console.error("No student found!");
        return;
    }

    console.log("Found student:", user.email, user.id);

    const answers = { 1: "Style A", 2: "Problem B" };

    try {
        const update = await prisma.user.update({
            where: { id: user.id },
            data: {
                isOnboarded: true,
                onboardingData: JSON.stringify(answers)
            }
        });
        console.log("Update success!", update);
    } catch (e) {
        console.error("Update failed:", e);
    }
}

main();
