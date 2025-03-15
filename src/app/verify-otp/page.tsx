"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import "./page.css"

export default function VerifyOTPPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        // Focus the first input on mount
        if (inputRefs.current[0]) {
            inputRefs.current[0]?.focus() // Optional chaining for safety
        }
    }, [])

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Move to next input if current input is filled
        if (value && index < 5 && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1]?.focus() // Use optional chaining to avoid type error
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
            inputRefs.current[index - 1]?.focus() // Optional chaining for safety
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()

        // Check if pasted content is a 6-digit number
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split("")
            setOtp(newOtp)

            // Focus the last input
            if (inputRefs.current[5]) {
                inputRefs.current[5]?.focus() // Optional chaining for safety
            }
        }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate OTP verification
        setTimeout(() => {
            setIsLoading(false)
            router.push("/dashboard")
        }, 1500)
    }

    const handleResendOTP = () => {
        // Simulate resending OTP
        alert("A new OTP has been sent to your email")
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
                    <CardDescription className="text-center">
                        We've sent a 6-digit code to your email. Enter the code below to verify your account.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center space-x-2">
                            {otp.map((digit, index) => (
                                <Input
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el;
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-12 h-12 text-center text-lg"
                                    required
                                />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button type="submit" className="w-full" disabled={isLoading || otp.some((digit) => !digit)}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify"
                            )}
                        </Button>
                        <div className="text-center text-sm">
                            Didn't receive the code?{" "}
                            <Button variant="link" className="p-0 h-auto" onClick={handleResendOTP}>
                                Resend OTP
                            </Button>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}