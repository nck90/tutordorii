'use server'

import { prisma } from "@/lib/prisma"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { writeFile } from "fs/promises"
import { join } from "path"

// --- Auth Actions ---

// --- Chat & Request Actions for Tabbed View ---

export async function getMyPendingRequestsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    const role = cookieStore.get("session_user_role")?.value

    if (!userId) return []

    // Requests that are PENDING (waiting for tutor acceptance)
    const whereCondition = role === "tutor"
        ? { tutorId: userId, status: "PENDING" }
        : { studentId: userId, status: "PENDING" }

    // For students: "Waitlist"
    // For tutors: "Incoming Requests"

    const requests = await prisma.lessonRequest.findMany({
        where: whereCondition,
        include: {
            student: true,
            tutor: { include: { tutorProfile: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return requests.map(req => ({
        id: req.id,
        // UI expects 'otherName', 'otherImage' etc.
        otherName: role === "tutor" ? req.student.name : req.tutor.name,
        otherImage: role === "tutor" ? "" : (req.tutor.tutorProfile?.imageUrl || ""),
        message: req.message,
        subject: req.subject,
        createdAt: req.createdAt,
        type: 'request'
    }))
}

export async function getMyOngoingChatsAction() {
    const cookieStore = await cookies()
    const role = cookieStore.get("session_user_role")?.value

    if (role === 'tutor') {
        const chats = await getTutorChatRoomsAction()
        return chats.map(c => ({ ...c, type: 'chat' }))
    } else {
        const chats = await getStudentChatRoomsAction()
        return chats.map(c => ({ ...c, type: 'chat' }))
    }
}
export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const role = formData.get("role") as string // "student" | "tutor"

    if (!email || !password) {
        return { error: "이메일과 비밀번호를 입력해주세요." }
    }

    // Simple Auth Logic (In production, use bcrypt)
    const user = await prisma.user.findUnique({
        where: { email },
    })

    // Demo: If user doesn't exist, maybe fail or auto-create? 
    // For this demo, we expect seeded users.
    if (!user || user.password !== password) {
        return { error: "이메일 또는 비밀번호가 일치하지 않습니다." }
    }

    // Set Session Cookie
    const cookieStore = await cookies()
    cookieStore.set("session_user_id", user.id)
    cookieStore.set("session_user_role", user.role)

    // Redirect based on role and onboarding status
    if (user.role === "student") {
        if (user.isOnboarded) {
            redirect("/")
        } else {
            redirect("/onboarding")
        }
    } else {
        redirect("/")
    }
}

export async function registerAction(formData: FormData) {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string
    const role = formData.get("role") as string // 'student' or 'tutor'

    if (!email || !password || !name) {
        return { error: "모든 필드를 입력해주세요." }
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return { error: "이미 가입된 이메일입니다." }
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                password, // Plain text for MVP as requested
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
        })

        const cookieStore = await cookies()
        cookieStore.set("session_user_id", newUser.id)
        cookieStore.set("session_user_role", newUser.role)

        // Return success or redirect
        // We can't redirect inside try-catch easily if we want to handle errors, 
        // but redirect in server actions throws error (NEXT_REDIRECT), so it should be outside or caught and rethrown.
        // Let's redirect at the end.

    } catch (e) {
        // catch NEXT_REDIRECT
        // check if error is redirect
        // In Next.js, redirect() throws an error.

        console.error(e)
        // If it's a redirect error, rethrow it, otherwise return error
        // Actually, cleaner to do redirect outside try/catch if success.
        return { error: "회원가입 중 오류가 발생했습니다." }
    }

    redirect(role === 'tutor' ? '/tutor-register' : '/onboarding')
}

export async function completeOnboardingAction(answers: Record<number, string>) {
    console.log("completeOnboardingAction called with:", answers);
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    console.log("Session User ID:", userId);

    if (!userId) {
        console.error("No user ID found in session");
        throw new Error("Unauthorized")
    }

    try {
        const result = await prisma.user.update({
            where: { id: userId },
            data: {
                isOnboarded: true,
                onboardingData: JSON.stringify(answers)
            }
        })
        console.log("User updated successfully:", result.id);
    } catch (error) {
        console.error("Failed to update user onboarding:", error);
        throw error;
    }

    redirect("/")
}

export async function getTutorByIdAction(id: string) {
    const tutor = await prisma.user.findUnique({
        where: { id },
        include: {
            tutorProfile: {
                include: {
                    tags: true,
                    reviews: {
                        include: { author: true },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            }
        }
    })

    if (!tutor) return null

    return {
        id: tutor.id,
        name: tutor.name,
        university: tutor.tutorProfile?.university || "",
        major: tutor.tutorProfile?.major || "",
        bio: tutor.tutorProfile?.bio || "",
        education: [
            `${tutor.tutorProfile?.university} ${tutor.tutorProfile?.major}`
        ],
        tags: tutor.tutorProfile?.tags.map(tag => tag.name) || [],
        rating: tutor.tutorProfile?.rating || 0,
        reviews: tutor.tutorProfile?.reviewCount || 0,
        price: (tutor.tutorProfile?.price || 0).toLocaleString(),
        imageUrl: tutor.tutorProfile?.imageUrl || "",
        reviewList: tutor.tutorProfile?.reviews.map(r => ({
            id: r.id,
            authorName: r.author.name,
            rating: r.rating,
            content: r.content,
            createdAt: r.createdAt
        })) || []
    }
}

export async function createReviewAction(tutorUserId: string, rating: number, content: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!userId) return { error: "Unauthorized" }

    const tutor = await prisma.user.findUnique({
        where: { id: tutorUserId },
        include: { tutorProfile: true }
    })

    if (!tutor || !tutor.tutorProfile) return { error: "Tutor not found" }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Review
            await tx.review.create({
                data: {
                    authorId: userId,
                    tutorId: tutorUserId,
                    tutorProfileId: tutor.tutorProfile!.id,
                    rating,
                    content
                }
            })

            // 2. Recalculate Rating
            const aggregations = await tx.review.aggregate({
                where: { tutorProfileId: tutor.tutorProfile!.id },
                _avg: { rating: true },
                _count: { rating: true }
            })

            // 3. Update Profile
            await tx.tutorProfile.update({
                where: { id: tutor.tutorProfile!.id },
                data: {
                    rating: aggregations._avg.rating || 0,
                    reviewCount: aggregations._count.rating || 0
                }
            })
        })

        revalidatePath(`/tutors/${tutorUserId}`)
        return { success: true }
    } catch (e) {
        console.error(e)
        return { error: "Failed to create review" }
    }
}

