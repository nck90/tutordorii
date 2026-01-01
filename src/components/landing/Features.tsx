import { ShieldCheck, Target, Sparkles, XCircle, CheckCircle } from "lucide-react";

export function Features() {
    return (
        <section className="py-24 bg-muted/30">
            <div className="container max-w-screen-xl px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                        왜 <span className="text-primary">과외돌</span>인가요?
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        기존 과외 플랫폼의 한계를 넘어, 프리미엄 교육의 새로운 기준을 제시합니다.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">


                    {/* Feature 2: Matching */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 text-primary">
                            <Target className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">초세분화 과목 매칭</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            &quot;수학&quot;이라고 다 같지 않습니다. <br />
                            <strong>IB Math AA HL</strong>, <strong>AP Calc BC</strong> 등 <br />
                            정확한 시험 과목으로 연결합니다.
                        </p>
                    </div>

                    {/* Feature 3: UX */}
                    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 mb-6 text-primary">
                            <Sparkles className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">프리미엄 수업 환경</h3>
                        <p className="text-muted-foreground leading-relaxed">
                            노쇼(No-Show) 없는 <strong>유료 시범 수업</strong>, <br />
                            안전한 <strong>에스크로 결제</strong>, <br />
                            수업 후 <strong>리포트 발송</strong>까지 책임집니다.
                        </p>
                    </div>
                </div>

                {/* Comparison Table (Optional/Simple) */}
                <div className="mt-20 p-8 rounded-3xl bg-secondary/20 border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">무엇이 다른가요?</h3>
                            <div className="flex items-start gap-3">
                                <XCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-medium text-muted-foreground">기존 플랫폼</p>
                                    <p className="text-sm text-muted-foreground/80">단순 명문대 재학생 위주, 영어/수학 등 포괄적 과목, 잦은 노쇼와 불투명한 환불</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                                <div>
                                    <p className="font-bold text-foreground">과외돌</p>
                                    <p className="text-sm text-muted-foreground/80">실력 검증된 전문 튜터, 커리큘럼별 세부 매칭, 에스크로 안전 결제</p>
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:block bg-gradient-to-br from-primary/20 to-secondary rounded-2xl h-48 w-full opacity-50 blur-3xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
