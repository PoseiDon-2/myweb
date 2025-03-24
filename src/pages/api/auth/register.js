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
        // ตรวจสอบว่าอีเมลนี้มีผู้ใช้งานแล้วหรือไม่
        const existingUser = await prisma.user.findUnique({ where: { email } });
        
        // หากมีผู้ใช้งานที่ยืนยันแล้วให้แสดงข้อความผิดพลาด
        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({ message: 'อีเมลนี้มีผู้ใช้ที่ยืนยันแล้ว' });
        }

        // แฮชรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        let user;
        // ถ้ามีผู้ใช้งานแล้วให้ทำการอัปเดตข้อมูล
        if (existingUser) {
            user = await prisma.user.update({
                where: { id: existingUser.id },
                data: { fname, lname, password: hashedPassword, otp, isVerified: false }
            });
        } else {
            // ถ้ายังไม่มีผู้ใช้งานให้สร้างผู้ใช้ใหม่
            user = await prisma.user.create({
                data: { fname, lname, email, password: hashedPassword, otp, isVerified: false }
            });
        }

        // สร้างข้อความอีเมล OTP
        const msg = {
            to: email,
            from: process.env.EMAIL_FROM, // ตรวจสอบว่า EMAIL_FROM ถูกตั้งค่าใน .env หรือไม่
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
        };

        // ตรวจสอบว่า sgMail สามารถส่งอีเมลได้หรือไม่
        try {
            console.log('Sending OTP email to:', email); // ตรวจสอบว่าอีเมลถูกส่งไปถูกต้อง
            await sgMail.send(msg);
        } catch (error) {
            console.error('Error sending OTP email:', error.response ? error.response.body : error);
            return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการส่ง OTP' });
        }

        // ตอบกลับผู้ใช้เมื่อการสมัครสมาชิกเสร็จสมบูรณ์
        return res.status(201).json({ 
            message: 'สมัครสมาชิกสำเร็จ กรุณายืนยัน OTP ที่ส่งไปยังอีเมลของคุณ', 
            userId: user.id 
        });
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' });
    }
}
