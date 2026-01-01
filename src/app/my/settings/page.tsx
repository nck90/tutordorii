"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
    const router = useRouter();

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Header */}
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center border-b border-slate-100">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">설정</h1>
                </div>

                <div className="p-5 space-y-6">
                    <section className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                        {[
                            "알림 설정",
                            "마케팅 정보 수신 동의",
                            "화면 모드 (라이트/다크)"
                        ].map((label, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-0">
                                <span className="font-medium text-slate-900">{label}</span>
                                <div className="w-11 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform" />
                                </div>
                            </div>
                        ))}
                    </section>

                    <section className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                        <div className="p-4 border-b border-slate-50">
                            <span className="font-medium text-slate-900">로그아웃</span>
                        </div>
                        <div className="p-4">
                            <span className="font-medium text-red-500">회원 탈퇴</span>
                        </div>
                    </section>
                </div>
            </div>
        </MobileLayout>
    );
}
