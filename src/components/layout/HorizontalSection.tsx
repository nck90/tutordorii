import { cn } from "@/lib/utils";

interface SectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function HorizontalSection({ title, children, className }: SectionProps) {
    return (
        <section className={cn("py-2", className)}>
            <div className="px-5 mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground">{title}</h2>
                <span className="text-xs text-muted-foreground font-medium cursor-pointer hover:text-primary">전체보기</span>
            </div>
            <div className="flex overflow-x-auto px-5 gap-4 pb-4 scrollbar-hide snap-x snap-mandatory">
                {children}
            </div>
        </section>
    );
}
