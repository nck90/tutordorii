"use client";

import { useEffect } from "react";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import {
    CreditCard,
    Settings,
    LogOut,
    BookOpen,
    Heart,
    ChevronRight,
    Calendar,
    Bell,
    TrendingUp,
    Clock,
    MoreHorizontal,
    ShieldCheck,
    UserCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function MyPage() {
    const { role, logout } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!role) {
            router.push("/login");
        }
    }, [role, router]);

    if (!role) {
        return null;
    }

    const isTutor = role === "tutor";

    return (
        <MobileLayout>
            <div className="min-h-screen bg-slate-50 pb-24">
                {isTutor ? <TutorView logout={logout} /> : <StudentView logout={logout} />}
            </div>
        </MobileLayout>
    );
}

// ==========================================
// 🎓 STUDENT VIEW
// ==========================================
// ==========================================
// 🎓 STUDENT VIEW (SERVER COMPONENT WRAPPER PATTERN RECOMMENDED, BUT HERE WE USE CLIENT FETCH FOR MVP)
// Actually, to use hooks like useEffect, we must be client. But actions are async.
// Best pattern: Page is Server Component -> Passes data to Client View.
// But this file is "use client" at top.
// So we should fetch in useEffect or convert to Server Component.
// Let's refactor `MyPage` to be a Server Component and split Views into Client Components.
// But wait, `useUser` is client context.
// Compromise: Keep "use client" and fetch data inside useEffect or use SWR/Tanstack Query.
// For MVP without SWR, simple useEffect with state.

import { getMyRequestsAction, getStudentChatRoomsAction, getLikedTutorsAction } from "@/app/actions";
import { useState } from "react";
import { MessageCircle } from "lucide-react";

