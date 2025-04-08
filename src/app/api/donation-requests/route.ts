// app/api/donation-requests/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 6;

    const donationRequests = await prisma.donationRequest.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy: { deadline: "desc" }, // ใช้ deadline เพราะ schema เดิมไม่มี createdAt
        include: { creator: true },
    });

    const totalItems = await prisma.donationRequest.count();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return NextResponse.json({
        donationRequests,
        totalPages,
        currentPage: page,
    });
}