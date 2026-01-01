import { TutorCard } from "@/components/tutor/TutorCard";

const MOCK_TUTORS = [
    {
        name: "Sarah Kim",
        university: "Princeton University",
        major: "Chemistry",
        tags: ["AP Chemistry", "IB Chem HL", "SAT Math"],
        imageUrl: "/tutors/1.jpg",
        rating: 4.9,
        reviewCount: 42,
    },
    {
        name: "James Lee",
        university: "Yale University",
        major: "Economics",
        tags: ["IB Economics HL", "AP Micro/Macro", "College Essay"],
        imageUrl: "/tutors/2.jpg",
        rating: 5.0,
        reviewCount: 89,
    },
    {
        name: "Daniel Park",
        university: "Stanford Univ.",
        major: "Computer Science",
        tags: ["AP CSA", "USACO", "IB Math AA HL"],
        imageUrl: "/tutors/3.jpg",
        rating: 4.8,
        reviewCount: 23,
    },
    {
        name: "Minji Choi",
        university: "Oxford University",
        major: "PPE",
        tags: ["A-Level Math", "TSA Prep", "IB History"],
        imageUrl: "/tutors/4.jpg",
        rating: 5.0,
        reviewCount: 15,
    }
];

export function TutorShowcase() {
    return (
        <section className="py-24 bg-background border-t border-border/40">
            <div className="container max-w-screen-xl px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            Verified Experts
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            이미 검증된 상위 1% 튜터들이 활동하고 있습니다.
                        </p>
                    </div>
                    <a href="#" className="hidden md:block text-primary font-medium hover:underline underline-offset-4">
                        전체 튜터 보기 →
                    </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_TUTORS.map((tutor) => (
                        <TutorCard key={tutor.name} {...tutor} />
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <a href="#" className="text-primary font-medium hover:underline underline-offset-4">
                        전체 튜터 보기 →
                    </a>
                </div>
            </div>
        </section>
    );
}
