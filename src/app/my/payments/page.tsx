"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CreditCard, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentsPage() {
    const router = useRouter();

    return (
        <MobileLayout hideNav>
            <div className="min-h-screen bg-slate-50 pb-20">
                <div className="bg-white sticky top-0 z-50 px-5 h-14 flex items-center border-b border-slate-100">
                    <button onClick={() => router.back()} className="mr-4">
                        <ChevronLeft className="w-6 h-6 text-slate-800" />
                    </button>
                    <h1 className="font-bold text-lg text-slate-900">결제 및 계좌 관리</h1>
                </div>

                <div className="p-5 space-y-8">
                    <section>
                        <h2 className="text-sm font-bold text-slate-500 mb-3 ml-1">등록된 결제 수단</h2>
                        <div className="space-y-3">
                            <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-lg shadow-slate-200 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <CreditCard className="w-24 h-24" />
                                </div>
                                <div className="relative z-10">
                                    <p className="text-xs text-slate-400 mb-6">Main Card</p>
                                    <p className="text-xl font-mono tracking-widest mb-1">•••• •••• •••• 1234</p>
                                    <div className="flex justify-between items-end">
                                        <p className="text-xs text-slate-400">Hyundai Card</p>
                                        <p className="text-xs text-slate-400">09/28</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="w-full text-slate-600 border-slate-200 h-12 bg-white border-dashed">
                                <Plus className="w-4 h-4 mr-2" /> 새 카드 등록하기
                            </Button>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-sm font-bold text-slate-500 mb-3 ml-1">결제 내역</h2>
                        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-50">
                            {[
                                { title: "IB Math HL 4회권", date: "2024.06.15", price: "320,000원" },
                                { title: "AP Chem 시범 수업", date: "2024.06.10", price: "50,000원" },
                                { title: "SAT Math 모의고사", date: "2024.05.28", price: "15,000원" }
                            ].map((item, i) => (
                                <div key={i} className="p-4 flex justify-between items-center">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm mb-0.5">{item.title}</h4>
                                        <p className="text-xs text-slate-400">{item.date}</p>
                                    </div>
                                    <span className="font-bold text-slate-900 text-sm">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </MobileLayout>
    );
}
