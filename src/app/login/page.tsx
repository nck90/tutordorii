"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Check, MessageCircle } from "lucide-react";
import { loginAction } from "@/app/actions";
import { toast } from "sonner";

export default function LoginPage() {
    const { setRole } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"student" | "tutor">("student");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // 1. Client-side State Update (for UI consistency with existing Context)
        setRole(activeTab);

        // 2. Server-side Auth (Real Database Check & Cookie Set)
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        formData.append("role", activeTab);

        const result = await loginAction(formData);

        if (result?.error) {
            toast.error(result.error);
            setLoading(false);
            return;
        }

        toast.success("로그인 성공! 이동합니다...");
        // Note: loginAction handles redirection
    };

    const handleSocialLogin = () => {
        toast.info("서비스 준비 중입니다.");
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center px-6 relative">
            {/* Brand Logo */}
            <div className="mb-10 text-center animate-in fade-in zoom-in duration-500">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">과외돌이<span className="text-primary text-5xl">.</span></h1>
                <p className="text-muted-foreground text-sm font-medium">대한민국 상위 1% 입시 플랫폼</p>
            </div>

            <div className="w-full max-w-sm space-y-6 animate-in slide-in-from-bottom-4 duration-700 delay-100">
                {/* Role Toggle Tabs */}
                <Tabs defaultValue="student" className="w-full" onValueChange={(val) => setActiveTab(val as "student" | "tutor")}>
                    <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-secondary/50 p-1.5">
                        <TabsTrigger value="student" className="rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black transition-all duration-300">학생/학부모</TabsTrigger>
                        <TabsTrigger value="tutor" className="rounded-xl text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-black transition-all duration-300">선생님</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-bold text-muted-foreground ml-1">이메일</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="example@email.com"
                            className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary rounded-xl transition-all shadow-sm dark:bg-white dark:text-slate-900 dark:border-slate-200 dark:placeholder:text-slate-400"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <Label htmlFor="password" className="text-xs font-bold text-muted-foreground">비밀번호</Label>
                            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">비밀번호 찾기</span>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="h-14 bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary rounded-xl transition-all shadow-sm dark:bg-white dark:text-slate-900 dark:border-slate-200 dark:placeholder:text-slate-400"
                            required
                        />
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 mt-4 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                        {loading ? "로그인 중..." : "로그인"}
                    </Button>
                </form>

                {/* Divider */}
                <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center">
                        <Separator />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-4 text-muted-foreground font-medium text-[10px] tracking-wider">Or continue with</span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="space-y-3">
                    <Button type="button" className="w-full h-14 font-bold bg-[#FEE500] hover:bg-[#FEE500]/90 border-0 text-[#3c1e1e] rounded-xl flex items-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all dark:bg-[#FEE500] dark:text-[#3c1e1e] dark:hover:bg-[#FEE500]/90" onClick={handleSocialLogin}>
                        <MessageCircle className="w-5 h-5 fill-current" />
                        카카오로 시작하기
                    </Button>
                </div>

                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">
                        아직 계정이 없으신가요?{" "}
                        <Link href="/register" className="text-primary font-bold cursor-pointer hover:underline ml-1">
                            회원가입
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
