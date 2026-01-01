"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, MessageCircle } from "lucide-react";

export default function LoginPage() {
    const { setRole } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"student" | "tutor">("student");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, validate credentials here
        setRole(activeTab);

        // Redirect to Onboarding for Students (Demo effect)
        if (activeTab === "student") {
            router.push("/onboarding");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative">
            {/* Brand Logo */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">과외돌이<span className="text-primary">.</span></h1>
                <p className="text-muted-foreground text-sm">대한민국 상위 1% 입시 플랫폼</p>
            </div>

            <div className="w-full max-w-sm space-y-6">
                {/* Role Toggle Tabs */}
                <Tabs defaultValue="student" className="w-full" onValueChange={(val) => setActiveTab(val as "student" | "tutor")}>
                    <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-secondary/50 p-1">
                        <TabsTrigger value="student" className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">학생/학부모</TabsTrigger>
                        <TabsTrigger value="tutor" className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">선생님</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input id="email" type="email" placeholder="example@email.com" className="h-12 bg-neutral-50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50" required />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="password">비밀번호</Label>
                            <span className="text-xs text-muted-foreground cursor-pointer hover:underline">비밀번호 찾기</span>
                        </div>
                        <Input id="password" type="password" placeholder="••••••••" className="h-12 bg-neutral-50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50" required />
                    </div>

                    <Button type="submit" className="w-full h-12 text-base font-bold rounded-xl shadow-lg shadow-primary/20 mt-2">
                        로그인
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <Button variant="outline" type="button" className="w-full h-12 font-medium bg-[#FEE500] hover:bg-[#FEE500]/90 border-[#FEE500] text-[#3c1e1e] rounded-xl flex items-center gap-2" onClick={() => handleLogin({ preventDefault: () => { } } as any)}>
                        <MessageCircle className="w-5 h-5 fill-current" />
                        카카오로 시작하기
                    </Button>
                    {/* Add Google/Apple if needed */}
                </div>

                <div className="text-center mt-6">
                    <p className="text-sm text-muted-foreground">
                        아직 계정이 없으신가요? <span className="text-primary font-bold cursor-pointer hover:underline">회원가입</span>
                    </p>
                </div>
            </div>

            {/* Footer / Safe Info */}
            <div className="absolute bottom-8 flex items-center gap-2 text-xs text-muted-foreground/60">
                <Check className="w-3 h-3" />
                <span>철저한 신원 인증 시스템</span>
            </div>
        </div>
    );
}
