import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'เฉพาะวิธี POST เท่านั้นที่อนุญาต' });
    }

    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ message: 'กรุณากรอก userId และ otp' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
        }

        // ตรวจสอบเวลาหมดอายุ (10 นาที = 600,000 ms)
        const otpAge = new Date().getTime() - new Date(user.createdAt).getTime();
        if (otpAge > 600000) {
            return res.status(400).json({ message: 'OTP หมดอายุแล้ว กรุณาสมัครใหม่' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                otp: null
            }
        });

        return res.status(200).json({ message: 'ยืนยัน OTP สำเร็จ' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยัน OTP' });
    }
}