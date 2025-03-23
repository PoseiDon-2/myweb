import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'เฉพาะวิธี POST เท่านั้นที่อนุญาต' });
    }

    const { fname, lname, email, password } = req.body;

    if (!fname || !lname || !email || !password) {
        return res.status(400).json({ message: 'กรุณากรอก fname, lname, email และ password' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'อีเมลนี้มีผู้ใช้ที่ยืนยันแล้ว' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        let user;
        if (existingUser) {
            user = await prisma.user.update({
                where: { id: existingUser.id },
                data: { fname, lname, password: hashedPassword, otp, isVerified: false }
            });
        } else {
            user = await prisma.user.create({
                data: { fname, lname, email, password: hashedPassword, otp, isVerified: false }
            });
        }

        const msg = {
            to: email,
            from: process.env.EMAIL_FROM, // yourname@gmail.com
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
        };

        await sgMail.send(msg);

        return res.status(201).json({ 
            message: 'สมัครสมาชิกสำเร็จ กรุณายืนยัน OTP ที่ส่งไปยังอีเมลของคุณ', 
            userId: user.id 
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิกหรือส่ง OTP' });
    }
}