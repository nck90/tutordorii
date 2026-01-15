"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Share, ArrowLeft, Heart, GraduationCap, MapPin, CreditCard, ChevronRight, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { toggleLikeAction } from "@/app/actions";

interface Tutor {
    id: string;
    name: string;
    university: string;
    major: string;
    bio: string;
    education: string[];
    tags: string[];
    rating: number;
    reviews: number;
    price: string;
    imageUrl: string;
    locations?: string;
    pricingDetails?: string;
    isLiked?: boolean;
    reviewList?: {
        id: string;
        authorName: string;
        rating: number;
        content: string;
        createdAt: Date;
    }[];
}

export default function TutorDetailClient({ tutor }: { tutor: Tutor }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("info");
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLiked, setIsLiked] = useState(tutor.isLiked || false);

    const handleToggleLike = async () => {
        // Optimistic update
        setIsLiked(!isLiked);
        const res = await toggleLikeAction(tutor.id);
        if (res.error) {
            setIsLiked(isLiked); // Revert
            if (res.error === "Unauthorized") router.push("/login");
        } else {
            setIsLiked(!!res.isLiked);
        }
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
                        <Button size="icon" variant="secondary" className={cn("rounded-full shadow-lg border-0 backdrop-blur-md transition-colors", isLiked ? "bg-red-500 text-white hover:bg-red-600" : "bg-black/50 text-white hover:bg-black/70")} onClick={handleToggleLike}>
                            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                        </Button>
                    </div>
                </div>

                {/* Hero Area: Minimal Static (Toss Style) */}
                <div className="relative w-full aspect-square md:h-[500px] md:aspect-auto bg-slate-100 overflow-hidden">
                    {tutor.imageUrl ? (
                        <div className="w-full h-full relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={tutor.imageUrl}
                                alt={tutor.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                            <span className="text-9xl font-bold opacity-30">
                                {tutor.name[0]}
                            </span>
                        </div>
                    )}

                    {/* Info Overlay */}
                    <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 px-2 py-0.5 text-xs">Verified Pro</Badge>
                            <div className="flex items-center text-amber-400 font-bold text-xs bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">
                                <Star className="h-3 w-3 fill-current mr-1" />
                                {tutor.rating} ({tutor.reviews})
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold mb-1 leading-tight">{tutor.name}</h1>
                        <p className="text-white/90 text-sm font-medium flex items-center">
                            {tutor.university} {tutor.major}
                        </p>
                    </div>

                    {/* Video Play Button (Simple) */}
                    <button
                        onClick={() => setIsPlaying(true)}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 hover:scale-105 transition-transform"
                    >
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                    </button>

                    {/* Simple Video Overlay if Playing */}
                    {isPlaying && (
                        <div className="absolute inset-0 z-50 bg-black">
                            <video
                                autoPlay
                                controls
                                className="w-full h-full object-contain"
                            >
                                <source src="https://cdn.pixabay.com/video/2016/09/21/5362-183786196_large.mp4" type="video/mp4" />
                            </video>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsPlaying(false); }}
                                className="absolute top-4 right-4 bg-white/20 text-white p-2 rounded-full"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sticky Tabs */}
                {/* Sticky Tabs */}
                <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/50">
                    <div className="flex">
                        {[
                            { id: "info", label: "소개", activeLabel: "소개(Info)" },
                            { id: "curriculum", label: "커리큘럼", activeLabel: "커리큘럼(Curriculum)" },
                            { id: "reviews", label: "리뷰", activeLabel: "리뷰(Reviews)" }
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex-1 py-4 text-sm font-bold border-b-2 transition-colors",
                                        isActive ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {isActive ? tab.activeLabel : tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-8 min-h-[500px]">
                    {/* Tags */}
                    {activeTab === "info" && (
                        <div className="flex flex-wrap gap-2">
                            {tutor.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="px-3 py-1.5 text-sm bg-secondary hover:bg-secondary/80">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Bio */}
                    {activeTab === "info" && (
                        <section>
                            <h3 className="text-lg font-bold mb-4">선생님 소개</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {tutor.bio}
                            </p>
                        </section>
                    )}

                    {/* Education */}
                    {activeTab === "info" && (
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
                    )}

                    {/* Curriculum */}
                    {activeTab === "curriculum" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <section>
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    수업 상세 정보
                                </h3>

                                <div className="grid gap-4">
                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                            <MapPin className="w-6 h-6 text-neutral-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-900 mb-1">수업 가능 지역</h4>
                                            <p className="text-neutral-600 font-medium whitespace-pre-line leading-relaxed text-sm">
                                                {tutor.locations || "협의 가능"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex gap-4 transition-all hover:shadow-md">
                                        <div className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center shrink-0">
                                            <CreditCard className="w-6 h-6 text-neutral-700" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-neutral-900 mb-1">수업료 기준</h4>
                                            <div className="text-neutral-600 font-medium whitespace-pre-line leading-relaxed text-sm space-y-1">
                                                {tutor.pricingDetails?.split('\n').map((line, i) => (
                                                    <div key={i} className="flex items-start gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-300 mt-2 shrink-0" />
                                                        <span>{line}</span>
                                                    </div>
                                                )) || "협의 가능"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Reviews */}
                    {activeTab === "reviews" && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {/* Summary Header */}
                            <div className="bg-neutral-900 text-white p-6 rounded-3xl flex items-center justify-between shadow-xl">
                                <div>
                                    <div className="text-3xl font-black flex items-center gap-2 mb-1">
                                        {tutor.rating}
                                        <span className="text-sm font-normal text-neutral-400">/ 5.0</span>
                                    </div>
                                    <div className="flex text-amber-400 gap-0.5 mb-2">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={cn("w-4 h-4", i < Math.floor(tutor.rating) ? "fill-current" : "text-neutral-700")} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-neutral-400 font-medium">
                                        총 {tutor.reviews}개의 수강생 후기
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full mb-2 inline-block">
                                        만족도 98%
                                    </div>
                                    <p className="text-[10px] text-neutral-500">최근 6개월 기준</p>
                                </div>
                            </div>

                            <ReviewForm tutorId={tutor.id} />

                            <div className="space-y-4">
                                <h3 className="font-bold text-lg mb-4">최신 리뷰</h3>
                                {tutor.reviewList && tutor.reviewList.length > 0 ? (
                                    tutor.reviewList.map((review: any) => (
                                        <div key={review.id} className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:border-neutral-200 transition-colors">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center font-bold text-neutral-500 text-sm">
                                                        {review.authorName[0]}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-neutral-900 block text-sm">{review.authorName}</span>
                                                        <span className="text-xs text-neutral-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex bg-neutral-50 px-2 py-1 rounded-md">
                                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-1" />
                                                    <span className="text-xs font-bold text-neutral-700">{review.rating}.0</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-neutral-600 leading-relaxed pl-[52px]">{review.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-dashed border-neutral-200">
                                        <p className="text-neutral-400 font-medium mb-2">아직 작성된 후기가 없습니다</p>
                                        <p className="text-xs text-neutral-300">첫 번째 후기를 남겨주세요!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Completely Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-5 pb-10 bg-background border-t border-border/50 max-w-md mx-auto z-[60]">
                <div className="flex items-center gap-3">
                    <Button size="lg" className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 rounded-xl" asChild>
                        <Link href={`/tutors/${tutor.id}/book`}>
                            상담 신청하기
                        </Link>
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}

import { createReviewAction } from "@/app/actions";

function ReviewForm({ tutorId }: { tutorId: string }) {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        await createReviewAction(tutorId, rating, content);
        setContent("");
        setSubmitting(false);
        // Page usually revalidates, but we can also soft refresh
        // router.refresh() handles server component re-render
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
            <h4 className="font-bold text-sm mb-3">후기 작성하기</h4>
            <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button type="button" key={star} onClick={() => setRating(star)}>
                        <Star className={cn("w-6 h-6", star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300")} />
                    </button>
                ))}
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="수업은 어떠셨나요? 솔직한 후기를 남겨주세요."
                className="w-full text-sm p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[80px] mb-2 resize-none"
            />
            <Button type="submit" size="sm" className="w-full rounded-xl" disabled={submitting}>
                {submitting ? "등록 중..." : "후기 등록"}
            </Button>
        </form>
    );
}