export async function createLessonRequestAction(tutorId: string, subject: string, message: string) {
    const cookieStore = await cookies()
    const studentId = cookieStore.get("session_user_id")?.value

    if (!studentId) {
        return { error: "로그인이 필요합니다." }
    }

    await prisma.lessonRequest.create({
        data: {
            studentId,
            tutorId,
            subject,
            message,
            status: "PENDING"
        }
    })

    revalidatePath("/") // Update dashboard if needed
    revalidatePath("/my")
    return { success: true }
}

export async function acceptRequestAction(requestId: string) {
    // This is typically done by Tutor.
    // For MVP, we don't enforce strict tutor auth check here to allow easy testing, 
    // but in prod, check if session_user == request.tutorId

    const request = await prisma.lessonRequest.findUnique({
        where: { id: requestId }
    })

    if (!request) return { error: "Request not found" }

    // Use transaction to ensure both happen or neither
    await prisma.$transaction(async (tx) => {
        // 1. Update Status
        await tx.lessonRequest.update({
            where: { id: requestId },
            data: { status: "ACCEPTED" }
        })

        // 2. Create Chat Room
        // Check if exists first? (One chat per pair usually, but here One chat per Request seems safer for lesson-specific chat)
        // Schema says chatRoom.requestId is unique, so 1:1.

        const chatRoom = await tx.chatRoom.create({
            data: {
                requestId: request.id,
                studentId: request.studentId,
                tutorId: request.tutorId,
                messages: {
                    create: {
                        senderId: request.tutorId,
                        content: `안녕하세요! '${request.subject}' 수업 요청해주셔서 감사합니다. 언제 시범 수업을 진행하면 좋을까요?`
                    }
                }
            }
        })
    })

    revalidatePath("/my")
    return { success: true }
}

