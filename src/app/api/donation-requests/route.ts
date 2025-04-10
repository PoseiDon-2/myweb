import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const itemsPerPage = 6;

    const donationRequests = await prisma.donationRequest.findMany({
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        orderBy: { deadline: "desc" },
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

export async function POST(request: NextRequest) {
    try {
        // ดึง token จาก header
        const token = request.headers.get("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return NextResponse.json({ message: "กรุณาล็อกอินก่อน" }, { status: 401 });
        }

        // Verify token และดึง userId
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string; isCreator: boolean };
        const userId = decoded.userId;

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

        if (
            !schoolName ||
            !projectTitle ||
            !description ||
            !category ||
            !targetAmount ||
            !contactName ||
            !contactPhone ||
            !contactEmail
        ) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
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

        // ตรวจสอบ Creator โดยใช้ userId
        let creator = await prisma.creator.findUnique({
            where: { userId: userId },
        });

        if (!creator) {
            const user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
            }

            creator = await prisma.creator.create({
                data: {
                    user: { connect: { id: userId } }, // เชื่อมกับ User
                    firstName: user.fname, // ดึงจาก User
                    lastName: user.lname,
                    email: user.email,
                    phone: contactPhone, // หรือจาก formData
                    schoolName: schoolName,
                    schoolDistrict: "Test District", // ปรับตามจริง
                    position: "Teacher", // ปรับตามจริง
                    schoolAddress: "123 Test Address", // ปรับตามจริง
                    isVerified: false,
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
                walletAddress: "default-wallet-address", // ปรับตามระบบจริง
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