"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import "./page.css";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false); // เพิ่ม state สำหรับ Checkbox

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // ตรวจสอบว่า Checkbox ถูกติ๊กหรือไม่
        if (!termsAccepted) {
            setError("กรุณายอมรับ terms and conditions");
            return;
        }

        setIsLoading(true);
        setError("");

        const formData = new FormData(event.currentTarget);
        const fname = formData.get("fname") as string;
        const lname = formData.get("lname") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;


        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fname,
                    lname,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
            }

            setIsLoading(false);
            router.push("/verify-otp");
        } catch (err: unknown) {
            setIsLoading(false);
            setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-4 left-4 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                            onClick={() => window.location.href = '/'}
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">สร้างบัญชี</CardTitle>
                    <CardDescription className="text-center">กรอกรายละเอียดของคุณเพื่อสร้างบัญชี</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">ชื่อ</Label>
                                <Input id="fname" name="fname" placeholder="John" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">นามสกุล</Label>
                                <Input id="lname" name="lname" placeholder="Doe" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="name@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">รหัสผ่าน</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                checked={termsAccepted} // ควบคุมสถานะ
                                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)} // อัพเดท state
                            />
                            <Label htmlFor="terms" className="text-sm">
                                ฉันเห็นด้วยกับ{" "}
                                <Link href="/terms" className="text-primary hover:underline">
                                ข้อกำหนดและเงื่อนไข
                                </Link>
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    กำลังสร้างบัญชี...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            มีบัญชีอยู่แล้วใช่ไหม?{" "}
                            <Link href="/login" className="text-primary hover:underline">
                                เข้าสู่ระบบ
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}