export async function rejectRequestAction(requestId: string) {
    // Auth check should be here in prod

    await prisma.lessonRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" }
    })

    revalidatePath("/my")
    return { success: true }
}

export async function getStudentChatRoomsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    if (!userId) return []

    const chats = await prisma.chatRoom.findMany({
        where: { studentId: userId },
        include: {
            tutor: {
                include: { tutorProfile: true }
            },
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            request: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    return chats.map(chat => ({
        id: chat.id,
        otherName: chat.tutor.name,
        otherImage: chat.tutor.tutorProfile?.imageUrl,
        lastMessage: chat.messages[0]?.content || "No messages yet",
        updatedAt: chat.messages[0]?.createdAt || chat.createdAt,
        requestId: chat.requestId,
        status: chat.request.status
    }))
}

export async function getTutorChatRoomsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    if (!userId) return []

    const chats = await prisma.chatRoom.findMany({
        where: { tutorId: userId },
        include: {
            student: true,
            messages: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            request: true
        },
        orderBy: { updatedAt: 'desc' }
    })

    return chats.map(chat => ({
        id: chat.id,
        otherName: chat.student.name,
        otherImage: "", // Students don't have profile images yet in this MVP schema, or use generic
        lastMessage: chat.messages[0]?.content || "No messages yet",
        updatedAt: chat.messages[0]?.createdAt || chat.createdAt,
        requestId: chat.requestId,
        status: chat.request.status
    }))
}

export async function getChatDetailsAction(chatId: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    // Auth check: Is user in this chat?
    const chat = await prisma.chatRoom.findUnique({
        where: { id: chatId },
        include: {
            student: true,
            tutor: true,
            messages: {
                orderBy: { createdAt: 'asc' }
            }
        }
    })

    if (!chat) return null
    if (chat.studentId !== userId && chat.tutorId !== userId) return null

    // Mark as read (simple version: update all messages from other to read)
    // Skipped for MVP performance

    return {
        ...chat,
        otherUserName: userId === chat.studentId ? chat.tutor.name : chat.student.name,
        currentUserId: userId
    }
}

export async function sendMessageAction(chatId: string, content: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!content.trim()) return

    await prisma.message.create({
        data: {
            chatRoomId: chatId,
            senderId: userId!,
            content: content
        }
    })

    revalidatePath(`/chat/${chatId}`)
}

export async function logoutAction() {
    const cookieStore = await cookies()
    cookieStore.delete("session_user_id")
    cookieStore.delete("session_user_role")
    redirect("/login")
}

// --- Data Fetching Actions ---

// --- Data Fetching Actions ---

export async function getTutorsAction(query?: string, tags?: string[], sort?: 'rating' | 'newest', minPrice?: number, maxPrice?: number) {
    // Basic filter logic
    const whereClause: any = { role: "tutor" }

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
        ]
    }

    if (tags && tags.length > 0) {
        whereClause.tutorProfile = {
            ...whereClause.tutorProfile,
            tags: {
                some: {
                    name: { in: tags }
                }
            }
        }
    }

    // Price Filter
    if ((minPrice !== undefined && minPrice > 0) || (maxPrice !== undefined && maxPrice < 1000000)) {
        whereClause.tutorProfile = {
            ...whereClause.tutorProfile,
            price: {
                gte: minPrice || 0,
                lte: maxPrice || 1000000
            }
        }
    }

    let orderBy: any = undefined;
    if (sort === 'rating') {
        orderBy = { tutorProfile: { rating: 'desc' } }
    } else if (sort === 'newest') {
        orderBy = { createdAt: 'desc' }
    }

    const tutors = await prisma.user.findMany({
        where: whereClause,
        include: {
            tutorProfile: {
                include: { tags: true }
            }
        },
        orderBy: orderBy
    })

    // Map to format UI expects
    return tutors.map(t => ({
        id: t.id,
        name: t.name,
        university: t.tutorProfile?.university || "",
        major: t.tutorProfile?.major || "",
        tags: t.tutorProfile?.tags.map(tag => tag.name) || [],
        rating: t.tutorProfile?.rating || 0,
        imageUrl: t.tutorProfile?.imageUrl || ""
    }))
}

