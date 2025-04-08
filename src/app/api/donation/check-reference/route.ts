import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // ปรับ path ตามโครงสร้างของคุณ

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref");

    if (!ref) {
        return NextResponse.json({ error: "Reference number is required" }, { status: 400 });
    }

    try {
        const existingDonation = await prisma.donation.findUnique({
            where: { referenceNumber: ref },
        });

        return NextResponse.json({ exists: !!existingDonation }, { status: 200 });
    } catch (error) {
        console.error("Check Reference Error:", error);
        return NextResponse.json({ error: "Failed to check reference" }, { status: 500 });
    }
}