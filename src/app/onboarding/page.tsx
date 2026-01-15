"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { completeOnboardingAction } from "@/app/actions";

// Quiz Data
const STEPS = [
    {
        id: 1,
        question: "가장 중요하게 생각하는\n선생님 스타일은?",
        options: [
            { label: "꼼꼼하고 체계적인 관리형", icon: "📝" },
            { label: "친구 같은 멘토형", icon: "🤝" },
            { label: "핵심만 짚어주는 쪽집게형", icon: "⚡" },
            { label: "동기부여를 잘해주는 코치형", icon: "🔥" },
        ],
    },
    {
        id: 2,
        question: "현재 가장 큰\n학습 고민은 무엇인가요?",
        options: [
            { label: "성적이 오르지 않아요", icon: "📉" },
            { label: "공부 습관이 안 잡혔어요", icon: "🤔" },
            { label: "심화 문제 해결력이 부족해요", icon: "🤯" },
            { label: "진로/입시 상담이 필요해요", icon: "🎓" },
        ],
    },
    {
        id: 3,
        question: "선호하는 수업 방식은?",
        options: [
            { label: "개념부터 차근차근", icon: "📚" },
            { label: "문제 풀이 위주", icon: "✍️" },
            { label: "실전 모의고사 훈련", icon: "⏰" },
            { label: "질문 해결 중심", icon: "🙋" },
        ],
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSelect = (option: string) => {
        setAnswers({ ...answers, [currentStep]: option });

        if (currentStep < STEPS.length - 1) {
            setTimeout(() => setCurrentStep(currentStep + 1), 300);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = async () => {
        setIsAnalyzing(true);
        // Simulate AI Analysis logic
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save to DB
        await completeOnboardingAction(answers);
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {/* Background Effects */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px]"
                />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="z-10 space-y-6"
                >
                    <div className="relative">
                        <Sparkles className="w-16 h-16 text-amber-400 mx-auto animate-pulse" />
                        <motion.div
                            className="absolute inset-0 bg-amber-400 blur-xl opacity-50"
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">AI가 딱 맞는 선생님을<br />찾고 있습니다</h2>
                        <p className="text-slate-400">학생의 성향과 목표를 분석 중이에요...</p>
                    </div>

                    {/* Fake Progress Log */}
                    <div className="text-xs text-slate-500 space-y-1">
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>✓ 학습 스타일 분석 완료</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>✓ 유사 합격 사례 데이터 매칭 중</motion.p>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>✓ 상위 1% 튜터 필터링</motion.p>
                    </div>
                </motion.div>
            </div>
        )
    }

    const stepData = STEPS[currentStep];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Progress Bar */}
            <div className="h-1 bg-slate-100 w-full fixed top-0 left-0 z-50">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center px-6 max-w-md mx-auto w-full pt-10">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-8"
                    >
                        {/* Question */}
                        <div className="space-y-2">
                            <span className="text-primary font-bold text-sm tracking-wider">QUESTION {stepData.id}</span>
                            <h1 className="text-2xl font-bold whitespace-pre-line leading-snug">
                                {stepData.question}
                            </h1>
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {stepData.options.map((opt) => (
                                <button
                                    key={opt.label}
                                    onClick={() => handleSelect(opt.label)}
                                    className="w-full p-4 rounded-xl border border-border bg-card hover:bg-neutral-50 hover:border-primary/50 transition-all flex items-center gap-4 text-left group active:scale-[0.98]"
                                >
                                    <span className="text-2xl">{opt.icon}</span>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">{opt.label}</span>
                                    <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground group-hover:text-primary" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </AnimatePresence>

            </div>

            {/* Footer */}
            <div className="p-6 text-center text-xs text-muted-foreground">
                <p>정확한 매칭을 위해 솔직하게 답변해주세요.</p>
            </div>
        </div>
    );
}
