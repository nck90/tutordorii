"use client";

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
import { motion } from "framer-motion";

export default function MyPage() {
    const { role, logout } = useUser();
    const router = useRouter();

    if (!role) {
        if (typeof window !== 'undefined') router.push("/login");
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
function StudentView({ logout }: { logout: () => void }) {
    const router = useRouter();

    return (
        <>
            {/* Header Section */}
            <div className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 mb-1">박준원 학생님</h1>
                        <p className="text-slate-500 text-sm font-medium">오늘도 목표를 향해 달려보세요! 🔥</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:bg-slate-100 rounded-full">
                        <Bell className="w-6 h-6" />
                    </Button>
                </div>

                {/* Profile Stats Card */}
                <div className="flex items-center gap-5">
                    <Avatar className="w-20 h-20 border-4 border-slate-50 shadow-lg">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-2xl">P</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-2xl text-center border border-blue-100">
                            <p className="text-xs text-blue-600 font-bold mb-1">이번 주 학습</p>
                            <p className="text-xl font-extrabold text-blue-900">12<span className="text-sm font-medium text-blue-600 ml-0.5">시간</span></p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl text-center border border-slate-100">
                            <p className="text-xs text-slate-500 font-bold mb-1">보유 쿠폰</p>
                            <p className="text-xl font-extrabold text-slate-900">2<span className="text-sm font-medium text-slate-500 ml-0.5">장</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-8">
                {/* 1. Learning Report Graph (CSS Bar Chart) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-500" />
                            학습 리포트
                        </h3>
                        <Button variant="ghost" size="sm" className="text-slate-400 text-xs h-8 px-2 hover:text-slate-600 hover:bg-transparent">
                            전체보기 <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
                        <div className="flex items-end justify-between h-32 gap-2 mt-2">
                            {/* Mock Data Bars */}
                            {[40, 65, 30, 85, 50, 95, 20].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                    <div className="w-full relative h-full flex items-end justify-center rounded-t-lg bg-slate-100 overflow-hidden group-hover:bg-blue-50 transition-colors">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
                                            className={`w-full bg-blue-500 rounded-t-md opacity-80 group-hover:opacity-100`}
                                        />
                                    </div>
                                    <span className={`text-[10px] font-bold ${i === 5 ? "text-blue-600" : "text-slate-400"}`}>
                                        {["월", "화", "수", "목", "금", "토", "일"][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-xs text-slate-500 mt-4 font-medium">
                            지난주보다 <span className="text-blue-600 font-bold">3시간 20분</span> 더 공부했어요! 🎉
                        </p>
                    </div>
                </section>

                {/* 2. Upcoming Classes (Horizontal Scroll) */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        다가오는 수업
                    </h3>
                    <div className="flex overflow-x-auto pb-4 -mx-5 px-5 gap-4 scrollbar-hide snap-x">
                        {/* Card 1 */}
                        <div className="min-w-[280px] bg-slate-900 rounded-3xl p-5 text-white shadow-xl shadow-slate-200 snap-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-5 opacity-10">
                                <BookOpen className="w-24 h-24" />
                            </div>
                            <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 mb-4 backdrop-blur-md">오늘 13:00</Badge>
                            <h4 className="text-xl font-bold mb-1">AP Chemistry 심화</h4>
                            <p className="text-slate-300 text-sm mb-6">Sarah Kim 선생님</p>
                            <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-white/90 font-bold rounded-xl">
                                강의실 입장하기
                            </Button>
                        </div>
                        {/* Card 2 */}
                        <div className="min-w-[280px] bg-white rounded-3xl p-5 text-slate-900 border border-slate-200 shadow-sm snap-center">
                            <Badge variant="secondary" className="bg-slate-100 text-slate-600 mb-4">내일 15:00</Badge>
                            <h4 className="text-xl font-bold mb-1">IB Math HL 문제풀이</h4>
                            <p className="text-slate-500 text-sm mb-6">David Lee 선생님</p>
                            <Button size="sm" variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50">
                                수업 준비하기
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 3. Menu List */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 ml-1">설정 및 관리</h3>
                    {[
                        { icon: Heart, label: "찜한 선생님", count: "4명" },
                        { icon: CreditCard, label: "결제 및 계좌 관리", count: null },
                        { icon: Settings, label: "앱 설정", count: null },
                    ].map((item, idx) => (
                        <button key={idx} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm hover:translate-x-1 transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                {item.count && <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{item.count}</span>}
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </button>
                    ))}
                </section>

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

// ==========================================
// 👔 TUTOR VIEW (Placeholder for next step)
// ==========================================
function TutorView({ logout }: { logout: () => void }) {
    const router = useRouter();

    return (
        <>
            {/* Header Section */}
            <div className="bg-black p-6 pb-8 rounded-b-[2rem] shadow-xl shadow-slate-900/20 relative z-10 text-white">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">김수학 선생님</h1>
                        <p className="text-slate-400 text-sm font-medium">프리미엄 튜터 인증 완료 <ShieldCheck className="w-4 h-4 text-blue-400 inline ml-1" /></p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-300 hover:bg-white/10 rounded-full">
                        <Bell className="w-6 h-6" />
                    </Button>
                </div>

                {/* Profile Stats Card (Dark Theme) */}
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-slate-800 shadow-xl">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-slate-700 text-slate-300 font-bold text-2xl">K</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-slate-900">PRO</div>
                    </div>

                    <div className="flex-1">
                        <div className="flex justify-between items-end mb-1">
                            <span className="text-slate-400 text-xs font-bold">이번 달 예상 수입</span>
                            <Link href="/my/settlement" className="text-blue-400 text-xs font-medium cursor-pointer hover:underline">정산 내역 &gt;</Link>
                        </div>
                        <p className="text-3xl font-extrabold tracking-tight">2,450,000<span className="text-lg font-medium text-slate-500 ml-1">원</span></p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-8">
                {/* 1. Revenue Dashboard Chart (Line Chart Mock) */}
                <section>
                    <h3 className="text-lg font-bold text-slate-900 mb-4 px-1 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-500" />
                        수입 리포트
                    </h3>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <CreditCard className="w-32 h-32" />
                        </div>

                        {/* Chart Area */}
                        <div className="h-40 flex items-end justify-between gap-1 relative z-10">
                            {/* Simple SVG Line Chart Mock using CSS borders/positioning or just bars for MVP stability */}
                            {[20, 45, 30, 60, 55, 80, 65].map((h, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="w-full h-full flex items-end justify-center rounded-sm">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.05 }}
                                            className="w-2 bg-slate-100 rounded-full relative group-hover:bg-slate-200"
                                        >
                                            {/* Active Point */}
                                            {i === 6 && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-md animate-bounce" />
                                            )}
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-medium">{i + 1}주</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex gap-3">
                            <Button className="flex-1 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold" asChild>
                                <Link href="/my/settlement">
                                    정산 신청하기
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 2. Today's Schedule (Timeline) */}
                <section>
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-500" />
                            오늘의 수업
                        </h3>
                        <Badge variant="outline" className="border-blue-200 text-blue-600 bg-blue-50">3건 예정</Badge>
                    </div>

                    <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100 divide-y divide-slate-100">
                        {[
                            { time: "14:00", subject: "IB Math HL", student: "김지민 학생", status: "finished" },
                            { time: "16:00", subject: "AP Chemistry", student: "James Park", status: "upcoming" },
                            { time: "19:00", subject: "SAT Math 실전", student: "이준호 학생", status: "upcoming" },
                        ].map((cls, idx) => (
                            <div key={idx} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors rounded-2xl group cursor-pointer">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${cls.status === 'finished' ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-600'}`}>
                                    {cls.time}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold text-base ${cls.status === 'finished' ? 'text-slate-400 decoration-slate-300 line-through' : 'text-slate-800'}`}>
                                        {cls.subject}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium">{cls.student}</p>
                                </div>
                                {cls.status === 'upcoming' && (
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-8 px-3 text-xs">
                                        입장
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* 3. Menu List */}
                <section className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-400 ml-1">관리</h3>
                    {[
                        { icon: BookOpen, label: "커리큘럼 및 수업 관리", href: "/my/classes" },
                        { icon: UserCircle, label: "프로필 수정", href: "/my/profile" },
                        { icon: Settings, label: "튜터 설정", href: "/my/settings" },
                    ].map((item, idx) => (
                        <Link key={idx} href={item.href} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-100 shadow-sm hover:translate-x-1 transition-transform">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-slate-50 rounded-xl text-slate-600">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                            </div>
                        </Link>
                    ))}
                </section>

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
