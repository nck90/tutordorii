
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { studentId, tutorId, message, subjects } = body;

        if (!studentId || !tutorId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const lessonRequest = await prisma.lessonRequest.create({
            data: {
                studentId,
                tutorId,
                message: message || "과외 요청합니다.",
                subject: subjects || "영어",
                status: "pending"
            }
        });

        // Also create a chat room
        const existingRoom = await prisma.chatRoom.findFirst({
            where: {
                studentId,
                tutorId
            }
        });

        if (!existingRoom) {
            await prisma.chatRoom.create({
                data: {
                    requestId: lessonRequest.id,
                    studentId,
                    tutorId
                }
            });
        }

        return NextResponse.json(lessonRequest);
    } catch (error) {
        console.error("Booking Error:", error);
        return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
    }
}
