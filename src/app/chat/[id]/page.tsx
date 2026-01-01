"use client";

import { MobileLayout } from "@/components/layout/MobileLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MoreVertical, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const MOCK_MESSAGES = [
    { id: 1, text: "안녕하세요 선생님! IB Math HL 수업 관련해서 문의드립니다.", sender: "me", time: "오후 2:00" },
    { id: 2, text: "안녕하세요 준원학생! 반갑습니다. 어떤 부분이 가장 궁금하신가요?", sender: "other", time: "오후 2:05" },
    { id: 3, text: "방학 동안 미적분 파트를 집중적으로 나가고 싶습니다. 주 2회 가능한가요?", sender: "me", time: "오후 2:06" },
    { id: 4, text: "네 가능합니다. 수요일, 금요일 저녁 8시 타임이 비어있습니다. 커리큘럼 먼저 보내드릴까요?", sender: "other", time: "오후 2:10" },
];

export default function ChatRoomPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [messages, setMessages] = useState(MOCK_MESSAGES);
    const [inputText, setInputText] = useState("");

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages([...messages, {
            id: Date.now(),
            text: inputText,
            sender: "me",
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }]);
        setInputText("");
    };

    return (
        <MobileLayout hideNav>
            <div className="flex flex-col h-screen bg-slate-50">
                {/* Chat Header */}
                <div className="bg-background/95 backdrop-blur border-b border-border/40 p-3 flex items-center gap-3 sticky top-0 z-50">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-2 flex-1">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">SK</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-sm font-bold">Sarah Kim 선생님</h2>
                            <span className="text-[10px] text-green-500 font-medium flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
                                답변 빠름
                            </span>
                        </div>
                    </div>

                    <Button variant="ghost" size="icon">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>

                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20">
                    <p className="text-center text-xs text-muted-foreground my-4">2024년 6월 15일</p>
                    {messages.map((msg) => {
                        const isMe = msg.sender === "me";
                        return (
                            <div key={msg.id} className={cn("flex gap-2 max-w-[80%]", isMe ? "ml-auto flex-row-reverse" : "")}>
                                {!isMe && (
                                    <Avatar className="h-8 w-8 shrink-0 mt-1">
                                        <AvatarFallback className="bg-primary/10 text-[10px]">SK</AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                                    isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border border-slate-100 rounded-tl-none"
                                )}>
                                    {msg.text}
                                </div>
                                <span className="text-[10px] text-muted-foreground self-end mb-1 shrink-0">
                                    {msg.time}
                                </span>
                            </div>
                        )
                    })}
                </div>

                {/* Input Area */}
                <div className="p-3 bg-background border-t border-border/40 pb-8 sticky bottom-0">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="flex items-center gap-2"
                    >
                        <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground">
                            <span className="text-xl">+</span>
                        </Button>
                        <Input
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="메시지를 입력하세요..."
                            className="flex-1 rounded-full bg-slate-100 border-0 h-10 px-4 focus-visible:ring-1 focus-visible:ring-primary/50"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className={cn(
                                "rounded-full h-10 w-10 shrink-0 transition-opacity",
                                inputText.trim() ? "opacity-100" : "opacity-50"
                            )}
                            disabled={!inputText.trim()}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </div>
        </MobileLayout>
    );
}
