import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { cn } from "@/lib/utils";

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
        <Link href={`/tutors/${id}`}>
            <PremiumCard
                className="relative w-[280px] h-[380px] shrink-0 overflow-hidden border-0 group cursor-pointer"
                hoverEffect={true}
            >
                {/* Image Layer */}
                <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 group-hover:scale-110 transition-transform duration-700 ease-in-out">
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-neutral-200 dark:text-neutral-700 font-black text-8xl select-none">
                            {name[0]}
                        </div>
                    )}
                </div>

                {/* Gradient Overlay - Optimized for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-5">

                    {/* Floating Content */}
                    <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 ease-out">

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-0 text-[10px] px-2 h-5 rounded-full font-semibold tracking-wide">
                                VERIFIED
                            </Badge>
                            <div className="flex items-center text-amber-400 text-xs font-bold drop-shadow-sm">
                                <Star className="w-3.5 h-3.5 fill-current mr-1" />
                                {rating}
                            </div>
                        </div>

                        {/* Name & Title */}
                        <h3 className="text-2xl font-black text-white leading-tight mb-1 drop-shadow-md">{name}</h3>
                        <p className="text-sm text-neutral-300 font-medium mb-4 line-clamp-1">{university} {major}</p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                            {tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold text-white/90 bg-white/10 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 2 && (
                                <span className="text-[10px] text-white/60 px-1 font-medium">+{tags.length - 2}</span>
                            )}
                        </div>
                    </div>
                </div>
            </PremiumCard>
        </Link>
    );
}
