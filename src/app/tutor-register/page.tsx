"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateTutorProfileAction } from "@/app/actions";
import { Camera } from "lucide-react";

export default function TutorRegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [preview, setPreview] = useState<string>("");

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        // We reuse the existing updateTutorProfileAction since it handles the exact fields we need.
        // In a real app we might want a specific 'completeRegistration' action to toggle an 'isOnboarded' flag,
        // but for now, filling the profile is sufficient.

        const res = await updateTutorProfileAction(formData);

        if (res?.error) {
            alert(res.error);
            setIsLoading(false);
        } else {
            router.push("/my");
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">선생님 프로필 등록</h1>
                    <p className="text-slate-500">멋진 프로필을 완성하고 수강생을 만나보세요!</p>
                </div>

                <form action={handleSubmit} className="space-y-8">
                    {/* Profile Image */}
                    <div className="flex flex-col items-center">
                        <Label htmlFor="image" className="cursor-pointer group relative">
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300 overflow-hidden group-hover:border-blue-500 transition-colors">
                                {preview ? (
                                    <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <Camera className="w-10 h-10 text-slate-400 group-hover:text-blue-500" />
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg">
                                <Camera className="w-4 h-4" />
                            </div>
                            <Input
                                name="image"
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </Label>
                        <p className="text-xs text-slate-400 mt-2">프로필 사진을 등록해주세요</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="university">대학교</Label>
                            <Input
                                name="university"
                                id="university"
                                required
                                placeholder="예: 한국대학교"
                                className="h-12 rounded-xl bg-slate-50 border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="major">전공</Label>
                            <Input
                                name="major"
                                id="major"
                                required
                                placeholder="예: 컴퓨터공학과"
                                className="h-12 rounded-xl bg-slate-50 border-slate-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">시간당 수업료</Label>
                            <div className="relative">
                                <Input
                                    name="price"
                                    id="price"
                                    type="number"
                                    required
                                    defaultValue={30000}
                                    className="h-12 rounded-xl bg-slate-50 border-slate-200 pl-4 pr-10"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">원</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">한줄 소개</Label>
                            <Textarea
                                name="bio"
                                id="bio"
                                required
                                placeholder="학생들에게 보여줄 간단한 소개를 적어주세요."
                                className="min-h-[100px] rounded-xl bg-slate-50 border-slate-200 resize-none p-4"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-6 text-lg rounded-xl font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200"
                        disabled={isLoading}
                    >
                        {isLoading ? "등록 중..." : "등록 완료하기"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
