"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { SearchIcon, X, SlidersHorizontal, ChevronRight, Star, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getTutorsAction, getPopularTagsAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { cn } from "@/lib/utils";

export default function SearchPage() {
    const [activeTags, setActiveTags] = useState<string[]>([]);
    const [popularTags, setPopularTags] = useState<string[]>([]);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [tutors, setTutors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter State
    const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

    // Temporary Drawer State
    const [tempMinPrice, setTempMinPrice] = useState<string>("");
    const [tempMaxPrice, setTempMaxPrice] = useState<string>("");

    // Debounce query
    const [debouncedQuery, setDebouncedQuery] = useState(query);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    // Fetch Popular Tags
    useEffect(() => {
        getPopularTagsAction().then(setPopularTags);
    }, []);

    useEffect(() => {
        const fetchTutors = async () => {
            setLoading(true);
            const data = await getTutorsAction(debouncedQuery, activeTags, undefined, minPrice, maxPrice);
            setTutors(data);
            setLoading(false);
        }
        fetchTutors();
    }, [debouncedQuery, activeTags, minPrice, maxPrice]);

    const applyFilters = () => {
        const min = tempMinPrice ? parseInt(tempMinPrice) : undefined;
        const max = tempMaxPrice ? parseInt(tempMaxPrice) : undefined;
        setMinPrice(min);
        setMaxPrice(max);
        setIsDrawerOpen(false);
    }

    return (
        <MobileLayout>
            <div className="min-h-screen bg-background pb-32">
                {/* Header */}
                <div className="px-6 pt-8 pb-6 bg-background sticky top-0 z-40">
                    <h1 className="text-2xl font-bold mb-4 tracking-tight text-foreground">
                        어떤 선생님을<br />
                        찾고 계신가요?
                    </h1>

                    {/* Search Input Box */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="과목, 학교, 키워드 검색"
                            className="w-full bg-secondary h-12 pl-12 pr-4 rounded-[16px] text-[16px] text-foreground placeholder:text-muted-foreground/50 focus:bg-background focus:ring-1 focus:ring-primary focus:outline-none transition-all shadow-none border-b border-white"
                        />
                    </div>
                </div>

                {/* Categories & Filter Bar */}
                <div className="px-6 py-2 space-y-6">
                    {/* Active Tags / Popular Tags */}
                    <div>
                        {activeTags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {activeTags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="pl-3 pr-2 py-2 text-sm bg-primary text-primary-foreground border-transparent hover:bg-primary/90 transition-colors" onClick={() => setActiveTags(prev => prev.filter(t => t !== tag))}>
                                        {tag} <X className="w-3 h-3 ml-2 opacity-50" />
                                    </Badge>
                                ))}
                                <button onClick={() => setActiveTags([])} className="text-sm text-muted-foreground underline ml-2 hover:text-foreground">초기화</button>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center gap-1.5 mb-3">
                                    <h3 className="text-sm font-bold text-foreground">인기 검색어</h3>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(popularTags.length > 0 ? popularTags : ["IB Math", "AP Chemistry", "SAT", "College Essay"]).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setActiveTags([tag])}
                                            className="h-10 px-4 rounded-[16px] bg-secondary border border-transparent text-sm font-semibold text-foreground hover:bg-secondary/70 transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Filter Button & Count */}
                    <div className="flex items-center justify-between pb-2">
                        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                            <DrawerTrigger asChild>
                                <Button variant="outline" className="rounded-[16px] h-10 px-4 border-border bg-background hover:bg-secondary text-sm font-semibold text-foreground">
                                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                                    상세 필터
                                </Button>
                            </DrawerTrigger>
                            <DrawerContent className="rounded-t-[32px]">
                                <div className="mx-auto w-full max-w-md p-6 pb-12">
                                    <DrawerTitle className="mb-8 text-2xl font-bold">검색 필터</DrawerTitle>

                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <Label className="text-lg font-bold">시간당 수업료</Label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-muted-foreground font-medium">최소</Label>
                                                    <div className="relative">
                                                        <Input type="number" placeholder="0" className="pl-3 h-12 rounded-xl text-lg bg-secondary border-none" value={tempMinPrice} onChange={(e) => setTempMinPrice(e.target.value)} />
                                                        <span className="absolute right-4 top-3 text-base text-muted-foreground font-medium">원</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-sm text-muted-foreground font-medium">최대</Label>
                                                    <div className="relative">
                                                        <Input type="number" placeholder="100,000" className="pl-3 h-12 rounded-xl text-lg bg-secondary border-none" value={tempMaxPrice} onChange={(e) => setTempMaxPrice(e.target.value)} />
                                                        <span className="absolute right-4 top-3 text-base text-muted-foreground font-medium">원</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <DrawerFooter className="px-0 mt-10 gap-3">
                                        <Button className="w-full h-14 text-lg font-bold rounded-[20px] bg-primary text-primary-foreground" onClick={applyFilters}>적용하기</Button>
                                    </DrawerFooter>
                                </div>
                            </DrawerContent>
                        </Drawer>
                        <span className="text-sm font-medium text-muted-foreground">
                            전체 <span className="font-bold text-foreground">{tutors.length}</span>
                        </span>
                    </div>
                </div>

                {/* Results List */}
                <div className="px-6 space-y-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-4 p-4 rounded-[24px] bg-secondary/50">
                                    <Skeleton className="w-16 h-16 rounded-[16px] bg-white" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="h-5 w-3/4 rounded-md bg-white" />
                                        <Skeleton className="h-4 w-1/2 rounded-md bg-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tutors.length === 0 ? (
                        <div className="text-center py-32 text-muted-foreground">
                            <p className="mb-4">조건에 맞는 선생님이 없어요.</p>
                            <button onClick={() => { setQuery(""); setActiveTags([]); }} className="px-6 py-3 bg-secondary rounded-[16px] text-sm font-bold text-foreground hover:bg-secondary/80">필터 초기화</button>
                        </div>
                    ) : (
                        tutors.map((tutor) => (
                            <Link href={`/tutors/${tutor.id}`} key={tutor.id} className="block group">
                                <PremiumCard className="border-none shadow-none bg-transparent hover:bg-secondary/30 transition-colors rounded-[24px]">
                                    <div className="flex py-4 gap-5 items-center">
                                        {/* Avatar */}
                                        <div className="w-16 h-16 bg-secondary rounded-[22px] shrink-0 overflow-hidden relative">
                                            {tutor.imageUrl ? (
                                                <img src={tutor.imageUrl} alt={tutor.name} className="w-full h-full object-cover grayscale" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 font-bold text-xl">
                                                    {tutor.name[0]}
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <h3 className="font-bold text-lg text-foreground leading-tight">{tutor.name}</h3>
                                                    <p className="text-sm font-medium text-muted-foreground mt-0.5">{tutor.university} {tutor.major}</p>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {tutor.tags.slice(0, 3).map((tag: any) => (
                                                    <span key={tag} className="px-2 py-1 text-[11px] font-bold bg-secondary text-muted-foreground rounded-[6px]">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </PremiumCard>
                            </Link>
                        ))
                    )}
                </div>

            </div>
        </MobileLayout>
    );
}
