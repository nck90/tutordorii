import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle2, GraduationCap, Star } from "lucide-react";

interface TutorProps {
    name: string;
    university: string;
    major: string;
    tags: string[];
    imageUrl: string;
    rating: number;
    reviewCount: number;
}

export function TutorCard({ name, university, major, tags, imageUrl, rating, reviewCount }: TutorProps) {
    return (
        <Link href="/tutors/1">
            <Card className="group overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                <CardHeader className="p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        {/* Placeholder for real image or avatar if strict next/image is tricky without domains */}
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-neutral-500">
                            {/* Fallback visual if image fails or needs domain config */}
                            <span className="text-4xl font-light opacity-50">{name[0]}</span>
                        </div>
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-60" />

                        <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-xl font-bold text-white tracking-tight">{name}</h3>
                                <CheckCircle2 className="h-5 w-5 text-blue-400 fill-blue-400/20" />
                            </div>
                            <div className="flex items-center text-neutral-300 text-sm font-medium">
                                <GraduationCap className="h-4 w-4 mr-1.5 text-primary" />
                                {university}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-5 pt-4">
                    <div className="flex items-center gap-1.5 mb-4 text-sm text-foreground/80">
                        <span className="font-semibold text-primary">{major}</span> 전공
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="bg-secondary/50 hover:bg-secondary text-xs font-normal">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="p-5 pt-0 flex items-center justify-between text-muted-foreground text-sm">
                    <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-bold text-foreground mr-1">{rating}</span>
                        <span className="text-xs">({reviewCount})</span>
                    </div>
                    <div className="text-xs font-medium px-2 py-1 rounded bg-primary/10 text-primary">
                        Verified Pro
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}
