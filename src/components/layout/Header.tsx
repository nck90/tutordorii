import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-xl items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-xl font-bold tracking-tight text-foreground">
                            과외돌 <span className="text-primary">.</span>
                        </span>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                    <Link href="/about" className="hover:text-foreground transition-colors">
                        서비스 소개
                    </Link>
                    <Link href="/tutors" className="hover:text-foreground transition-colors">
                        튜터 찾기
                    </Link>
                    <Link href="/apply" className="hover:text-foreground transition-colors">
                        튜터 지원
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="hidden sm:flex">
                        로그인
                    </Button>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        시범 수업 신청
                    </Button>
                </div>
            </div>
        </header>
    );
}
