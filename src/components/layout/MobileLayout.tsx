"use client";

import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
    children: React.ReactNode;
    hideNav?: boolean;
    className?: string;
}

export function MobileLayout({ children, hideNav = false, className }: MobileLayoutProps) {
    return (
        <div className="min-h-screen bg-neutral-100 flex justify-center">
            <div className={cn(
                "w-full max-w-md min-h-screen bg-background shadow-2xl relative flex flex-col",
                !hideNav && "pb-20", // Padding for Bottom Nav
                className
            )}>
                <div className="flex-1">
                    {children}
                </div>
                {!hideNav && <BottomNav />}
            </div>
        </div>
    );
}
