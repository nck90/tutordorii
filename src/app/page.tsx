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
        {/* Hero Banner (Premium Redesign) */}
        <div className="w-full h-[340px] relative overflow-hidden group">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/30 via-slate-900 to-black z-0" />
          <div className="absolute inset-0 bg-slate-900/40 z-0" /> {/* Dimmer */}

          {/* Decorative Elements */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/30 rounded-full blur-[80px] opacity-60 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

          <div className="absolute inset-0 flex flex-col justify-end pb-12 px-6 z-20">
            <div className="mb-4 space-y-1">
              <span className="inline-block text-cyan-400 font-extrabold text-[10px] tracking-[0.2em] border border-cyan-400/30 px-2 py-1 rounded-full bg-cyan-950/30 backdrop-blur-md shadow-[0_0_10px_rgba(34,211,238,0.3)] mb-2">
                PREMIUM CLASS
              </span>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight drop-shadow-xl">
                아이비리그 합격,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-300">
                  이미 결정된 승부라면?
                </span>
              </h1>
            </div>

            <p className="text-slate-300 text-sm mb-6 font-medium leading-relaxed max-w-[280px]">
              상위 1% 검증된 튜터들의<br />
              합격 시크릿을 지금 바로 만나보세요.
            </p>

            <button className="w-fit bg-white text-slate-900 px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 flex items-center gap-2">
              상위 1% 튜터 보기
              <ChevronRight className="w-4 h-4" />
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
