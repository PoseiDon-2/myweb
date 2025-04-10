import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'กรุณากรอก email และ password' }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: { creator: true },
        });

        if (!user || !await bcrypt.compare(password, user.password)) {
            return NextResponse.json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' }, { status: 401 });
        }

        if (!user.isVerified) {
            return NextResponse.json({ message: 'กรุณายืนยัน OTP ก่อนล็อกอิน' }, { status: 403 });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, isCreator: !!user.creator, creatorId: user.creator ? (user.creator as { id: string }).id : null },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json({
            message: 'ล็อกอินสำเร็จ',
            userId: user.id,
            isCreator: !!user.creator,
            creatorId: user.creator ? (user.creator as { id: string }).id : null,
            token,
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return NextResponse.json({ message: 'เกิดข้อผิดพลาดในการล็อกอิน' }, { status: 500 });
    }
}