
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/app/actions";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-2xl text-lg shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]" disabled={pending}>
            {pending ? "가입 중..." : "회원가입 완료"}
        </Button>
    );
}

export default function RegisterPage() {
    const [error, setError] = useState("");

    async function clientAction(formData: FormData) {
        const res = await registerAction(formData);
        if (res?.error) {
            setError(res.error);
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-blue-100 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-indigo-100 rounded-full blur-3xl opacity-50" />

            <div className="w-full max-w-sm relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">회원가입</h1>
                    <p className="text-slate-500 font-medium">스터디돌과 함께 목표를 달성해보세요!</p>
                </div>

                <form action={clientAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">이름</Label>
                        <Input
                            name="name"
                            id="name"
                            required
                            placeholder="실명을 입력해주세요"
                            className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            name="email"
                            id="email"
                            type="email"
                            required
                            placeholder="example@studydol.com"
                            className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            name="password"
                            id="password"
                            type="password"
                            required
                            placeholder="8자 이상 입력해주세요"
                            className="bg-slate-50 border-slate-200 h-12 rounded-xl focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <Label>가입 유형</Label>
                        <RadioGroup defaultValue="student" name="role" className="grid grid-cols-2 gap-4">
                            <div>
                                <RadioGroupItem value="student" id="role-student" className="peer sr-only" />
                                <Label
                                    htmlFor="role-student"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600 cursor-pointer text-center font-bold text-slate-500"
                                >
                                    👨‍🎓 학생
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="tutor" id="role-tutor" className="peer sr-only" />
                                <Label
                                    htmlFor="role-tutor"
                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-4 hover:bg-slate-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:text-blue-600 cursor-pointer text-center font-bold text-slate-500"
                                >
                                    👩‍🏫 튜터
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl font-medium text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <div className="mt-8 text-center">
                    <p className="text-slate-400 text-sm font-medium">
                        이미 계정이 있으신가요?{" "}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            로그인하기
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
