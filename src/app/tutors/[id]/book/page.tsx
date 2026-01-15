

// Re-exporting logic is tricky if I mix Server/Client in one file without correct "use client" boundaries.
// Actually, I can just make the whole page client for simplicity if I fetch inside, OR separate efficiently.
// Let's stick to the Server Component fetching pattern.

// Correction: I cannot import BookingForm if it doesn't exist yet.
// I will create BookingForm first? No, I must write this file first or simultaneously.
// I will write this file, and since it imports BookingForm which doesn't exist yet, it might error if I tried to run it, but writing is fine.

import { MobileLayout } from "@/components/layout/MobileLayout";
import { getTutorByIdAction } from "@/app/actions";
import { BookingForm } from "./BookingForm";

export default async function BookingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const tutor = await getTutorByIdAction(id);

    if (!tutor) {
        return (
            <MobileLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <p className="text-muted-foreground">존재하지 않는 튜터입니다.</p>
                </div>
            </MobileLayout>
        );
    }

    return <BookingForm tutor={tutor} />;
}
