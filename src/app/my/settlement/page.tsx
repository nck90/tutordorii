"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

import { getSettlementAction } from "@/app/actions";
import { useEffect, useState } from "react";

export default function SettlementPage() {
    const router = useRouter();
    const [data, setData] = useState<{ totalAmount: number, history: any[] }>({ totalAmount: 0, history: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSettlementAction().then(res => {
            setData(res);
            setLoading(false);
        });
    }, []);

    return (
        <MobileLayout hideNav>
            <div className="bg-white min-h-screen pb-20">
                <div className="p-4 flex items-center border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-lg font-bold ml-2">정산 관리</h1>
                </div>

                <div className="p-6">
                    <div className="bg-slate-900 rounded-3xl p-6 text-white mb-8 shadow-xl shadow-slate-200">
                        <p className="text-slate-400 text-sm mb-1">출금 가능 금액</p>
                        <h2 className="text-4xl font-bold mb-6">
                            {loading ? "..." : data.totalAmount.toLocaleString()}원
                        </h2>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 h-12 font-bold rounded-xl">
                            출금 신청
                        </Button>
                    </div>

                    <h3 className="font-bold text-lg mb-4">최근 내역</h3>
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center text-slate-400 py-10">로딩중...</div>
                        ) : data.history.length === 0 ? (
                            <div className="text-center text-slate-400 py-10">정산 내역이 없습니다.</div>
                        ) : (
                            data.history.map((item) => (
                                <div key={item.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                                    <div>
                                        <p className="font-bold text-slate-800">{item.title}</p>
                                        <p className="text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p>
                                    </div>
                                    <span className="font-bold text-blue-600">+ {item.amount.toLocaleString()}원</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </MobileLayout>
    )
}
