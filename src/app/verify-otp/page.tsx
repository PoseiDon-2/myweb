// ./src/app/verify-otp/page.tsx
import React from "react";
import { Suspense } from "react";
import VerifyOTPContent from "@/components/verify-otp/VerifyOTPContent"; // component ลูก

export default function VerifyOTPPage() {
    return (
        <Suspense fallback={<div>กำลังโหลด...</div>}>
            <VerifyOTPContent />
        </Suspense>
    );
}