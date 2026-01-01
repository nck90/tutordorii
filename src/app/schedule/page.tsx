"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    return (
        <MobileLayout>
            <div className="bg-neutral-50 min-h-screen pb-24">
                {/* Header */}
                <div className="bg-background px-5 py-4 border-b border-border/40 sticky top-0 z-10">
                    <h1 className="text-xl font-bold">수업 일정</h1>
                </div>

                <div className="p-5 space-y-6">
                    {/* Calendar Widget */}
                    <div className="bg-background rounded-2xl shadow-sm border border-border/50 p-2">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border-0 w-full flex justify-center"
                        />
                    </div>

                    {/* Today's Classes */}
                    <div className="space-y-3">
                        <h2 className="font-bold text-lg flex items-center gap-2">
                            오늘의 수업 <Badge variant="secondary" className="bg-primary/10 text-primary">2</Badge>
                        </h2>

                        {/* Class Item 1 */}
                        <Card className="p-4 border-l-4 border-l-primary flex justify-between items-center shadow-sm">
                            <div>
                                <span className="text-xs font-bold text-primary mb-1 block">18:00 - 19:30</span>
                                <h3 className="font-bold">박준원 학생 (IB Math)</h3>
                                <p className="text-xs text-muted-foreground">Zoom 온라인 수업</p>
                            </div>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">예정</Badge>
                        </Card>

                        {/* Class Item 2 */}
                        <Card className="p-4 border-l-4 border-l-slate-300 flex justify-between items-center shadow-sm opacity-60">
                            <div>
                                <span className="text-xs font-bold text-slate-500 mb-1 block">20:00 - 22:00</span>
                                <h3 className="font-bold">김민지 학생 (Chemistry)</h3>
                                <p className="text-xs text-muted-foreground">대치동 스터디카페</p>
                            </div>
                            <Badge variant="secondary">완료</Badge>
                        </Card>
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
