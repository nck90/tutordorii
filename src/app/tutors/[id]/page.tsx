import { getTutorAction } from "@/app/actions";
import TutorDetailClient from "./TutorDetailClient";
import { notFound } from "next/navigation";

export default async function TutorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tutor = await getTutorAction(id);

    if (!tutor) {
        notFound();
    }

    // Map Prisma object to Component Prop
    const mappedTutor = {
        id: tutor.id,
        name: tutor.name,
        university: tutor.tutorProfile?.university || "Unknown University",
        major: tutor.tutorProfile?.major || "Unknown Major",
        bio: tutor.tutorProfile?.bio || "No bio available.",
        education: tutor.tutorProfile?.education ? JSON.parse(JSON.stringify(tutor.tutorProfile.education)) : ["Certified Tutor"], // Handle if education is not array in DB yet, but here assume string or simplistic
        // Actually schema has education as String? (JSON string). Let's assume it's just a string for now or array of strings.
        // My schema says `education String?`.
        // Let's safe handle it.
        tags: tutor.tutorProfile?.tags.map((t: any) => t.name) || [],
        rating: tutor.tutorProfile?.rating || 0,
        reviews: tutor.tutorProfile?.reviewCount || 0,
        price: (tutor.tutorProfile?.price || 0).toLocaleString(),
        imageUrl: tutor.tutorProfile?.imageUrl || "",
        locations: tutor.tutorProfile?.locations || "",
        pricingDetails: tutor.tutorProfile?.pricingDetails || "",
        isLiked: tutor.isLiked
    };

    // Fix education parsing if it's a string
    let eduArray = ["Verified Tutor"];
    if (tutor.tutorProfile?.education) {
        try {
            // Check if it's JSON array string
            const parsed = JSON.parse(tutor.tutorProfile.education);
            if (Array.isArray(parsed)) {
                eduArray = parsed;
            } else if (typeof parsed === 'string') {
                eduArray = [parsed];
            } else {
                eduArray = [String(parsed)];
            }
        } catch {
            // If parse fails, treat as raw string (newline separated?)
            // Or just single line
            if (tutor.tutorProfile.education.includes("\n")) {
                eduArray = tutor.tutorProfile.education.split("\n").filter(Boolean);
            } else {
                eduArray = [tutor.tutorProfile.education];
            }
        }
    }
    mappedTutor.education = eduArray;

    return <TutorDetailClient tutor={mappedTutor} />;
}
