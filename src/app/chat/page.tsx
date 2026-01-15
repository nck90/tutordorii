"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    getStudentChatRoomsAction,
    getTutorChatRoomsAction,
    getMyPendingRequestsAction,
    getMyOngoingChatsAction,
    acceptRequestAction
} from "@/app/actions";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// ... existing code ...

export default function ChatPage() {
    const { role } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"pending" | "ongoing">("pending");

    // Data
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [ongoingChats, setOngoingChats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const isTutor = role === "tutor";

    useEffect(() => {
        if (!role) return;

        // Auto-select tab based on role
        if (role === 'tutor') {
            setActiveTab("ongoing");
        } else {
            setActiveTab("pending");
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [pending, ongoing] = await Promise.all([
                    getMyPendingRequestsAction(),
                    getMyOngoingChatsAction()
                ]);
                setPendingRequests(pending);
                setOngoingChats(ongoing);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [role]);

    const handleAccept = async (requestId: string) => {
        const result = await acceptRequestAction(requestId);
        if (result.success) {
            toast.success("상담 요청을 수락했습니다.");
            // Remove from pending
            setPendingRequests(prev => prev.filter(req => req.id !== requestId));

            // Refresh ongoing to convince user it worked
            const ongoing = await getMyOngoingChatsAction();
            setOngoingChats(ongoing);

            // Switch tab
            setActiveTab("ongoing");
        } else {
            toast.error("요청 처리에 실패했습니다.");
        }
    };

    if (!role) {
        // In a real app we'd redirect or show loading
        return <MobileLayout><p className="p-8 text-center text-muted-foreground">로그인이 필요합니다.</p></MobileLayout>;
    }

    return (
        <MobileLayout>
            <div className="bg-background min-h-screen pb-20">
                <div className="sticky top-0 bg-background/95 backdrop-blur z-20 border-b border-border/40">
                    <div className="px-5 h-14 flex items-center justify-between">
                        <span className="text-xl font-bold tracking-tight">
                            {isTutor ? "내 채팅/상담" : "과외상담"}
                        </span>
                    </div>
                    {/* Tabs */}
                    <div className="flex w-full">
                        <button
                            onClick={() => setActiveTab("pending")}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'pending' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            대기중 ({pendingRequests.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("ongoing")}
                            className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ongoing' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                        >
                            진행중 ({ongoingChats.length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-muted-foreground">로딩중...</div>
                ) : (
                    <div className="divide-y divide-border/40">
                        {activeTab === 'pending' ? (
                            <>
                                {pendingRequests.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 space-y-4">
                                        <p className="text-muted-foreground font-medium">대기중인 상담 요청이 없습니다.</p>
                                    </div>
                                ) : (
                                    pendingRequests.map(req => (
                                        <div key={req.id} className="p-5 hover:bg-accent transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded text-center">{req.subject}</span>
                                                <span className="text-xs text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center gap-3 mb-3">
                                                {role === 'student' && req.otherImage ? (
                                                    <Avatar className="w-10 h-10 border border-border">
                                                        <AvatarImage src={req.otherImage} className="object-cover" />
                                                        <AvatarFallback>{req.otherName[0]}</AvatarFallback>
                                                    </Avatar>
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground font-bold">
                                                        {req.otherName[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <h4 className="font-bold text-foreground text-sm">{req.otherName}</h4>
                                                    <p className="text-xs text-muted-foreground">상담 연결 대기중</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-foreground bg-secondary/50 p-3 rounded-xl mb-3 line-clamp-2">
                                                {req.message}
                                            </p>
                                            {isTutor ? (
                                                <Button
                                                    onClick={() => handleAccept(req.id)}
                                                    className="w-full h-10 bg-primary text-primary-foreground text-sm font-bold shadow-sm"
                                                >
                                                    상담 수락하기
                                                </Button>
                                            ) : (
                                                <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded text-center">
                                                    선생님의 수락을 기다리고 있습니다.
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </>
                        ) : (
                            <>
                                {ongoingChats.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 space-y-4">
                                        <p className="text-muted-foreground font-medium">진행 중인 상담이 없습니다.</p>
                                    </div>
                                ) : (
                                    ongoingChats.map(chat => (
                                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                                            <div className="flex items-center gap-4 p-4 hover:bg-accent active:bg-neutral-100 transition-colors cursor-pointer">
                                                <Avatar className="w-12 h-12 border border-border">
                                                    <AvatarImage src={chat.otherImage} className="object-cover" />
                                                    <AvatarFallback className={isTutor ? "bg-blue-100 text-blue-600" : "bg-neutral-100 text-neutral-600"}>
                                                        {chat.otherName?.[0] || "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <h4 className="font-bold text-foreground text-sm truncate">{chat.otherName}</h4>
                                                        <span className="text-xs text-muted-foreground font-medium shrink-0 ml-2">
                                                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </MobileLayout>
    );
}
