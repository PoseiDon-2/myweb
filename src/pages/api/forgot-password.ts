import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto"; // สำหรับสร้าง token
import sgMail from "@sendgrid/mail"; // ใช้ SendGrid

const prisma = new PrismaClient();

// ตั้งค่า SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email || typeof email !== "string") {
        return res.status(400).json({ error: "Email is required" });
    }

    try {
        // ตรวจสอบว่า email มีอยู่ในระบบ
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // เพื่อความปลอดภัย ไม่บอกว่า email ไม่มีจริง
            return res.status(200).json({ message: "If the email exists, a reset link has been sent" });
        }

        // สร้าง reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpires = new Date(Date.now() + 3600000); // หมดอายุใน 1 ชั่วโมง

        // อัพเดท user ด้วย token และวันหมดอายุ
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpires,
            },
        });

        // สร้างลิงก์รีเซ็ต
        const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

        // ส่งอีเมลด้วย SendGrid
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM as string, // อีเมลที่ Verify แล้ว
            subject: "Password Reset Request",
            html: `
        <p>คุณได้ขอรีเซ็ตรหัสผ่าน</p>
        <p>คลิก <a href="${resetLink}">ที่นี่</a> เพื่อรีเซ็ตรหัสผ่าน</p>
        <p>ลิงก์นี้จะหมดอายุใน 1 ชั่วโมง</p>
        <p>หากคุณไม่ได้ทำการร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้</p>
      `,
        };

        await sgMail.send(msg);

        res.status(200).json({ message: "If the email exists, a reset link has been sent" });
    } catch (error) {
        console.error("Error in forgot-password:", error);
        res.status(500).json({ error: "Something went wrong while processing your request" });
    } finally {
        await prisma.$disconnect();
    }
}