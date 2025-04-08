import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            requestId,
            amount,
            name,
            email,
            phone,
            message,
            taxReceipt,
            isAnonymous,
            slipUrl,
            referenceNumber,
        } = body;

        // ตรวจสอบ requestId
        const donationRequest = await prisma.donationRequest.findUnique({
            where: { id: requestId },
        });
        if (!donationRequest) {
            return NextResponse.json({ error: "Invalid requestId" }, { status: 400 });
        }

        // เริ่ม transaction
        const result = await prisma.$transaction(async (prisma) => {
            // บันทึก Donation
            const donation = await prisma.donation.create({
                data: {
                    requestId,
                    amount,
                    name,
                    email,
                    phone,
                    message,
                    taxReceipt,
                    isAnonymous,
                    slipUrl,
                    referenceNumber,
                },
            });

            // อัปเดต currentAmount
            const updatedRequest = await prisma.donationRequest.update({
                where: { id: requestId },
                data: {
                    currentAmount: {
                        increment: amount,
                    },
                },
            });

            return { donation, updatedRequest };
        });

        console.log("Updated DonationRequest:", result.updatedRequest); // ดีบัก
        return NextResponse.json(result.donation, { status: 201 });
    } catch (error) {
        console.error("Donation Error:", error);
        return NextResponse.json({ error: "Failed to record donation" }, { status: 500 });
    }
}