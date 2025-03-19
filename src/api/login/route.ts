import { NextResponse } from "next/server";
import { db } from "@/lib/db"; // สมมติว่าคุณมีไฟล์เชื่อมต่อฐานข้อมูล
import bcrypt from "bcryptjs"; // ใช้สำหรับตรวจสอบ password

export async function POST(request: Request) {
    try {
        // ดึงข้อมูลจาก request body
        const { email, password } = await request.json();

        // ตรวจสอบว่ามีข้อมูลครบไหม
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // ค้นหาผู้ใช้ในฐานข้อมูล
        const user = await db.user.findUnique({
            where: { email },
        });

        // ถ้าไม่เจอผู้ใช้
        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // ตรวจสอบรหัสผ่าน
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // ถ้าผ่านการตรวจสอบ ส่งข้อมูลผู้ใช้กลับ (ยกเว้น password)
        const { password: _, ...userWithoutPassword } = user;
        return NextResponse.json({
            message: "Login successful",
            user: userWithoutPassword,
        });
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}