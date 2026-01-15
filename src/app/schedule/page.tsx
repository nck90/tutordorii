"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getMyScheduleAction } from "@/app/actions";
import { useEffect } from "react";

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [schedule, setSchedule] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyScheduleAction().then(data => {
            setSchedule(data);
            setLoading(false);
        });
    }, []);

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
                            진행 중인 수업 <Badge variant="secondary" className="bg-primary/10 text-primary">{schedule.length}</Badge>
                        </h2>

                        {loading ? (
                            <div className="text-center text-muted-foreground py-10">로딩중...</div>
                        ) : schedule.length === 0 ? (
                            <div className="text-center py-8 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400 text-sm">
                                예정된 수업이 없습니다.
                            </div>
                        ) : (
                            schedule.map(item => (
                                <Card key={item.id} className="p-4 border-l-4 border-l-primary flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                                    <div>
                                        <span className="text-xs font-bold text-primary mb-1 block">시간 미정</span>
                                        <h3 className="font-bold">{item.otherName} ({item.subject})</h3>
                                        <p className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()} 시작됨</p>
                                    </div>
                                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">{item.status}</Badge>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
}
