import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Star } from "lucide-react";

interface TutorProps {
    id: string;
    name: string;
    university: string;
    major: string;
    tags: string[];
    imageUrl: string;
    rating: number;
}

export function TutorCardVertical({ id, name, university, major, tags, imageUrl, rating }: TutorProps) {
    return (
        <Link href={`/tutors/${id}`} className="block relative w-[280px] h-[380px] shrink-0 group cursor-pointer">
            <div className="absolute inset-0 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
                {/* Image Placeholder (Lighter/Brighter) */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-500 ease-out">
                    {/* In real app, next/image goes here. Logic for initial/avatar fallback: */}
                    <div className="flex items-center justify-center h-full text-slate-300 font-black text-8xl select-none">
                        {name[0]}
                    </div>
                </div>

                {/* Content Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-white via-white/80 to-transparent flex flex-col justify-end h-full">
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/10 text-[10px] px-1.5 h-5">Verified</Badge>
                            <div className="flex items-center text-amber-500 text-xs font-bold">
                                <Star className="w-3 h-3 fill-current mr-0.5" />
                                {rating}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 leading-tight mb-1">{name}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-3">{university} {major}</p>

                        <div className="flex flex-wrap gap-1.5">
                            {tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 2 && (
                                <span className="text-[10px] text-slate-400 px-1">+More</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
