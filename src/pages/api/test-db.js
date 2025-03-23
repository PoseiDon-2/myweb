import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    try {
        // ทดสอบการเชื่อมต่อโดยดึงข้อมูล
        const currentTime = await prisma.$queryRaw`SELECT NOW() as current_time`;
        res.status(200).json({ message: 'Database connected!', data: currentTime });
    } catch (error) {
        res.status(500).json({ message: 'Database connection failed', error: error.message });
    } finally {
        await prisma.$disconnect(); // ปิดการเชื่อมต่อ
    }
}