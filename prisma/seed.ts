const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // ลบข้อมูลเก่า (optional)
    await prisma.donation.deleteMany();
    await prisma.donationRequest.deleteMany();
    await prisma.creator.deleteMany();

    // เพิ่ม Creator
    const creator = await prisma.creator.create({
        data: {
            id: 'creator-1',
            firstName: 'Test',
            lastName: 'Creator',
            email: 'test@creator.com',
            phone: '1234567890',
            schoolName: 'โรงเรียนทดสอบ',
            schoolDistrict: 'เขตทดสอบ',
            position: 'ครู',
            schoolAddress: '123 ถนนทดสอบ',
            isVerified: true,
            termsAccepted: true,
            privacyAccepted: true,
        },
    });

    // เพิ่ม DonationRequest
    const donationRequest = await prisma.donationRequest.create({
        data: {
            id: '1',
            schoolName: 'โรงเรียนทดสอบ',
            projectTitle: 'โครงการทดสอบ',
            description: 'คำอธิบายโครงการ',
            category: 'การศึกษา',
            targetAmount: 10000,
            currentAmount: 0,
            walletAddress: '0812345678',
            creatorId: creator.id,
            image: '/img/test-image.jpg',
            contactName: 'ทดสอบ ติดต่อ',
            contactPhone: '0987654321',
            contactEmail: 'contact@test.com',
        },
    });

    // เพิ่ม Donation (optional)
    await prisma.donation.create({
        data: {
            id: 'donation-1',
            requestId: donationRequest.id,
            amount: 500,
            name: 'ผู้บริจาค 1',
            email: 'donor1@example.com',
            phone: '0987654321',
            isAnonymous: false,
        },
    });

    console.log('Seed data added successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });