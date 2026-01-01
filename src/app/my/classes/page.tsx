"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Plus, MoreVertical, Users, BookOpen, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function ClassesPage() {
    const { role } = useUser();
    const router = useRouter();

    if (role === "student") {
        return (
            <MobileLayout hideNav>
                <div className="min-h-screen bg-slate-50 pb-20">
                    <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center">
                            <button onClick={() => router.back()} className="mr-4">
                                <ChevronLeft className="w-6 h-6 text-slate-800" />
                            </button>
                            <h1 className="font-bold text-lg text-slate-900">내 강의실</h1>
                        </div>
                    </div>

                    <div className="p-5 space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                            <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 mb-3">진행 중</Badge>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">AP Chemistry 심화</h3>
                            <p className="text-sm text-slate-500 mb-4">Sarah Kim 선생님 | 월/수 20:00</p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12">
                                강의실 입장하기
                            </Button>
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm opacity-70">
                            <Badge variant="outline" className="mb-3">종료됨</Badge>
                            <h3 className="font-bold text-lg text-slate-900 mb-1">IB Math HL 기초</h3>
                            <p className="text-sm text-slate-500 mb-4">David Lee 선생님</p>
                            <Button variant="outline" className="w-full border-slate-200">
                                복습하기
                            </Button>
                        </div>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Header */}
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4">
                            <ChevronLeft className="w-6 h-6 text-slate-800" />
                        </button>
                        <h1 className="font-bold text-lg text-slate-900">수업 및 커리큘럼</h1>
                    </div>
                    <button>
                        <Plus className="w-6 h-6 text-slate-900" />
                    </button>
                </div>

                <div className="p-5 space-y-6">
                    {/* Active Classes */}
                    <div>
                        <h2 className="text-sm font-bold text-slate-500 mb-3 ml-1">진행 중인 수업</h2>
                        <div className="space-y-4">
                            {[
                                { title: "IB Math HL - 심화반", students: 4, schedule: "월/수 20:00", color: "bg-blue-100 text-blue-600" },
                                { title: "AP Chemistry - 개념완성", students: 2, schedule: "화/목 18:00", color: "bg-emerald-100 text-emerald-600" },
                                { title: "SAT Math - 실전 모의고사", students: 1, schedule: "토 10:00", color: "bg-purple-100 text-purple-600" },
                            ].map((cls, idx) => (
                                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
                                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold ${cls.color}`}>
                                        진행중
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-900 mb-1">{cls.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" /> {cls.students}명
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> {cls.schedule}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full text-slate-600 border-slate-200 h-9 text-xs">
                                            <Users className="w-3 h-3 mr-1.5" /> 학생 관리
                                        </Button>
                                        <Button variant="outline" className="w-full text-slate-600 border-slate-200 h-9 text-xs">
                                            <BookOpen className="w-3 h-3 mr-1.5" /> 커리큘럼 수정
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pending / Completed */}
                    <div>
                        <h2 className="text-sm font-bold text-slate-500 mb-3 ml-1">종료된 수업</h2>
                        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm opacity-60">
                            <h3 className="font-bold text-lg text-slate-900 mb-1">IB Physics SL - 내신 대비</h3>
                            <p className="text-sm text-slate-500">2024.08 ~ 2024.11 (종료)</p>
                        </div>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
