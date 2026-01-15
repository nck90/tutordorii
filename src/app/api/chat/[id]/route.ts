
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const messages = await prisma.message.findMany({
            where: { chatRoomId: id },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(messages);
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { senderId, content } = body;

    try {
        const message = await prisma.message.create({
            data: {
                chatRoomId: id,
                senderId,
                content,
                isRead: false
            }
        });

        await prisma.chatRoom.update({
            where: { id },
            data: { updatedAt: new Date() }
        });

        return NextResponse.json(message);
    } catch (e) {
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}
