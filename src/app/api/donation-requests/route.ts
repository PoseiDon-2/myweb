// src/app/api/donation-requests/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: NextRequest) {
    const page = parseInt(request.nextUrl.searchParams.get("page") || "1");
    const pageSize = 10; // จำนวนรายการต่อหน้า
    const offset = (page - 1) * pageSize;

    try {
        const totalRequests = await prisma.donationRequest.count();
        const donationRequests = await prisma.donationRequest.findMany({
            skip: offset,
            take: pageSize,
            include: {
                creator: {
                    select: {
                        schoolDistrict: true,
                    },
                },
            },
        });

        const totalPages = Math.ceil(totalRequests / pageSize);

        return NextResponse.json({
            donationRequests,
            totalPages,
        });
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch data" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        console.log("Server Session:", session);

        if (!session || !session.user.id) {
            return NextResponse.json({ message: "กรุณาล็อกอินก่อน" }, { status: 401 });
        }

        if (session.user.role !== "CREATOR") {
            return NextResponse.json(
                { message: "เฉพาะผู้สร้างเท่านั้นที่สามารถสร้างคำขอได้" },
                { status: 403 }
            );
        }

        const userId = parseInt(session.user.id);
        const formData = await request.formData();
        const schoolName = formData.get("schoolName") as string;
        const projectTitle = formData.get("projectTitle") as string;
        const description = formData.get("description") as string;
        const category = formData.get("category") as string;
        const targetAmount = parseFloat(formData.get("targetAmount") as string);
        const deadline = formData.get("deadline")
            ? new Date(formData.get("deadline") as string)
            : null;
        const contactName = formData.get("contactName") as string;
        const contactPhone = formData.get("contactPhone") as string;
        const contactEmail = formData.get("contactEmail") as string;
        const image = formData.get("image") as File | null;
        const walletAddress = formData.get("walletAddress") as string;

        if (
            !schoolName ||
            !projectTitle ||
            !description ||
            !category ||
            isNaN(targetAmount) ||
            targetAmount <= 0 ||
            !contactName ||
            !contactPhone ||
            !contactEmail ||
            !walletAddress
        ) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง" },
                { status: 400 }
            );
        }

        let imageUrl: string | undefined;
        if (image) {
            const arrayBuffer = await image.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "donation-requests" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });
            imageUrl = (result as any).secure_url;
        }

        let creator = await prisma.creator.findUnique({
            where: { userId },
        });

        if (!creator) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
            }
            creator = await prisma.creator.create({
                data: {
                    userId,
                    firstName: user.fname,
                    lastName: user.lname,
                    email: user.email,
                    phone: contactPhone,
                    schoolName,
                    schoolDistrict: "Unknown",
                    position: "Creator",
                    schoolAddress: "Unknown",
                    termsAccepted: true,
                    privacyAccepted: true,
                },
            });
        }

        const donationRequest = await prisma.donationRequest.create({
            data: {
                schoolName,
                projectTitle,
                description,
                category,
                targetAmount,
                currentAmount: 0,
                deadline,
                contactName,
                contactPhone,
                contactEmail,
                image: imageUrl || null,
                walletAddress,
                creatorId: creator.id,
            },
        });

        return NextResponse.json(
            { message: "คำขอรับบริจาคถูกสร้างสำเร็จ", data: donationRequest },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error creating donation request:", error);
        return NextResponse.json(
            { message: "เกิดข้อผิดพลาดในการสร้างคำขอ", error: String(error) },
            { status: 500 }
        );
    }
}

// Renamed to avoid conflict
export async function GETCreatorRequests(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return NextResponse.json({ message: "กรุณาล็อกอินก่อน" }, { status: 401 });
    }

    const donationRequests = await prisma.donationRequest.findMany({
        where: { creator: { userId: parseInt(session.user.id) } },
        include: {
            creator: {
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    schoolName: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: donationRequests }, { status: 200 });
}
