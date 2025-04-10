"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

import "./page.css";

export default function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const userId = searchParams?.get("userId") || null;

    useEffect(() => {
        if (!userId) {
            toast.error("ไม่พบ userId กรุณาสมัครใหม่");
            router.push("/register");
        }
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus();
        }
    }, [userId, router]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text/plain").trim();

        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split("");
            setOtp(newOtp);
            if (inputRefs.current[5]) {
                inputRefs.current[5]?.focus();
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otpString = otp.join("");
        if (otpString.length !== 6) {
            toast.error("กรุณากรอก OTP ให้ครบ 6 หลัก");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, otp: otpString }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาดในการยืนยัน OTP");
            }

            toast.success("ยืนยัน OTP สำเร็จ", { description: "คุณสามารถล็อกอินได้แล้ว" });
            router.push("/login");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ";
            toast.error("เกิดข้อผิดพลาด", { description: errorMessage });
            if (error instanceof Error && (error.message === "OTP ไม่ถูกต้องหรือหมดอายุ" || error.message === "ไม่พบ OTP กรุณาขอ OTP ใหม่")) {
                setTimeout(() => handleResendOTP(), 2000); // ส่ง OTP ใหม่หลัง 2 วินาที
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!userId) {
            toast.error("ไม่พบ userId กรุณาสมัครใหม่");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "เกิดข้อผิดพลาดในการส่ง OTP ใหม่");
            }

            toast.success("ส่ง OTP ใหม่สำเร็จ", { description: "กรุณาตรวจสอบอีเมลของคุณ" });
            setOtp(["", "", "", "", "", ""]);
            inputRefs.current[0]?.focus();
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด", { description: error instanceof Error ? error.message : "Unknown error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">ยืนยันอีเมลของคุณ</CardTitle>
                    <CardDescription className="text-center">
                        เราได้ส่งรหัส 6 หลักไปยังอีเมลของคุณ กรุณากรอกรหัสเพื่อยืนยันบัญชี
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => { inputRefs.current[index] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-12 h-12 text-center text-lg"
                                    required
                                    disabled={isLoading}
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading || otp.some((digit) => !digit)}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    กำลังยืนยัน...
                                </>
                            ) : (
                                "ยืนยัน"
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            ไม่ได้รับรหัส?{" "}
                            <Button variant="link" className="p-0 h-auto" onClick={handleResendOTP} disabled={isLoading}>
                                ส่ง OTP ใหม่
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}