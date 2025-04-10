import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

const prisma = new PrismaClient();

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
    try {
        const { fname, lname, email, password, userId } = await request.json();

        if (userId) {
            // ส่ง OTP ใหม่
            const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });
            if (!user) {
                return NextResponse.json({ message: 'ไม่พบผู้ใช้' }, { status: 404 });
            }
            if (user.isVerified) {
                return NextResponse.json({ message: 'ผู้ใช้นี้ยืนยันตัวตนแล้ว' }, { status: 400 });
            }

            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // หมดอายุใน 10 นาที

            console.log(`Generating OTP for user ${userId}: ${otp}`);

            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { resetToken: otp, resetTokenExpires: otpExpires },
            });

            console.log(`Updated user ${userId} with OTP: ${updatedUser.resetToken}`);

            const msg = {
                to: user.email,
                from: process.env.EMAIL_FROM || 'default@example.com',
                subject: 'Your New OTP Code',
                text: `Your new OTP code is ${otp}. It is valid for 10 minutes.`,
                html: `<p>Your new OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
            };

            await sgMail.send(msg);

            return NextResponse.json(
                { message: 'ส่ง OTP ใหม่สำเร็จ กรุณาตรวจสอบอีเมลของคุณ', userId: user.id },
                { status: 200 }
            );
        }

        // สมัครสมาชิกใหม่
        if (!fname || !lname || !email || !password) {
            return NextResponse.json({ message: 'กรุณากรอก fname, lname, email และ password' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser && existingUser.isVerified) {
            return NextResponse.json({ message: 'อีเมลนี้มีผู้ใช้ที่ยืนยันแล้ว' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        console.log(`Generating OTP for new user ${email}: ${otp}`);

        let user;
        if (existingUser) {
            user = await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    fname,
                    lname,
                    password: hashedPassword,
                    resetToken: otp,
                    resetTokenExpires: otpExpires,
                    isVerified: false,
                },
            });
        } else {
            user = await prisma.user.create({
                data: {
                    fname,
                    lname,
                    email,
                    password: hashedPassword,
                    resetToken: otp,
                    resetTokenExpires: otpExpires,
                    isVerified: false,
                },
            });
        }

        console.log(`Saved user ${user.id} with OTP: ${user.resetToken}`);

        const msg = {
            to: email,
            from: process.env.EMAIL_FROM || 'default@example.com',
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
            html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
        };

        await sgMail.send(msg);

        return NextResponse.json(
            { message: 'สมัครสมาชิกสำเร็จ กรุณายืนยัน OTP ที่ส่งไปยังอีเมลของคุณ', userId: user.id },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error in register:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการสมัครสมาชิกหรือส่ง OTP' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}