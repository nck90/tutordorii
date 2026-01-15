
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

    try {
        const rooms = await prisma.chatRoom.findMany({
            where: {
                OR: [{ studentId: userId }, { tutorId: userId }]
            },
            include: {
                student: true,
                tutor: true,
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(rooms.map(r => {
            const isStudent = r.studentId === userId;
            const otherUser = isStudent ? r.tutor : r.student;
            return {
                id: r.id,
                otherUserName: otherUser.name,
                lastMessage: r.messages[0]?.content || "대화가 없습니다.",
                updatedAt: r.updatedAt
            };
        }));
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
