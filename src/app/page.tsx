"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { HorizontalSection } from "@/components/layout/HorizontalSection";
import { TutorCardVertical } from "@/components/tutor/TutorCardVertical";
import { Bell, ChevronRight, TrendingUp, Users, Wallet } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"; // Use direct transform if needed or wrapped components

import { getTutorsAction, getMyRequestsAction, acceptRequestAction, rejectRequestAction, getTutorDashboardStatsAction } from "@/app/actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { PremiumCard } from "@/components/ui/premium-card";
import { cn } from "@/lib/utils";

// Types
type Tutor = {
  id: string;
  name: string;
  university: string;
  major: string;
  tags: string[];
  rating: number;
  imageUrl: string;
};

export default function Home() {
  const router = useRouter();
  const [risingStars, setRisingStars] = useState<Tutor[]>([]);
  const [newTutors, setNewTutors] = useState<Tutor[]>([]);

  // Role & Loading
  const [role, setRole] = useState<"student" | "tutor" | null>(null);
  const [loading, setLoading] = useState(true);

  // Tutor Data
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ todayClassCount: 0, monthlyIncome: 0, newRequestsCount: 0 });

  // Use the global UserContext
  const { role: userContextRole, user: currentUser } = useUser();

  const handleAccept = async (requestId: string) => {
    const result = await acceptRequestAction(requestId);
    if (result.success) {
      toast.success("수업 요청을 수락했습니다.");
      setRequests(prev => prev.filter(req => req.id !== requestId));
      setStats(prev => ({ ...prev, todayClassCount: prev.todayClassCount + 1 }));
    } else {
      toast.error("요청 처리에 실패했습니다.");
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("정말 거절하시겠습니까?")) return;
    const result = await rejectRequestAction(requestId);
    if (result.success) {
      toast.success("수업 요청을 거절했습니다.");
      setRequests(prev => prev.filter(req => req.id !== requestId));
    }
  };

  useEffect(() => {
    if (userContextRole === null) {
      // Wait for context to initialize
    } else {
      setRole(userContextRole);

      if (userContextRole === "student") {
        Promise.all([
          getTutorsAction(undefined, undefined, 'rating'),
          getTutorsAction(undefined, undefined, 'newest')
        ]).then(([stars, newer]) => {
          setRisingStars(stars);
          setNewTutors(newer);
          setLoading(false);
        });
      } else if (userContextRole === "tutor") {
        Promise.all([
          getMyRequestsAction(),
          getTutorDashboardStatsAction()
        ]).then(([reqs, dashboardStats]) => {
          setRequests(reqs);
          setStats(dashboardStats);
          setLoading(false);
        });
      }
    }
  }, [userContextRole]);

  if (loading) {
    return (
      <MobileLayout>
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-2/3 rounded-xl" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        </div>
      </MobileLayout>
    )
  }

  // --- TUTOR MODE ---
  if (role === "tutor") {
    return (
      <MobileLayout>
        {/* Header */}
        <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/40 px-6 h-14 flex items-center justify-between">
          <span className="text-xl font-black tracking-tight flex items-center gap-1">
            과외돌이<span className="text-primary text-[10px] bg-primary/10 px-1.5 py-0.5 rounded-full border border-primary/20">TUTOR</span>
          </span>
          <div className="p-2 -mr-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <main className="pb-24 min-h-screen bg-neutral-50/50 dark:bg-black/20">
          {/* Welcome Section with Mesh Gradient */}
          <div className="relative overflow-hidden mb-6">
            <div className="absolute inset-0 mesh-gradient opacity-30 pointer-events-none" />
            <div className="relative pt-8 pb-10 px-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-3xl font-black mb-2 tracking-tight">
                  <span className="text-primary">{currentUser?.name}</span>, 안녕하세요!
                </h1>
                <p className="text-muted-foreground font-medium flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  오늘 예정된 수업: <span className="text-foreground font-bold">{stats.todayClassCount}건</span>
                </p>
              </motion.div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <PremiumCard className="p-5 border-none shadow-lg shadow-primary/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Wallet className="w-4 h-4 text-primary" />
                    <span className="text-xs font-bold">이번 달 수입</span>
                  </div>
                  <p className="text-2xl font-black tracking-tight">{stats.monthlyIncome.toLocaleString()}원</p>
                </PremiumCard>

                <PremiumCard className="p-5 border-none shadow-lg shadow-blue-500/5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold">신규 요청</span>
                  </div>
                  <p className="text-2xl font-black tracking-tight text-blue-600">{requests.length}건</p>
                </PremiumCard>
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <span className="w-1 h-6 bg-primary rounded-full" />
                최신 레슨 요청
              </h3>
              <Link href="/my" className="text-xs text-muted-foreground font-medium hover:text-primary transition-colors">
                전체보기 &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-border">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">아직 새로운 요청이 없어요.</p>
                  <p className="text-xs text-muted-foreground/50 mt-1">프로필을 더 매력적으로 꾸며보세요!</p>
                </div>
              ) : (
                requests.map((req, idx) => (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <PremiumCard hoverEffect={false}
                      className="p-5 border border-border/60"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/10">
                          {req.subject}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-foreground text-lg mb-1">{req.studentName} 학생</h4>
                      <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                        "{req.message}"
                      </p>
                      <div className="flex gap-2.5">
                        <Button onClick={() => handleAccept(req.id)} className="flex-1 h-11 bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl">
                          수락하기
                        </Button>
                        <Button onClick={() => handleReject(req.id)} variant="outline" className="flex-1 h-11 border-border/60 hover:bg-secondary/50 rounded-xl">
                          거절
                        </Button>
                      </div>
                    </PremiumCard>
                  </motion.div>
                ))
              )}
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
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/40 px-6 h-14 flex items-center justify-between transition-all duration-300">
        <span className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          과외돌이<span className="text-primary">.</span>
        </span>
        <div className="p-2 -mr-2 text-foreground/70 hover:text-primary hover:bg-primary/5 rounded-full transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
        </div>
      </div>

      <main className="space-y-10 pb-20 bg-background text-foreground">
        {/* Minimal Hero Banner (Toss Style) */}
        <div className="relative w-full pt-8 pb-10 px-6 bg-background">
          <div className="mb-8 space-y-4">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
              PREMIUM CLASS
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-[1.2] tracking-tight">
              아이비리그 합격,<br />
              <span className="text-foreground/90">
                이미 결정된 승부.
              </span>
            </h1>
          </div>

          <p className="text-muted-foreground text-base font-medium leading-relaxed max-w-[280px] mb-10">
            상위 1% 검증된 튜터들의 합격 시크릿.<br />
            <b>과외돌이</b>에서 지금 바로 만나보세요.
          </p>

          <div>
            <Link href="/search">
              <Button className="h-14 px-8 rounded-[18px] text-base font-bold bg-primary text-white hover:bg-primary/90 transition-colors shadow-none w-full sm:w-auto">
                상위 1% 튜터 보기
              </Button>
            </Link>
          </div>
        </div>

        {/* Section 1: Rising Stars */}
        <HorizontalSection title="🔥 요즘 뜨는 아이비리그 튜터" className="px-0">
          {risingStars.map((tutor) => (
            <TutorCardVertical key={tutor.id} {...tutor} />
          ))}
        </HorizontalSection>

        {/* Section 2: New Tutors */}
        <HorizontalSection title="✨ 이번 주 신규 등록 튜터" className="px-0">
          {newTutors.map((tutor) => (
            // Ensure unique key strategy
            <TutorCardVertical key={`new-${tutor.id}`} {...tutor} />
          ))}
        </HorizontalSection>
      </main>
    </MobileLayout>
  );
}

