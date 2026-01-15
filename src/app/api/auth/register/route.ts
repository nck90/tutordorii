
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password, name, role } = body;

        if (!email || !password || !name) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "Email already exists" }, { status: 409 });
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password,
                name,
                role: role || 'student',
                tutorProfile: role === 'tutor' ? {
                    create: {
                        bio: "안녕하세요! 신규 튜터입니다.",
                        university: "미입력",
                        major: "미입력",
                        price: 50000
                    }
                } : undefined
            }
        });

        return NextResponse.json({
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            isOnboarded: newUser.isOnboarded
        });
    } catch (error) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
