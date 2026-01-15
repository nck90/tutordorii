
import { prisma } from "./lib/prisma";

async function main() {
    console.log("Test Script Starting...");
    try {
        const count = await prisma.user.count();
        console.log("User count:", count);
        const users = await prisma.user.findMany();
        console.log("Users:", users);
    } catch (e) {
        console.error("Connection failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
