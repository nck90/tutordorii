"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft, CreditCard, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Time Slots
const TIME_SLOTS = [
    "18:00", "19:00", "20:00", "21:00"
];

const DAYS = [
    { day: "Mon", date: "14", active: false },
    { day: "Tue", date: "15", active: true },
    { day: "Wed", date: "16", active: false },
    { day: "Thu", date: "17", active: false },
    { day: "Fri", date: "18", active: false },
];

export default function BookingPage() {
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedDay, setSelectedDay] = useState("15");
    const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle");

    const handlePayment = async () => {
        if (!selectedTime) return;
        setPaymentStatus("processing");

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPaymentStatus("success");

        // Redirect after success
        setTimeout(() => {
            router.push("/my/classes");
        }, 1500);
    };

    if (paymentStatus === "success") {
        return (
            <MobileLayout hideNav>
                <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">결제가 완료되었습니다!</h1>
                    <p className="text-slate-500 mb-8">
                        선생님과 수업 일정이 확정되었습니다.<br />
                        내 강의실로 이동합니다.
                    </p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-100" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-200" />
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout hideNav>
            <div className="bg-neutral-50 min-h-screen flex flex-col">
                {/* Header */}
                <div className="bg-background px-4 py-3 flex items-center gap-4 border-b border-border/40">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="font-bold text-lg">시범 수업 신청</h1>
                </div>

                <div className="p-6 space-y-8 flex-1">
                    {/* 1. Select Date */}
                    <section>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                            날짜 선택 (6월)
                        </h3>
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                            {DAYS.map((d) => (
                                <button
                                    key={d.date}
                                    onClick={() => setSelectedDay(d.date)}
                                    className={cn(
                                        "flex flex-col items-center gap-1 w-12 py-2 rounded-xl transition-all",
                                        selectedDay === d.date ? "bg-primary text-white shadow-md shadow-primary/30" : "hover:bg-neutral-100"
                                    )}
                                >
                                    <span className={cn("text-xs font-medium", selectedDay === d.date ? "text-white/80" : "text-muted-foreground")}>{d.day}</span>
                                    <span className="text-lg font-bold">{d.date}</span>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 2. Select Time */}
                    <section>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <span className="text-primary bg-primary/10 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                            시간 선택
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {TIME_SLOTS.map(time => (
                                <button
                                    key={time}
                                    onClick={() => setSelectedTime(time)}
                                    className={cn(
                                        "h-12 rounded-xl font-semibold border transition-all flex items-center justify-center gap-2",
                                        selectedTime === time
                                            ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                    )}
                                >
                                    <Clock className="w-4 h-4" />
                                    {time}
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* 3. Summary */}
                    <Card className="p-5 bg-slate-900 text-white border-0 shadow-xl mt-4">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-slate-400 text-xs mb-1">신청 내역</p>
                                <h4 className="font-bold text-lg">IB Chemistry HL 시범 수업</h4>
                            </div>
                            <CreditCard className="text-amber-400" />
                        </div>
                        <div className="space-y-2 text-sm text-slate-300 border-t border-white/10 pt-4">
                            <div className="flex justify-between">
                                <span>날짜</span>
                                <span className="font-bold text-white">6월 {selectedDay}일</span>
                            </div>
                            <div className="flex justify-between">
                                <span>시간</span>
                                <span className="font-bold text-white">{selectedTime || "-"}</span>
                            </div>
                            <div className="flex justify-between text-amber-400 font-bold text-base mt-2">
                                <span>결제 금액</span>
                                <span>120,000원</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bottom Button */}
                <div className="p-5 pb-10 bg-background border-t border-border/40">
                    <Button
                        className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/25 rounded-xl transition-all"
                        disabled={!selectedTime || paymentStatus === "processing"}
                        onClick={handlePayment}
                    >
                        {paymentStatus === "processing" ? (
                            <span className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                결제 진행 중...
                            </span>
                        ) : (
                            <>
                                <Check className="w-5 h-5 mr-2" />
                                결제하고 신청하기
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
}
