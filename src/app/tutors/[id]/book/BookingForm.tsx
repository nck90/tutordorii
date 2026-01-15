"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { createLessonRequestAction } from "@/app/actions";
import { toast } from "sonner";

interface Tutor {
    id: string;
    name: string;
    price: string;
    university: string;
    major: string;
}

export function BookingForm({ tutor }: { tutor: Tutor }) {
    const router = useRouter();
    const [subject, setSubject] = useState("상담 신청합니다");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await createLessonRequestAction(tutor.id, subject, message);
        if (res.error) {
            toast.error(res.error);
            setLoading(false);
            return;
        }

        toast.success("신청이 완료되었습니다! 튜터의 응답을 기다려주세요.");
        router.push("/chat"); // Redirect to Chat if we have chat list, actually user wants to go somewhere? Usually Chat or My.
        // User requested previously to go to chat? Or default flow.
        // Step 188: BookingClient.tsx redirected to "/" after timeout.
        // BookingForm line 40: router.push("/my");
        // I will keep /my for now unless user asks.
        router.push("/chat"); // Actually the flow is Consultation Request -> Tutors answers -> Chat.
        // Converting to chat makes sense if we want them to see the pending request.
    };

    return (
        <MobileLayout hideNav>
            {/* Header */}
            <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border/40 px-5 h-14 flex items-center gap-3">
                <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10 rounded-full" onClick={() => router.back()}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <span className="text-lg font-bold">상담 신청</span>
            </div>

            <div className="p-6 space-y-8">
                {/* Tutor Info Summary */}
                <div className="bg-secondary/30 p-5 rounded-2xl border border-border/50 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-400">
                        {tutor.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg leading-tight">{tutor.name} 선생님</h3>
                        <p className="text-sm text-muted-foreground">{tutor.university} {tutor.major}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-bold">수업 과목 / 제목</Label>
                        <Input
                            id="subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="h-12 bg-white text-black"
                            placeholder="예: 영어 회화 기초"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-bold">신청 메시지</Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[150px] bg-white text-black text-base leading-relaxed p-4 resize-none"
                            placeholder={`안녕하세요! 선생님의 프로필을 보고 연락드립니다.\n현재 저의 실력은...`}
                            required
                        />
                        <p className="text-xs text-muted-foreground text-right">{message.length}자 / 1000자</p>
                    </div>

                    <div className="pt-4">
                        <div className="bg-neutral-50 p-4 rounded-xl mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-slate-600">예상 수업료 (1시간)</span>
                                <span className="text-lg font-bold text-slate-900">{tutor.price}원</span>
                            </div>
                            <p className="text-xs text-slate-500 text-right">* 시간당 금액이며, 실제 수업료는 협의 후 결정됩니다.</p>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-xl">
                            {loading ? "신청 중..." : "신청하기"}
                        </Button>
                    </div>
                </form>
            </div>
        </MobileLayout>
    );
}
