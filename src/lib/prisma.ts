import { PrismaClient } from "../generated/prisma/client";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Fix: Use absolute path for SQLite to avoid "Unable to open database file" in Next.js Server Actions
console.log("Current Working Directory:", process.cwd());
const dbPath = "/Users/bagjun-won/studydol/dev.db"; // Hardcoded for verification
// const dbPath = path.join(process.cwd(), "dev.db"); 

console.log("Database Path used:", dbPath);

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        datasources: {
            db: {
                url: `file:${dbPath}`,
            },
        },
        // log: ["query"],
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
