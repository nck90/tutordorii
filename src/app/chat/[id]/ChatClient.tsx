"use client"

import { MobileLayout } from "@/components/layout/MobileLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, MoreVertical, Phone, Video } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { getChatDetailsAction, sendMessageAction } from "@/app/actions"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [chat, setChat] = useState<any>(null)
    const [msg, setMsg] = useState("")
    const scrollRef = useRef<HTMLDivElement>(null)
    const [sending, setSending] = useState(false)
    const [error, setError] = useState(false)

    useEffect(() => {
        let isMounted = true;
        const fetchChat = async () => {
            try {
                const data = await getChatDetailsAction(params.id)
                if (data) {
                    setChat(data)
                    setError(false)
                } else {
                    if (isMounted) setError(true)
                }
            } catch (e) {
                if (isMounted) setError(true)
            }
        }

        fetchChat() // Initial fetch

        const interval = setInterval(fetchChat, 3000) // Poll every 3s for snappier feel
        return () => {
            isMounted = false;
            clearInterval(interval)
        }
    }, [params.id])

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [chat?.messages])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!msg.trim() || sending) return

        const currentMsg = msg
        setMsg("")
        setSending(true)

        // Optimistic UI could go here
        await sendMessageAction(params.id, currentMsg)

        const data = await getChatDetailsAction(params.id)
        if (data) setChat(data)

        setSending(false)
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-10 text-center space-y-4 bg-background">
                <p className="text-red-500 font-bold">채팅방을 불러올 수 없습니다.</p>
                <Button onClick={() => router.back()}>뒤로 가기</Button>
            </div>
        )
    }

    if (!chat) return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    const isTutor = chat.currentUserId === chat.tutorId

    return (
        <MobileLayout hideNav>
            {/* Glassmorphic Header */}
            <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between bg-background/80 backdrop-blur-xl border-b border-border/40 max-w-md mx-auto transition-all shadow-sm">
                <div className="flex items-center gap-3">
                    <Button size="icon" variant="ghost" onClick={() => router.back()} className="-ml-2 shrink-0 hover:bg-secondary/50 rounded-full h-10 w-10">
                        <ArrowLeft className="h-5 w-5 text-foreground" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Avatar className="h-10 w-10 border border-border/50">
                                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-bold">
                                    {chat.otherUserName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="font-bold text-sm leading-none mb-1 flex items-center gap-1.5">
                                {chat.otherUserName}
                                {isTutor && <span className="bg-secondary text-secondary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-border">학생</span>}
                            </h1>
                            <span className="text-[10px] text-muted-foreground font-medium">현재 활동 중</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground">
                        <Video className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="pt-24 pb-24 px-4 min-h-screen bg-slate-100" ref={scrollRef}>
                <div className="space-y-4">
                    <div className="text-center py-2">
                        <span className="text-[10px] bg-slate-200/60 text-slate-500 px-3 py-1.5 rounded-full font-medium">
                            {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
                        </span>
                    </div>

                    {chat.messages.map((m: any, i: number) => {
                        const isMe = m.senderId === chat.currentUserId || (isTutor && m.senderId === chat.tutorId)
                        const isSequence = i > 0 && chat.messages[i - 1].senderId === m.senderId

                        return (
                            <div
                                key={m.id}
                                className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}
                            >
                                <div className={cn(
                                    "max-w-[70%] px-4 py-2.5 text-[15px] leading-relaxed relative",
                                    isMe
                                        ? "bg-blue-500 text-white rounded-[20px] rounded-tr-[4px]"
                                        : "bg-white text-slate-900 rounded-[20px] rounded-tl-[4px] shadow-sm",
                                    isSequence && (isMe ? "mt-1 rounded-tr-[20px]" : "mt-1 rounded-tl-[20px]")
                                )}>
                                    {m.content}
                                    <div className={cn("text-[9px] mt-1 flex items-center justify-end gap-0.5 opacity-70", isMe ? "text-blue-50" : "text-slate-400")}>
                                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Input Area */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-border/50 max-w-md mx-auto z-40 pb-safe">
                <form onSubmit={handleSend} className="flex items-end gap-2">
                    <div className="relative flex-1">
                        <Button size="icon" variant="ghost" type="button" className="absolute left-1 bottom-1 h-9 w-9 text-muted-foreground hover:bg-secondary rounded-full">
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                        <Input
                            value={msg}
                            onChange={e => setMsg(e.target.value)}
                            placeholder="메시지 보내기..."
                            className="pl-11 pr-4 py-3 rounded-[24px] bg-secondary/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 min-h-[48px] resize-none"
                        />
                    </div>
                    <Button type="submit" size="icon" className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shrink-0 shadow-lg shadow-primary/25 transition-transform active:scale-95" disabled={sending || !msg.trim()}>
                        <Send className="w-5 h-5 ml-0.5" />
                    </Button>
                </form>
            </div>
        </MobileLayout>
    )
}
