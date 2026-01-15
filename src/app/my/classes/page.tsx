"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getMyRequestsAction } from "@/app/actions";

export default function MyClassesPage() {
    const router = useRouter();
    const [classes, setClasses] = useState<any[]>([]);

    useEffect(() => {
        getMyRequestsAction().then(data => {
            const accepted = data.filter((r: any) => r.status === 'ACCEPTED');
            setClasses(accepted);
        });
    }, []);

    return (
        <MobileLayout hideNav>
            <div className="bg-white min-h-screen pb-20">
                <div className="p-4 flex items-center border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="-ml-2">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-lg font-bold ml-2">내 수업 관리</h1>
                </div>

                <div className="p-4 space-y-4">
                    {classes.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            진행 중인 수업이 없습니다.
                        </div>
                    ) : (
                        classes.map((cls) => (
                            <div key={cls.id} className="bg-white border rounded-2xl p-5 shadow-sm">
                                <h3 className="font-bold text-lg mb-1">{cls.subject}</h3>
                                <p className="text-slate-500 text-sm mb-4">
                                    {cls.studentName ? `${cls.studentName} 학생` : `${cls.tutorName} 선생님`}
                                </p>
                                <div className="flex gap-2">
                                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => router.push(`/chat/${cls.chatRoomId}`)}>
                                        채팅방
                                    </Button>
                                    <Button variant="outline" className="flex-1" onClick={() => router.push('/schedule')}>
                                        일정 관리
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
