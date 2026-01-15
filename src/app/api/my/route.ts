
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) return NextResponse.json({ error: "No user ID" }, { status: 400 });

    try {
        const requests = await prisma.lessonRequest.findMany({
            where: { studentId: userId },
            include: { tutor: true },
            orderBy: { createdAt: 'desc' }
        });

        const schedules: any[] = []; // Mock for now

        return NextResponse.json({
            requests: requests.map(r => ({
                id: r.id,
                tutorName: r.tutor.name,
                status: r.status,
                subject: r.subject,
                date: r.createdAt
            })),
            schedules
        });
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
