"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { HorizontalSection } from "@/components/layout/HorizontalSection";
import { TutorCardVertical } from "@/components/tutor/TutorCardVertical";
import { Bell, ChevronRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

// Mock Data
const TUTORS = [
  { id: "1", name: "Sarah Kim", university: "Princeton", major: "Chemistry", tags: ["AP Chem", "IB Chem"], rating: 4.9, imageUrl: "" },
  { id: "2", name: "Minji Choi", university: "Oxford", major: "PPE", tags: ["A-Level Math", "History"], rating: 5.0, imageUrl: "" },
  { id: "3", name: "James Lee", university: "Yale", major: "Economics", tags: ["IB Econ", "AP Micro"], rating: 4.8, imageUrl: "" },
  { id: "4", name: "Daniel Park", university: "Stanford", major: "CS", tags: ["AP CSA", "USACO"], rating: 5.0, imageUrl: "" },
];

export default function Home() {
  const { role } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading/checking
    if (role === null) {
      // Allow brief flash or redirect, for now let's redirect to login for demo
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [role, router]);

  if (loading || !role) return null; // Or skeleton

  // --- TUTOR MODE ---
  if (role === "tutor") {
    return (
      <MobileLayout>
        <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/40 px-5 h-14 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight">과외돌이<span className="text-primary text-xs ml-1 align-top">TUTOR</span></span>
          <div className="p-2 -mr-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded-full transition-colors">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <main className="pb-20 bg-neutral-50 min-h-screen">
          {/* Tutor Dashboard Header */}
          <div className="bg-background pt-6 pb-8 px-6 rounded-b-3xl shadow-sm mb-4">
            <h1 className="text-2xl font-bold mb-2">안녕하세요, 김수학 선생님!</h1>
            <p className="text-muted-foreground mb-6">오늘 잡혀있는 수업이 <span className="text-primary font-bold">2건</span> 있습니다.</p>

            <div className="flex gap-3">
              <div className="flex-1 bg-neutral-100 p-4 rounded-xl">
                <p className="text-xs font-bold text-muted-foreground mb-1">이번 달 수입</p>
                <p className="text-xl font-bold text-foreground">2,400,000원</p>
              </div>
              <div className="flex-1 bg-neutral-100 p-4 rounded-xl">
                <p className="text-xs font-bold text-muted-foreground mb-1">새로운 요청</p>
                <p className="text-xl font-bold text-primary">5건</p>
              </div>
            </div>
          </div>

          <div className="px-6">
            <h3 className="font-bold text-lg mb-4">학생들의 과외 요청</h3>
            <div className="space-y-3">
              {/* Mock Request Cards */}
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">IB Math HL</span>
                    <span className="text-xs text-muted-foreground">방금 전</span>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">박준원 학생</h4>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">선생님 프로필 보고 연락드립니다. IB 과정 방학 특강 가능한지 여쭤보고 싶습니다.</p>
                  <div className="flex gap-2">
                    <Button className="flex-1 h-10 bg-primary text-sm font-bold shadow-md shadow-primary/20">수락하기</Button>
                    <Button variant="outline" className="flex-1 h-10 text-sm border-slate-200">거절</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </MobileLayout>
    );
  }

  // --- STUDENT MODE ---
  return (
    <MobileLayout>
      {/* App Header */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/40 px-5 h-14 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tight">과외돌이<span className="text-primary">.</span></span>
        <div className="p-2 -mr-2 text-foreground/70 hover:text-foreground hover:bg-secondary rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </div>
      </div>

      <main className="space-y-8 pb-10">
        {/* Hero Banner (Carousel Style) */}
        <div className="w-full h-72 bg-slate-900 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-800" />
          <div className="absolute inset-0 flex flex-col justify-center px-6">
            <span className="text-primary font-bold text-xs mb-2 tracking-wider">PREMIUM CLASS</span>
            <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
              이번 여름,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">아이비리그</span> 갈 준비 되셨나요?
            </h1>
            <p className="text-white/60 text-sm mb-6">검증된 상위 1% 튜터와 함께하는<br />프리미엄 입시 컨설팅</p>
            <button className="w-fit bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold hover:bg-white/90 transition-colors">
              지금 시작하기
            </button>
          </div>
        </div>

        {/* Section 1: Rising Stars */}
        <HorizontalSection title="🔥 요즘 뜨는 아이비리그 튜터">
          {TUTORS.map(tutor => (
            <TutorCardVertical key={tutor.id} {...tutor} />
          ))}
        </HorizontalSection>

        {/* Section 2: New Tutors */}
        <HorizontalSection title="✨ 이번 주 신규 등록 튜터">
          {[...TUTORS].reverse().map(tutor => (
            <TutorCardVertical key={`new-${tutor.id}`} {...tutor} />
          ))}
        </HorizontalSection>
      </main>
    </MobileLayout>
  );
}
