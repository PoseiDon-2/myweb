"use client";

import type React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import "./page.css"; 

function ResetPasswordContent() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get("token");

    useEffect(() => {
        if (!token) setError("Invalid or missing reset token");
    }, [token]);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => router.push("/login"), 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, router]);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        if (!token) {
            setError("Invalid or missing reset token");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to reset password");
            }

            setIsSuccess(true);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong while resetting your password");
            }
            console.error("Error:", err);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        {isSuccess ? "Your password has been reset successfully" : "Enter your new password below"}
                    </CardDescription>
                </CardHeader>
                {!isSuccess ? (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isLoading || !token}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Resetting password...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                            <div className="text-center text-sm">
                                Back to{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    <>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-3 rounded-lg text-center">
                                <p>Your password has been reset successfully. You will be redirected to the login page shortly.</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button asChild className="w-full">
                                <Link href="/login">Back to Login</Link>
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
