import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'

const prisma = new PrismaClient()

const TUTORS = [
    {
        id: "1",
        email: "seojin@studydol.com",
        name: "고서진",
        university: "연세대학교",
        major: "융합인문사회과학부",
        tags: ["회화", "비즈니스 영어", "화상 영어", "발음 교정"],
        rating: 5.0,
        price: 50000,
        education: JSON.stringify(["International School at Kuala Lumpur", "IB 42"]),
        bio: "International School at Kuala Lumpur 졸업 (16년 해외 거주)\n연세대학교 융합인문사회과학부 재학\nIB 42점 보유\n\n회화, 비즈니스 영어, 화상 영어, 발음 교정 전문입니다.\n대면/비면 수업 모두 가능합니다.",
        imageUrl: "/teacher/seojin.jpeg",
        locations: "비대면 온라인",
        pricingDetails: "대면: 시간당 5만원\n비대면: 시간당 4만원"
    },
    {
        id: "2",
        email: "yeaun@studydol.com",
        name: "김예은",
        university: "University of Sydney",
        major: "Pharmacy",
        tags: ["IB Biology", "IB Chemistry", "TOEIC", "국제학교 수학"],
        rating: 5.0,
        price: 40000,
        education: JSON.stringify(["University of Sydney Bachelor of Pharmacy (Honors)", "Master of Pharmacy Practice", "International School Bangkok"]),
        bio: "University of Sydney Pharmacy 학사/석사 졸업\n해외 거주 12년 (호주, 두바이, 사우디, 태국)\nTOEIC 975\n\nIB, 국제학교 커리큘럼에 최적화 된 맞춤형 수학, 과학, 영어 수업.\n수준에 따라 한국어/영어 비율 조절 가능 (100% 영어 수업 가능).\nIB 평가 기준 중심(Mark scheme, Command term)으로 답안 작성 지도.",
        imageUrl: "/teacher/yeaun.png",
        locations: "비대면 온라인",
        pricingDetails: "- ib: 4만원\n- 토익: 3만원\n- 고등수학: 4만원\n- 중등수학: 3만원"
    },
    {
        id: "3",
        email: "hyeonju@studydol.com",
        name: "이현주",
        university: "이화여자대학교",
        major: "의류산업학과",
        tags: ["TOEFL", "영어 회화", "발음 교정"],
        rating: 5.0,
        price: 45000,
        education: JSON.stringify(["St.Paul Int School in Hanoi", "이화여자대학교 의류산업학과"]),
        bio: "11년 해외 경험과 학생에게 자신감을 불어넣어줍니다.\n학생들이 가장 어려워하는 영어 스피킹과 빠르게 친해질 수 있도록 지도합니다.\n편안하지만 똑부러지는 수업으로 재미있는 영어 회화를 이끌어냅니다.\n\nTOEFL 105 / TOEIC 890 보유.",
        imageUrl: "/teacher/hyeonju.jpeg",
        locations: "서울 합정 / 서울 홍대 / 서울 강남",
        pricingDetails: "대면 과외 45,000원 이상\n비대면 과외 40,000원"
    }
];

async function main() {
    console.log('Seeding database...')

    // Create Student
    try {
        const student = await prisma.user.upsert({
            where: { email: 'student@demo.com' },
            update: {},
            create: {
                email: 'student@demo.com',
                password: 'password', // hash later
                name: '박준원 학생',
                role: 'student',
            }
        });
        console.log('Upserted student:', student.name);
    } catch (e) { console.error('Error creating student:', e); }

    // Clean up old tutors (keep known demo student)
    // We delete all users with role 'tutor' to ensure clean state
    try {
        console.log("Cleaning up old data...");
        // SQLite only: Disable Foreign Keys
        await prisma.$executeRawUnsafe("PRAGMA foreign_keys = OFF;");

        // Delete in order of dependency (just in case, but FK OFF handles it)
        await prisma.review.deleteMany({});
        await prisma.like.deleteMany({});
        await prisma.message.deleteMany({});
        await prisma.chatRoom.deleteMany({});
        await prisma.lessonRequest.deleteMany({});
        await prisma.tutorProfile.deleteMany({});

        await prisma.user.deleteMany({
            where: { role: 'tutor' }
        });

        // Re-enable Foreign Keys
        await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;");

        console.log("Deleted old tutors and related data (FK bypassed)");
    } catch (e) {
        console.error("Error cleaning up tutors:", e);
        try { await prisma.$executeRawUnsafe("PRAGMA foreign_keys = ON;"); } catch { }
    }

    // Create Tutors
    for (const t of TUTORS) {
        try {
            const tutor = await prisma.user.create({
                data: {
                    email: t.email,
                    password: 'password',
                    name: t.name,
                    role: 'tutor',
                    tutorProfile: {
                        create: {
                            university: t.university,
                            major: t.major,
                            rating: t.rating,
                            price: t.price,
                            education: t.education,
                            bio: t.bio,
                            imageUrl: t.imageUrl,
                            locations: t.locations,
                            pricingDetails: t.pricingDetails,
                            tags: {
                                create: t.tags.map(tag => ({ name: tag }))
                            }
                        }
                    }
                },
            });
            console.log(`Created tutor ${t.name}`)
        } catch (e) { console.error(`Error creating tutor ${t.name}:`, e); }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
