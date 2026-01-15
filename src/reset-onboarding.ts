import { prisma } from "./lib/prisma";

async function main() {
    await prisma.user.update({
        where: { email: "student@demo.com" },
        data: { isOnboarded: false, onboardingData: null }
    });
    console.log("Reset onboarding status for student@demo.com");
}

main();
