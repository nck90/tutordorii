
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort'); // 'rating' | 'newest'
    const query = searchParams.get('q');

    // Basic filter logic
    const whereClause: any = { role: "tutor" };

    if (query) {
        whereClause.OR = [
            { name: { contains: query } },
            {
                tutorProfile: {
                    OR: [
                        { university: { contains: query } },
                        { major: { contains: query } },
                        { bio: { contains: query } }
                    ]
                }
            }
        ];
    }

    let orderBy: any = undefined;
    if (sort === 'rating') {
        orderBy = { tutorProfile: { rating: 'desc' } };
    } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' };
    }

    try {
        const tutors = await prisma.user.findMany({
            where: whereClause,
            include: {
                tutorProfile: {
                    include: { tags: true }
                }
            },
            orderBy: orderBy
        });

        // Map to simpler JSON for mobile
        const data = tutors.map(t => ({
            id: t.id,
            name: t.name,
            university: t.tutorProfile?.university || "",
            major: t.tutorProfile?.major || "",
            tags: t.tutorProfile?.tags.map(tag => tag.name) || [],
            rating: t.tutorProfile?.rating || 0,
            imageUrl: t.tutorProfile?.imageUrl || "",
            price: t.tutorProfile?.price || 0,
        }));

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch tutors" }, { status: 500 });
    }
}
