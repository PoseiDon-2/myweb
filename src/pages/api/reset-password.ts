import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs"; // เปลี่ยนจาก bcrypt เป็น bcryptjs

const prisma = new PrismaClient();



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { token, password } = req.body;

    // ตรวจสอบ input
    if (!token || typeof token !== "string") {
        return res.status(400).json({ error: "Valid reset token is required" });
    }
    if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "Password is required" });
    }



    try {
        // ค้นหา user ที่มี resetToken ตรงกันและยังไม่หมดอายุ
        const user = await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: { gt: new Date() }, // ยังไม่หมดอายุ
            },
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        // เข้ารหัสรหัสผ่านใหม่ด้วย bcryptjs
        const hashedPassword = await bcryptjs.hash(password, 10);

        // อัพเดทข้อมูลผู้ใช้
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpires: null,
            },
        });

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.error("Error in reset-password:", error);
        res.status(500).json({ error: "Something went wrong while resetting your password" });
    } finally {
        await prisma.$disconnect();
    }
}