import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
            {/* Background Gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            <div className="container max-w-screen-xl px-4 flex flex-col items-center text-center">
                {/* Badge */}
                <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                    프리미엄 과외 매칭 플랫폼
                </div>

                {/* Headline */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                    대한민국 상위 1%를 위한 <br className="hidden md:block" />
                    <span className="text-primary">검증된 아이비리그 튜터</span>
                </h1>

                {/* Subhead */}
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                    IB, AP, SAT 부터 대학 컨설팅까지. <br className="md:hidden" />
                    학생의 목표에 정확히 맞춘 초세분화 매칭을 경험하세요.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90">
                        튜터찾기 바로가기
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button size="lg" variant="outline" className="h-12 px-8 text-base border-primary/20 hover:bg-primary/5">
                        튜터로 지원하기
                    </Button>
                </div>

                {/* Trust Indicators */}
                <div className="mt-16 pt-8 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-0 animate-in fade-in duration-1000 delay-500 fill-mode-forwards">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">500+</span>
                        <span className="text-sm text-muted-foreground">누적 매칭</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">98%</span>
                        <span className="text-sm text-muted-foreground">수업 만족도</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">Top 10</span>
                        <span className="text-sm text-muted-foreground">명문대 튜터</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl font-bold text-foreground">100%</span>
                        <span className="text-sm text-muted-foreground">신원/학력 인증</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
