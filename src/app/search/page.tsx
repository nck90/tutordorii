"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerFooter } from "@/components/ui/drawer";
import { SearchIcon, X, SlidersHorizontal, ChevronRight, Star } from "lucide-react";
import { useState } from "react";
import { TutorCardVertical } from "@/components/tutor/TutorCardVertical";

const TUTORS = [
    { id: "1", name: "Sarah Kim", university: "Princeton", major: "Chemistry", tags: ["AP Chem", "IB Chem"], rating: 4.9, imageUrl: "" },
    { id: "2", name: "Minji Choi", university: "Oxford", major: "PPE", tags: ["A-Level Math", "TSA"], rating: 5.0, imageUrl: "" },
];

export default function SearchPage() {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <MobileLayout>
            <div className="min-h-screen bg-neutral-50 pb-32">
                {/* Toss-style Bold Header */}
                <div className="px-6 pt-8 pb-6 bg-background">
                    <h1 className="text-2xl font-bold mb-6">
                        어떤 선생님을<br />찾고 계신가요?
                    </h1>

                    {/* Search Input Box (Clean) */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="과목, 학교, 키워드 검색"
                            className="w-full bg-neutral-100 h-14 pl-12 pr-4 rounded-2xl text-[16px] placeholder:text-muted-foreground/60 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {/* Categories Grid (Clean & Balanced) */}
                {!activeTags.length && (
                    <div className="bg-background px-6 pb-8 mb-3 rounded-b-3xl shadow-sm">
                        <h3 className="text-sm font-bold text-muted-foreground mb-4">자주 찾는 과목</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {["IB Math", "AP Chemistry", "SAT", "College Essay"].map(tag => (
                                <button key={tag} className="h-12 bg-neutral-50 rounded-xl px-4 flex items-center justify-between hover:bg-neutral-100 transition-colors">
                                    <span className="font-semibold text-slate-700">{tag}</span>
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Filter Bar */}
                <div className="px-6 py-4 flex items-center justify-between sticky top-0 bg-neutral-50/95 backdrop-blur z-30">
                    <div className="flex items-center gap-2">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="outline" className="rounded-full h-9 px-4 border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700">
                                    <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
                                    필터
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                                <div className="mx-auto w-full max-w-md p-6 h-[50vh]">
                                    <DrawerTitle className="mb-6 text-xl">필터 설정</DrawerTitle>
                                    {/* Placeholder for filter content */}
                                    <p className="text-muted-foreground">필터 옵션이 여기에 표시됩니다.</p>
                                </div>
                            </DrawerContent>
                        </Drawer>
                        <span className="text-sm text-slate-500 font-medium">
                            총 <span className="text-slate-900 font-bold">{TUTORS.length}</span>명
                        </span>
                    </div>
                    <div>
                        {/* Sort Option could go here */}
                    </div>
                </div>

                {/* Results List (Full Width Cards) */}
                <div className="px-6 space-y-4">
                    {TUTORS.map(tutor => (
                        <div key={tutor.id} className="w-full bg-white rounded-2xl p-1 shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-slate-100">
                            {/* Reuse Vertical Card but allow it to adapt or create a specific Horizontal List Card? 
                          For now, using the vertical card wrapper might look odd if it's fixed width.
                          Let's inline a "Wide Card" here for better 'Search' experience since user wants balanced UI.
                      */}
                            <div className="flex p-4 gap-4">
                                <div className="w-20 h-20 bg-slate-100 rounded-xl shrink-0 overflow-hidden relative">
                                    {/* Avatar */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold text-2xl">
                                        {tutor.name[0]}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-900 leading-tight">{tutor.name}</h3>
                                            <p className="text-sm text-slate-500 mb-1">{tutor.university} {tutor.major}</p>
                                        </div>
                                        <div className="flex items-center text-amber-400 font-bold text-xs bg-amber-50 px-1.5 py-0.5 rounded">
                                            <Star className="w-3 h-3 fill-current mr-0.5" />
                                            {tutor.rating}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {tutor.tags.map(tag => (
                                            <span key={tag} className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </MobileLayout>
    );
}
