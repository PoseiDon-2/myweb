import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const { userId, otp } = await request.json();

        if (!userId || !otp) {
            return NextResponse.json({ message: 'กรุณากรอก userId และ otp' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(userId) },
        });

        if (!user) {
            return NextResponse.json({ message: 'ไม่พบผู้ใช้' }, { status: 404 });
        }

        if (user.isVerified) {
            return NextResponse.json({ message: 'ผู้ใช้นี้ยืนยันตัวตนแล้ว' }, { status: 400 });
        }

        if (!user.resetToken) {
            return NextResponse.json({ message: 'ไม่พบ OTP กรุณาขอ OTP ใหม่' }, { status: 400 });
        }

        console.log(`Verifying OTP for user ${userId}: ${otp} against ${user.resetToken}`);

        if (user.resetToken !== otp || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            return NextResponse.json({ message: 'OTP ไม่ถูกต้องหรือหมดอายุ' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, resetToken: null, resetTokenExpires: null },
        });

        console.log(`User ${userId} verified, resetToken cleared: ${updatedUser.resetToken}`);

        return NextResponse.json({ message: 'ยืนยัน OTP สำเร็จ' }, { status: 200 });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการยืนยัน OTP' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}