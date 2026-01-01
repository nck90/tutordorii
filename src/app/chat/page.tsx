"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChatPage() {
    const { role } = useUser();
    const router = useRouter();

    if (!role) {
        // In a real app we'd redirect or show loading
        return <MobileLayout><p className="p-8 text-center text-muted-foreground">로그인이 필요합니다.</p></MobileLayout>;
    }

    const isTutor = role === "tutor";

    // Mock Chats
    const chats = isTutor ? [
        { id: 1, name: "박준원 학생", message: "선생님, 다음 수업 시간 변경 가능할까요?", time: "방금 전", unread: 2 },
        { id: 2, name: "김민지 학생", message: "숙제 제출했습니다! 확인 부탁드려요.", time: "1시간 전", unread: 0 },
    ] : [
        { id: 1, name: "Sarah Kim 선생님", message: "네, 그럼 수요일 7시로 변경해드릴게요.", time: "방금 전", unread: 1 },
        { id: 2, name: "Daniel Park 선생님", message: "오늘 수업 고생많으셨습니다!", time: "어제", unread: 0 },
    ];

    return (
        <MobileLayout>
            <div className="bg-background min-h-screen pb-20">
                <div className="sticky top-0 bg-background/95 backdrop-blur z-20 border-b border-border/40 px-5 h-14 flex items-center justify-between">
                    <span className="text-xl font-bold tracking-tight">과외상담</span>
                </div>

                <div className="divide-y divide-border/40">
                    {chats.map(chat => (
                        <Link href={`/chat/${chat.id}`} key={chat.id}>
                            <div className="flex items-center gap-4 p-4 hover:bg-neutral-50 active:bg-neutral-100 transition-colors cursor-pointer">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage src="" />
                                    <AvatarFallback className={isTutor ? "bg-blue-100 text-blue-600" : "bg-primary/10 text-primary"}>
                                        {chat.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-foreground text-sm truncate">{chat.name}</h4>
                                        <span className="text-xs text-muted-foreground font-medium shrink-0 ml-2">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-neutral-500 truncate">{chat.message}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shrink-0">
                                        {chat.unread}
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}

                    {chats.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 space-y-4">
                            <p className="text-muted-foreground font-medium">진행 중인 상담이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
}
