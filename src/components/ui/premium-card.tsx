"use client";

import { cn } from "@/lib/utils";

interface PremiumCardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean;
}

export const PremiumCard = ({
    className,
    children,
    hoverEffect = true,
    ...props
}: PremiumCardProps) => {
    return (
        <div
            className={cn(
                "bg-card text-card-foreground rounded-3xl border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-shadow duration-200",
                hoverEffect && "hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};