export async function getSettlementAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!userId) return { totalAmount: 0, history: [] }

    // Check if user is tutor
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { tutorProfile: true }
    })

    if (!user || user.role !== 'tutor' || !user.tutorProfile) return { totalAmount: 0, history: [] }

    const price = user.tutorProfile.price || 0

    // Fetch ACCEPTED requests (Assume 1 request = 1 payment for MVP)
    const requests = await prisma.lessonRequest.findMany({
        where: {
            tutorId: userId,
            status: "ACCEPTED"
        },
        include: { student: true },
        orderBy: { updatedAt: 'desc' }
    })

    const totalAmount = requests.length * price

    const history = requests.map(r => ({
        id: r.id,
        title: `${r.student.name} 학생 수업료`,
        date: r.updatedAt,
        amount: price
    }))

    return { totalAmount, history }
}

// --- Data Fetching Actions ---

export async function updateTutorProfileAction(formData: FormData) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!userId) return { error: "Unauthorized" }

    const bio = formData.get("bio") as string
    const university = formData.get("university") as string
    const major = formData.get("major") as string
    const price = parseInt(formData.get("price") as string || "0")

    // Image Upload Logic
    const image = formData.get("image") as File | null
    let imageUrl: string | undefined = undefined

    if (image && image.size > 0 && image.name !== "undefined") {
        try {
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)

            // Validate file type (basic)
            if (!image.type.startsWith("image/")) {
                return { error: "이미지 파일만 업로드 가능합니다." }
            }

            const filename = `${Date.now()}-${image.name.replace(/\s/g, '_')}`
            const uploadPath = join(process.cwd(), "public", "uploads", filename)

            await writeFile(uploadPath, buffer)
            imageUrl = `/uploads/${filename}`
        } catch (error) {
            console.error("Image upload failed:", error)
            return { error: "이미지 업로드 중 오류가 발생했습니다." }
        }
    }

    await prisma.tutorProfile.update({
        where: { userId },
        data: {
            bio,
            university,
            major,
            price,
            ...(imageUrl && { imageUrl })
        }
    })

    revalidatePath("/my")
    revalidatePath("/my/profile")
    revalidatePath("/tutors/" + userId)
    revalidatePath("/") // Update Home as well since tutor cards are there
    return { success: true }
}

// --- Like System ---

export async function toggleLikeAction(tutorUserId: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    if (!userId) return { error: "Unauthorized" }

    const tutor = await prisma.user.findUnique({
        where: { id: tutorUserId },
        include: { tutorProfile: true }
    })

    if (!tutor || !tutor.tutorProfile) return { error: "Tutor not found" }

    const existing = await prisma.like.findUnique({
        where: {
            studentId_tutorId: {
                studentId: userId,
                tutorId: tutorUserId
            }
        }
    })

    if (existing) {
        await prisma.like.delete({ where: { id: existing.id } })
    } else {
        await prisma.like.create({
            data: {
                studentId: userId,
                tutorId: tutorUserId,
                tutorProfileId: tutor.tutorProfile.id
            }
        })
    }

    revalidatePath(`/tutors/${tutorUserId}`)
    return { success: true, isLiked: !existing }
}

export async function getTutorAction(tutorId: string) {
    const cookieStore = await cookies()
    const currentUserId = cookieStore.get("session_user_id")?.value

    const tutor = await prisma.user.findUnique({
        where: { id: tutorId },
        include: {
            tutorProfile: {
                include: { tags: true }
            }
        }
    })

    if (!tutor) return null

    let isLiked = false
    if (currentUserId) {
        const like = await prisma.like.findUnique({
            where: {
                studentId_tutorId: {
                    studentId: currentUserId,
                    tutorId: tutorId
                }
            }
        })
        isLiked = !!like
    }

    return { ...tutor, isLiked }
}


export async function getLikedTutorsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    if (!userId) return []

    const likes = await prisma.like.findMany({
        where: { studentId: userId },
        include: {
            tutor: true,
            tutorProfile: { include: { tags: true } }
        }
    })

    return likes.map(like => ({
        id: like.tutor.id,
        name: like.tutor.name,
        university: like.tutorProfile.university || "Unknown",
        major: like.tutorProfile.major || "Unknown",
        tags: like.tutorProfile.tags.map(t => t.name),
        rating: like.tutorProfile.rating,
        imageUrl: like.tutorProfile.imageUrl || ""
    }))
}

