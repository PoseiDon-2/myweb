import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistrationSuccessPage() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Registration Successful!</CardTitle>
                    <CardDescription className="text-center">Your application has been submitted for review</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="mb-4">
                        Thank you for registering as a creator. Our team will review your application and documents. You will
                        receive an email notification once your account is approved.
                    </p>
                    <p className="text-sm text-muted-foreground">This process typically takes 1-2 business days.</p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild>
                        <Link href="/">Return to Home</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

