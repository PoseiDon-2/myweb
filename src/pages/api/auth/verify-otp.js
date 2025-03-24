import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'เฉพาะวิธี POST เท่านั้นที่อนุญาต' });
    }

    const { userId, otp } = req.body;

    console.log('Received userId:', userId, 'OTP:', otp); // ดูค่าที่รับมา

    if (!userId || !otp) {
        return res.status(400).json({ message: 'กรุณากรอก userId และ otp' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) }
        });

        console.log('Found user:', user); // ดูข้อมูลผู้ใช้

        if (!user) {
            return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
        }

        if (user.otp !== otp) {
            console.log('OTP mismatch. Expected:', user.otp, 'Received:', otp);
            return res.status(400).json({ message: 'OTP ไม่ถูกต้อง' });
        }

        const otpAge = new Date().getTime() - new Date(user.createdAt).getTime();
        console.log('OTP age (ms):', otpAge); // ดูอายุ OTP
        if (otpAge > 600000) {
            return res.status(400).json({ message: 'OTP หมดอายุแล้ว กรุณาสมัครใหม่' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: 1,
                otp: null
            }
        });

        console.log('Updated user:', updatedUser); // ดูผลลัพธ์การอัพเดท

        return res.status(200).json({ message: 'ยืนยัน OTP สำเร็จ' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการยืนยัน OTP' });
    }
}