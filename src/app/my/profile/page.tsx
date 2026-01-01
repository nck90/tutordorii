"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Camera, Upload, Play, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileEditPage() {
    const router = useRouter();

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-white pb-20">
                {/* Header */}
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center">
                        <button onClick={() => router.back()} className="mr-4">
                            <ChevronLeft className="w-6 h-6 text-slate-800" />
                        </button>
                        <h1 className="font-bold text-lg text-slate-900">프로필 수정</h1>
                    </div>
                    <button className="text-blue-600 font-bold text-sm">저장</button>
                </div>

                <div className="p-5 space-y-8">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <Avatar className="w-24 h-24 border-4 border-slate-100">
                                <AvatarImage src="" />
                                <AvatarFallback className="bg-slate-900 text-white text-3xl font-bold">K</AvatarFallback>
                            </Avatar>
                            <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-slate-200">
                                <Camera className="w-4 h-4 text-slate-600" />
                            </button>
                        </div>
                        <p className="mt-3 font-bold text-lg">김수학</p>
                    </div>

                    {/* Video Profile */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-900 mb-3">영상 프로필</h3>
                        <div className="relative aspect-video bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-slate-500" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium">터치하여 영상 업로드</p>
                            <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-md">최대 2분</div>
                        </div>
                    </section>

                    {/* Intro */}
                    <section className="space-y-4">
                        <div>
                            <label className="text-sm font-bold text-slate-900 mb-2 block">한줄 소개</label>
                            <Input defaultValue="IB/AP Chemistry 만점자 배출 50명 이상" className="bg-slate-50 border-slate-200" />
                        </div>
                        <div>
                            <label className="text-sm font-bold text-slate-900 mb-2 block">상세 소개</label>
                            <textarea
                                className="w-full rounded-md px-3 py-2 text-sm min-h-[150px] bg-slate-50 border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-slate-400"
                                defaultValue="안녕하세요, 프린스턴 대학교 화학과 박사 과정 중인 김수학입니다. 단순 암기가 아닌 원리 이해 중심의 수업을 진행합니다..."
                            />
                        </div>
                    </section>

                    {/* Tags */}
                    <section>
                        <label className="text-sm font-bold text-slate-900 mb-3 block">태그 (최대 5개)</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {["#친절한", "#꼼꼼한", "#실전위주", "#멘토링"].map((tag, i) => (
                                <Badge key={i} variant="secondary" className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer flex items-center gap-1">
                                    {tag} <X className="w-3 h-3" />
                                </Badge>
                            ))}
                            <button className="px-3 py-1.5 text-sm bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200 transition-colors">
                                + 추가
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </MobileLayout>
    );
}
