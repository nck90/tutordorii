
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const tutor = await prisma.user.findUnique({
            where: { id },
            include: {
                tutorProfile: {
                    include: {
                        tags: true,
                        reviews: {
                            include: { author: true },
                            orderBy: { createdAt: 'desc' },
                            take: 5
                        }
                    }
                }
            }
        });

        if (!tutor) {
            return NextResponse.json({ error: "Tutor not found" }, { status: 404 });
        }

        const data = {
            id: tutor.id,
            name: tutor.name,
            university: tutor.tutorProfile?.university || "",
            major: tutor.tutorProfile?.major || "",
            bio: tutor.tutorProfile?.bio || "",
            education: tutor.tutorProfile?.education ? JSON.parse(tutor.tutorProfile.education as string) : [],
            tags: tutor.tutorProfile?.tags.map(tag => tag.name) || [],
            rating: tutor.tutorProfile?.rating || 0,
            reviewCount: tutor.tutorProfile?.reviewCount || 0,
            price: tutor.tutorProfile?.price || 0,
            imageUrl: tutor.tutorProfile?.imageUrl || "",
            reviews: tutor.tutorProfile?.reviews.map(r => ({
                id: r.id,
                authorName: r.author.name,
                rating: r.rating,
                content: r.content,
                createdAt: r.createdAt
            })) || []
        };

        return NextResponse.json(data);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Failed to fetch tutor details" }, { status: 500 });
    }
}