export async function getMyRequestsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    const role = cookieStore.get("session_user_role")?.value

    if (!userId) return []

    if (role === "student") {
        const requests = await prisma.lessonRequest.findMany({
            where: { studentId: userId },
            include: {
                tutor: {
                    include: { tutorProfile: true }
                },
                chatRoom: true
            },
            orderBy: { createdAt: 'desc' }
        })
        // Format for UI? Or return raw. Returning Raw with some formatting is safe.
        // But the current UI expects keys: id, subject, message, status ...
        // and now 'chatRoomId' if active.
        return requests.map(r => ({
            ...r,
            tutorName: r.tutor.name,
            chatRoomId: r.chatRoom?.id
        }))

    } else {
        // Tutor View
        const requests = await prisma.lessonRequest.findMany({
            where: { tutorId: userId },
            include: {
                student: true,
                chatRoom: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return requests.map(r => ({
            ...r,
            studentName: r.student.name,
            chatRoomId: r.chatRoom?.id
        }))
    }
}

export async function getMyScheduleAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value
    const role = cookieStore.get("session_user_role")?.value

    if (!userId) return []

    // Fetch ACCEPTED requests
    const whereCondition = role === "student"
        ? { studentId: userId, status: "ACCEPTED" }
        : { tutorId: userId, status: "ACCEPTED" }

    const schedules = await prisma.lessonRequest.findMany({
        where: whereCondition,
        include: {
            student: true,
            tutor: {
                include: { tutorProfile: true }
            }
        },
        orderBy: { updatedAt: 'desc' }
    })

    return schedules.map(s => ({
        id: s.id,
        subject: s.subject,
        otherName: role === "student" ? s.tutor.name : s.student.name,
        time: "시간 미정", // Schema doesn't have schedule time yet
        status: s.status,
        date: s.updatedAt
    }))
}

export async function getTutorDashboardStatsAction() {
    const cookieStore = await cookies()
    const userId = cookieStore.get("session_user_id")?.value

    if (!userId) return { todayClassCount: 0, monthlyIncome: 0, newRequestsCount: 0 }

    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    // Parallel fetch
    const [todayClasses, monthlyCompleted, newRequests] = await Promise.all([
        // 1. Today's Classes: Accepted requests updated today (Mock logic for "Check-in")
        prisma.lessonRequest.count({
            where: {
                tutorId: userId,
                status: "ACCEPTED",
                updatedAt: { gte: startOfDay }
            }
        }),
        // 2. Monthly Income: Sum of price for accepted requests this month
        prisma.lessonRequest.findMany({
            where: {
                tutorId: userId,
                status: "ACCEPTED",
                updatedAt: { gte: startOfMonth }
            },
            include: {
                tutor: {
                    include: { tutorProfile: true }
                }
            }
        }),
        // 3. New Requests
        prisma.lessonRequest.count({
            where: {
                tutorId: userId,
                status: "PENDING"
            }
        })
    ])

    // Calculate Income
    // Logic: Each accepted request counts as 1 hour * price.
    // In real app, we'd have a Lesson table. Here we use Request as proxy.
    const monthlyIncome = monthlyCompleted.reduce((acc, req) => {
        return acc + (req.tutor.tutorProfile?.price || 0)
    }, 0)

    return {
        todayClassCount: todayClasses,
        monthlyIncome: monthlyIncome,
        newRequestsCount: newRequests
    }
}

export async function getPopularTagsAction() {
    // In a real app we would use groupBy but SQLite connector availability varies.
    // For now we simulate it by fetching all tags.
    // Ideally: prisma.tag.groupBy({ by: ['name'], _count: { tutors: true } })
    const tags = await prisma.tag.findMany({
        include: { _count: { select: { tutors: true } } }
    })

    // Sort by usage count descending and take top 8
    return tags.sort((a, b) => b._count.tutors - a._count.tutors)
        .slice(0, 8)
        .map(t => t.name)
}
