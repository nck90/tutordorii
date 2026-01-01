"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Download, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SettlementPage() {
    const router = useRouter();

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-slate-50 pb-20">
                {/* Header */}
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center border-b border-slate-100">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">정산 관리</h1>
                </div>

                <div className="p-5 space-y-6">
                    {/* Summary Card */}
                    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <p className="text-slate-400 text-sm font-medium mb-1">정산 가능 금액</p>
                                <h2 className="text-3xl font-extrabold">2,450,000<span className="text-lg font-medium text-slate-500 ml-1">원</span></h2>
                            </div>
                            <Badge className="bg-emerald-500 hover:bg-emerald-600 border-0">신청 가능</Badge>
                        </div>

                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold h-12 rounded-xl text-base">
                            정산 신청하기
                        </Button>
                        <p className="text-center text-xs text-slate-500 mt-3 flex items-center justify-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            매월 1일, 15일에 정산이 진행됩니다.
                        </p>
                    </div>

                    {/* Chart Mock */}
                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                                월별 수입 추이
                            </h3>
                            <span className="text-xs text-slate-400">최근 6개월</span>
                        </div>
                        <div className="h-40 flex items-end justify-between gap-2 px-2">
                            {[1.2, 1.8, 1.5, 2.1, 2.9, 2.45].map((val, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2 flex-1 group">
                                    <div className="w-full h-full flex items-end justify-center rounded-sm">
                                        <motion.div
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${(val / 3) * 100}%` }}
                                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                                            className={`w-full rounded-t-md relative group-hover:opacity-80 transition-opacity ${idx === 5 ? 'bg-blue-600' : 'bg-slate-200'}`}
                                        >
                                            {idx === 5 && (
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md whitespace-nowrap">
                                                    {val}M
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                    <span className={`text-[10px] font-bold ${idx === 5 ? 'text-slate-900' : 'text-slate-400'}`}>{idx + 7}월</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* History List */}
                    <div>
                        <h3 className="font-bold text-slate-900 mb-4 px-1">최근 내역</h3>
                        <div className="space-y-3">
                            {[
                                { title: "12월 2주차 정산", date: "2024. 12. 15", amount: "1,200,000", status: "complete" },
                                { title: "12월 1주차 정산", date: "2024. 12. 01", amount: "890,000", status: "complete" },
                                { title: "11월 4주차 정산", date: "2024. 11. 15", amount: "1,500,000", status: "complete" },
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Download className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{item.title}</p>
                                            <p className="text-xs text-slate-400">{item.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900">+{item.amount}원</p>
                                        <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-600 font-bold mt-0.5">
                                            <CheckCircle2 className="w-3 h-3" /> 정산완료
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </MobileLayout>
    );
}
