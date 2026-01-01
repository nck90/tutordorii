"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WishlistPage() {
    const router = useRouter();

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-slate-50 pb-20">
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center border-b border-slate-100">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">찜한 선생님</h1>
                </div>

                <div className="p-5 space-y-4">
                    {[
                        { name: "Minji Choi", school: "Oxford", major: "PPE", rating: 5.0, tags: ["IB Math", "History"] },
                        { name: "Daniel Park", school: "Stanford", major: "CS", rating: 5.0, tags: ["AP CSA", "USACO"] }
                    ].map((tutor, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                            <Avatar className="w-16 h-16 rounded-xl border border-slate-100">
                                <AvatarImage />
                                <AvatarFallback className="bg-slate-100 text-slate-300 font-bold text-xl">{tutor.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-slate-900">{tutor.name}</h3>
                                    <Heart className="w-5 h-5 text-red-500 fill-current" />
                                </div>
                                <p className="text-xs text-slate-500 mb-2">{tutor.school} {tutor.major}</p>
                                <div className="flex flex-wrap gap-1">
                                    {tutor.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-md font-medium">{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </MobileLayout>
    );
}
