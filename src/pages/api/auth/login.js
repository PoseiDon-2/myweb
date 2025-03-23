import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // ใส่ใน .env

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'เฉพาะวิธี POST เท่านั้นที่อนุญาต' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'กรุณากรอก email และ password' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // สร้าง JWT token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h' // หมดอายุใน 1 ชั่วโมง
        });

        return res.status(200).json({
            message: 'ล็อกอินสำเร็จ',
            userId: user.id,
            token: token
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการล็อกอิน' });
    }
}