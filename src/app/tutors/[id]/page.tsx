"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star, ShieldCheck, Share, ArrowLeft, Heart, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function TutorDetailPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("info");
    const [isPlaying, setIsPlaying] = useState(false);

    // Mock data for MVP
    const tutor = {
        name: "Sarah Kim",
        university: "Princeton University",
        major: "Chemistry",
        education: [
            "Princeton University Chemistry Ph.D Candidate",
            "Seoul National University Chemistry B.S."
        ],
        tags: ["AP Chemistry", "IB Chem HL", "SAT Math", "College Essay"],
        rating: 4.9,
        reviews: 42,
        price: "120,000",
        bio: "IB/AP Chemistry 만점자 배출 50명 이상. \n단순 암기가 아닌 원리 이해 중심의 수업을 진행합니다.\n프린스턴 박사 과정 중으로 최신 입시 트렌드를 완벽하게 분석해드립니다."
    };

    return (
        <MobileLayout hideNav>
            <div className="pb-32 relative">

                {/* Sticky Header Actions (Back/Share) */}
                <div className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none max-w-md mx-auto">
                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg pointer-events-auto bg-black/50 text-white border-0 hover:bg-black/70 backdrop-blur-md" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex gap-2 pointer-events-auto">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-black/50 text-white border-0 hover:bg-black/70 backdrop-blur-md">
                            <Share className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg bg-black/50 text-white border-0 hover:bg-black/70 backdrop-blur-md">
                            <Heart className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Hero Area: 3D Flip Card (Image -> Video) */}
                <div className="relative w-full h-[500px] bg-slate-900 perspective-1000">
                    <motion.div
                        initial={false}
                        animate={{ rotateY: isPlaying ? 180 : 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                        className="w-full h-full relative preserve-3d"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {/* === FRONT FACE: Profile Image === */}
                        <div className={`absolute inset-0 backface-hidden transition-opacity duration-500 ${isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                            {/* Background Image */}
                            <div className="w-full h-full bg-slate-800 relative">
                                {/* Mock Profile Image Placeholder - Replace with Real Image tag in production */}
                                <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                                    <span className="text-9xl opacity-20 select-none">SK</span>
                                    {/* Ideally: <img src="..." className="w-full h-full object-cover" /> */}
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            </div>

                            {/* Info Overlay (Left) */}
                            <div className="absolute bottom-3 left-6 z-30 max-w-[calc(100%-140px)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-blue-600/90 hover:bg-blue-700 text-white border-0 px-2 py-0.5 text-xs backdrop-blur-md">Verified Pro</Badge>
                                    <div className="flex items-center text-amber-400 font-bold text-xs bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">
                                        <Star className="h-3 w-3 fill-current mr-1" />
                                        {tutor.rating} ({tutor.reviews})
                                    </div>
                                </div>
                                <h1 className="text-4xl font-extrabold text-white mb-2 drop-shadow-md tracking-tight leading-none">{tutor.name}</h1>
                                <p className="text-base text-white/90 flex items-center font-medium drop-shadow-sm">
                                    <GraduationCap className="h-5 w-5 mr-2 text-white/70" />
                                    {tutor.university} {tutor.major}
                                </p>
                            </div>

                            {/* Flip Trigger Button (Right) */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPlaying(true); }}
                                className="absolute bottom-3 right-6 z-40 bg-white/10 backdrop-blur-md border border-white/30 rounded-full pl-3 pr-4 py-2 group hover:bg-white/20 transition-all flex items-center gap-3 shadow-xl"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse">
                                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-0.5" />
                                </div>
                                <div className="text-left hidden xs:block">
                                    <p className="text-[10px] text-white/70 font-medium leading-none mb-1">2분 미리보기</p>
                                    <p className="text-white font-bold text-sm leading-none">영상 재생</p>
                                </div>
                            </button>
                        </div>

                        {/* === BACK FACE: Video Player === */}
                        <div
                            className="absolute inset-0 backface-hidden bg-black"
                            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                        >
                            <video
                                autoPlay={isPlaying}
                                controls
                                className="w-full h-full object-contain"
                            >
                                <source src="https://cdn.pixabay.com/video/2016/09/21/5362-183786196_large.mp4" type="video/mp4" />
                            </video>

                            {/* Return Flip Button */}
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                                className="absolute top-20 right-4 bg-black/50 text-white rounded-full px-3 py-1.5 hover:bg-black/70 backdrop-blur z-50 flex items-center gap-1 border border-white/10"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                <span className="text-xs font-bold">프로필로 돌아가기</span>
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Sticky Tabs */}
                <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/50">
                    <div className="flex">
                        {["소개(Info)", "커리큘럼(Curriculum)", "리뷰(Reviews)"].map((tab) => {
                            const key = tab.split("(")[0]; // simple key
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={cn(
                                        "flex-1 py-4 text-sm font-bold border-b-2 transition-colors",
                                        isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {key}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-8 min-h-[500px]">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                        {tutor.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Bio */}
                    <section>
                        <h3 className="text-lg font-bold mb-4">선생님 소개</h3>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {tutor.bio}
                        </p>
                    </section>

                    {/* Education */}
                    <section className="bg-secondary/20 p-5 rounded-2xl border border-border/50">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-primary" />
                            학력 및 인증
                        </h3>
                        <ul className="space-y-4">
                            {tutor.education.map((edu, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0" />
                                    <span className="text-foreground/90 font-medium">{edu}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>
            </div>

            {/* Completely Fixed Bottom CTA - Outside of scroll container if possible, but here inside MobileLayout relative container works if designed right */}
            <div className="fixed bottom-0 left-0 right-0 p-5 pb-10 bg-background border-t border-border/50 max-w-md mx-auto z-[60]">
                <div className="flex items-center gap-3">
                    <div className="flex-1">
                        <p className="text-xs text-muted-foreground font-medium">1시간 수업료</p>
                        <p className="text-xl font-bold tracking-tight">{tutor.price}원<span className="text-sm font-normal text-muted-foreground">/hr</span></p>
                    </div>
                    <Button size="lg" className="flex-[2] h-14 text-base font-bold shadow-xl shadow-primary/20" asChild>
                        <Link href={`/tutors/1/book`}>
                            시범 수업 신청하기
                        </Link>
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}
