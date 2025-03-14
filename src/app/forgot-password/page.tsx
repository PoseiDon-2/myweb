"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import "./page.css"

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate sending reset email
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
        }, 1500)
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Forgot Password</CardTitle>
                    <CardDescription className="text-center">
                        {isSubmitted ? "Check your email for a reset link" : "Enter your email and we'll send you a reset link"}
                    </CardDescription>
                </CardHeader>
                {!isSubmitted ? (
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending reset link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                            <div className="text-center text-sm">
                                Remember your password?{" "}
                                <Link href="/login" className="text-primary hover:underline">
                                    Back to login
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                ) : (
                    <>
                        <CardContent className="space-y-4">
                            <div className="bg-muted p-3 rounded-lg text-center">
                                <p>We&apos;ve sent a password reset link to your email address. Please check your inbox.</p>
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
    )
}

