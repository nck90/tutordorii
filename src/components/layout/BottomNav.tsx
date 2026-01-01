"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Home, Search, MessageCircle, User, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();
    const { role } = useUser();

    const isTutor = role === "tutor";

    const tabs = isTutor ? [
        { name: "홈", href: "/", icon: Home },
        { name: "수업 일정", href: "/schedule", icon: Calendar },
        { name: "과외상담", href: "/chat", icon: MessageCircle },
        { name: "마이페이지", href: "/my", icon: User },
    ] : [
        { name: "홈", href: "/", icon: Home },
        { name: "선생님 찾기", href: "/search", icon: Search },
        { name: "과외상담", href: "/chat", icon: MessageCircle },
        { name: "마이페이지", href: "/my", icon: User },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/40 pb-safe">
            <div className="container max-w-md mx-auto flex items-center justify-around h-16">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
                                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-6 w-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{tab.name}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