function StudentView({ logout }: { logout: () => void }) {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [likes, setLikes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const [reqs, rooms, likedTutors] = await Promise.all([
                getMyRequestsAction(),
                getStudentChatRoomsAction(),
                getLikedTutorsAction()
            ]);
            setRequests(reqs);
            setChats(rooms);
            setLikes(likedTutors);
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-10 text-center text-slate-400">데이터를 불러오는 중입니다...</div>;

    return (
        <>
            {/* 1. Simple Minimal Header (Toss Style) */}
            <div className="bg-white px-6 pt-10 pb-6 sticky top-0 z-40">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight leading-snug">
                        박준원 학생님,<br />
                        <span className="text-foreground/60">오늘도 화이팅! 🔥</span>
                    </h1>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        <UserCircle className="w-5 h-5 text-slate-500" />
                    </span>
                </div>
            </div>

            <div className="p-5 space-y-6 pb-24">
                {/* 2. Menu Grid */}
                <div className="grid grid-cols-4 gap-3">
                    <Link href="/my/classes" className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                            <BookOpen className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">수업 일정</span>
                    </Link>
                    <Link href="/my/wishlist" className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                            <Heart className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">찜한 목록</span>
                    </Link>
                    <Link href="/my/coupons" className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                            <CreditCard className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">쿠폰함</span>
                    </Link>
                    <Link href="/my/points" className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-full aspect-square bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-slate-50 transition-colors">
                            <TrendingUp className="w-8 h-8 text-slate-900" strokeWidth={1.5} />
                        </div>
                        <span className="text-[11px] font-bold text-slate-600">포인트</span>
                    </Link>
                </div>

                {/* Promo Banner - Sleek Dark Design */}
                <div className="bg-slate-900 rounded-3xl p-5 text-white flex justify-between items-center shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-transform cursor-pointer">
                    <div>
                        <p className="font-bold text-sm mb-1">친구 초대하고 포인트 받자!</p>
                        <p className="text-xs text-slate-400">친구 한 명당 <span className="text-white font-bold">5,000P</span> 즉시 지급</p>
                    </div>
                    <div className="h-10 w-10 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <ChevronRight className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* 3. My Learning Status */}
                {(chats.length > 0 || requests.length > 0) && (
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 px-1">나의 학습 현황</h3>

                        <div className="space-y-3">
                            {/* Ongoing Chats */}
                            {chats.map((chat) => (
                                <Link href={`/chat/${chat.id}`} key={chat.id} className="block">
                                    <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                                        <div className="relative">
                                            <Avatar className="w-12 h-12">
                                                <AvatarImage src={chat.otherImage} />
                                                <AvatarFallback>{chat.otherName[0]}</AvatarFallback>
                                            </Avatar>
                                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-0.5">
                                                <h4 className="font-bold text-slate-900">{chat.otherName} 선생님</h4>
                                                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold">상담중</span>
                                            </div>
                                            <p className="text-xs text-slate-500 truncate">{chat.lastMessage}</p>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-slate-300" />
                                    </div>
                                </Link>
                            ))}

                            {/* Sent Requests */}
                            {requests.map((req) => (
                                <div key={req.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                                    <div className="flex justify-between items-center mb-2">
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-600 font-normal rounded-md px-2">
                                            {req.subject}
                                        </Badge>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${req.status === 'ACCEPTED' ? 'bg-green-100 text-green-700' :
                                            req.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-600'
                                            }`}>
                                            {req.status === 'ACCEPTED' ? '수락됨' : req.status === 'REJECTED' ? '거절됨' : '대기중'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-bold text-slate-900 mb-1">{req.studentName || '선생님'}에게 보낸 요청</p>
                                    <p className="text-xs text-slate-500 truncate mb-2">{req.message}</p>
                                    <p className="text-[10px] text-slate-400 text-right">
                                        {new Date(req.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 4. Wishlist */}
                {likes.length > 0 && (
                    <section>
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h3 className="text-lg font-bold text-slate-900">찜한 선생님</h3>
                            <Link href="/my/wishlist" className="text-xs text-slate-400 font-medium flex items-center hover:text-slate-600">
                                전체보기 <ChevronRight className="w-3 h-3 ml-0.5" />
                            </Link>
                        </div>
                        <div className="overflow-x-auto pb-4 -mx-5 px-5 flex gap-3 no-scrollbar">
                            {likes.map((tutor) => (
                                <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="block w-[140px] shrink-0">
                                    <div className="bg-white p-2.5 rounded-3xl shadow-sm border border-slate-100">
                                        <div className="aspect-square bg-slate-100 rounded-2xl mb-2 overflow-hidden relative">
                                            {tutor.imageUrl ? (
                                                <img src={tutor.imageUrl} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center w-full h-full text-2xl font-bold text-slate-300">{tutor.name[0]}</div>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">{tutor.name}</h4>
                                        <p className="text-[10px] text-slate-500 truncate">{tutor.university}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 5. App Service Menu */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden divide-y divide-slate-50/50">
                    <Link href="/notice" className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700">공지사항</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                    <Link href="/faq" className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700">자주 묻는 질문</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                    <Link href="/cs" className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700">고객센터 문의하기</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                    <Link href="/settings" className="flex items-center justify-between p-4 px-5 hover:bg-slate-50 transition-colors">
                        <span className="text-sm font-medium text-slate-700">앱 설정</span>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                    </Link>
                </section>

                <div className="pt-2">
                    <button
                        onClick={logout}
                        className="w-full py-4 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors text-center"
                    >
                        로그아웃
                    </button>
                    <div className="text-[10px] text-slate-300 text-center mt-2">
                        버전 1.0.2 &bull; 이용약관 &bull; 개인정보처리방침
                    </div>
                </div>
            </div>
        </>
    );
}

// ==========================================
// 👔 TUTOR VIEW
// ==========================================
import { getTutorChatRoomsAction, acceptRequestAction, rejectRequestAction } from "@/app/actions";

function TutorView({ logout }: { logout: () => void }) {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = async () => {
        const [reqs, rooms] = await Promise.all([
            getMyRequestsAction(), // calls as tutor
            getTutorChatRoomsAction()
        ]);
        setRequests(reqs);
        setChats(rooms);
        setLoading(false);
    }

    useEffect(() => {
        refreshData();
    }, []);

    const handleAccept = async (reqId: string) => {
        await acceptRequestAction(reqId);
        refreshData();
    };

    const handleReject = async (reqId: string) => {
        await rejectRequestAction(reqId);
        refreshData();
    };

    if (loading) return <div className="p-10 text-center text-slate-400">데이터를 불러오는 중입니다...</div>;

    const pendingRequests = requests.filter(r => r.status === 'PENDING');

    return (
        <>
            {/* Header Section */}
            <div className="bg-background/50 backdrop-blur-sm p-6 pt-8 pb-6 border-b border-border sticky top-0 z-40">
                <div className="relative flex justify-between items-start mb-6">
                    <div>
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-foreground mb-3">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[10px] font-bold">VERIFIED TUTOR</span>
                        </div>
                        <h1 className="text-2xl font-bold mb-1 text-foreground">튜터 대시보드</h1>
                        <p className="text-muted-foreground text-sm">오늘의 수업 일정을 확인하세요</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:bg-secondary rounded-full h-10 w-10">
                        <Bell className="w-6 h-6" />
                    </Button>
                </div>

                {/* Profile Stats Card (Monochrome) */}
                <div className="flex items-center gap-5 bg-card p-4 rounded-3xl border border-border shadow-sm">
                    <div className="relative">
                        <Avatar className="w-14 h-14 border border-border">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-secondary text-foreground font-bold text-lg">T</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-1 border-l border-border pl-5">
                        <span className="text-muted-foreground text-xs font-medium block mb-0.5">진행 중인 수업</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-foreground">{chats.length}</span>
                            <span className="text-xs text-muted-foreground">건</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-8">
                {/* Navigation Menu */}
                <div className="grid grid-cols-3 gap-3">
                    <Link href="/my/classes" className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:bg-accent transition-colors">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-1">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">수업 관리</span>
                    </Link>
                    <Link href="/my/profile" className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:bg-accent transition-colors">
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-1">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">프로필 수정</span>
                    </Link>
                    <Link href="/my/settlement" className="flex flex-col items-center gap-2 p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:bg-accent transition-colors">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-1">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold text-slate-600">정산 관리</span>
                    </Link>
                </div>

                {/* 1. Pending Requests */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-red-500" />
                            새로운 요청 ({pendingRequests.length})
                        </h3>
                    </div>

                    <div className="space-y-3">
                        {pendingRequests.length === 0 ? (
                            <div className="text-center py-6 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
                                대기 중인 요청이 없습니다.
                            </div>
                        ) : (
                            pendingRequests.map((req) => (
                                <div key={req.id} className="bg-white p-5 rounded-3xl shadow-sm border border-red-50 ring-1 ring-red-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-3">
                                        <Badge className="bg-red-100 text-red-600 hover:bg-red-100">Action Required</Badge>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-lg mb-1">{req.studentName} 학생</h4>
                                    <p className="text-sm font-bold text-blue-600 mb-4">{req.subject}</p>

                                    <div className="bg-slate-50 p-3 rounded-xl text-sm text-slate-600 mb-4">
                                        "{req.message}"
                                    </div>

                                    <div className="flex gap-2">
                                        <Button className="flex-1 bg-slate-900 hover:bg-slate-800 rounded-xl" onClick={() => handleAccept(req.id)}>
                                            수락하기
                                        </Button>
                                        <Button variant="outline" className="flex-1 border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-xl" onClick={() => handleReject(req.id)}>
                                            거절하기
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* 2. Active Chats */}
                {chats.length > 0 && (
                    <section>
                        <h3 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            진행 중인 상담
                        </h3>
                        <div className="space-y-3">
                            {chats.map((chat) => (
                                <Link href={`/chat/${chat.id}`} key={chat.id} className="block">
                                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4 hover:bg-accent transition-colors">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src="" />
                                            <AvatarFallback>{chat.otherName[0]}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <h4 className="font-bold text-slate-900 truncate">{chat.otherName} 학생</h4>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">{chat.lastMessage}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                <div className="pt-4 pb-8">
                    <button
                        onClick={logout}
                        className="text-xs text-slate-400 underline decoration-slate-300 underline-offset-4 hover:text-slate-600 mx-auto block"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </>
    );
}
