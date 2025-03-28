import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { requestId, amount, name, email, phone, message, taxReceipt, isAnonymous, slipUrl } = await request.json();

    try {
        const donation = await prisma.donation.create({
            data: {
                id: `donation-${Date.now()}`,
                requestId,
                amount,
                name,
                email,
                phone,
                message,
                taxReceipt,
                isAnonymous,
                slipUrl,
            },
        });

        await prisma.donationRequest.update({
            where: { id: requestId },
            data: {
                currentAmount: { increment: amount },
            },
        });

        return NextResponse.json(donation, { status: 201 });
    } catch (error) {
        console.error("Error creating donation:", error);
        return NextResponse.json({ error: "Failed to record donation" }, { status: 500 });
    }
}