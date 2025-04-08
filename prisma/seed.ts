const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // ลบข้อมูลเก่าในตารางทั้งหมด
    await prisma.update.deleteMany();
    await prisma.outcome.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.tracking.deleteMany();
    await prisma.donation.deleteMany();
    await prisma.donationRequest.deleteMany();
    await prisma.creator.deleteMany();
    await prisma.user.deleteMany();
    await prisma.story.deleteMany();

    // เพิ่มข้อมูลในตาราง User
    await prisma.user.createMany({
        data: [
            {
                fname: 'สมชาย',
                lname: 'ใจดี',
                email: 'somchai@example.com',
                password: 'hashedpassword123', // ควร hash ในโปรดักชัน
                isVerified: true,
            },
            {
                fname: 'สมหญิง',
                lname: 'รักเรียน',
                email: 'somying@example.com',
                password: 'hashedpassword456', // ควร hash ในโปรดักชัน
                isVerified: true,
            },
        ],
    });

    // เพิ่มข้อมูลในตาราง Creator
    await prisma.creator.createMany({
        data: [
            {
                id: 'creator-1',
                firstName: 'สมชาย',
                lastName: 'ดีมาก',
                email: 'somchai@school1.com',
                phone: '0812345678',
                schoolName: 'โรงเรียนบ้านเขาใหญ่',
                schoolDistrict: 'จังหวัดนครนายก',
                position: 'ครูใหญ่',
                schoolAddress: '123 หมู่ 1 ต.เขาใหญ่ อ.เมือง จ.นครนายก',
                isVerified: true,
                termsAccepted: true,
                privacyAccepted: true,
            },
            {
                id: 'creator-2',
                firstName: 'สมหญิง',
                lastName: 'สอนดี',
                email: 'somying@school2.com',
                phone: '0898765432',
                schoolName: 'โรงเรียนวัดสระแก้ว',
                schoolDistrict: 'จังหวัดนครราชสีมา',
                position: 'ครู',
                schoolAddress: '456 หมู่ 2 ต.สระแก้ว อ.เมือง จ.นครราชสีมา',
                isVerified: true,
                termsAccepted: true,
                privacyAccepted: true,
            },
        ],
    });

    // เพิ่มข้อมูลในตาราง DonationRequest
    await prisma.donationRequest.createMany({
        data: [
            {
                id: 'request-1',
                schoolName: 'โรงเรียนบ้านเขาใหญ่',
                projectTitle: 'อุปกรณ์กีฬา',
                description: 'โรงเรียนต้องการอุปกรณ์กีฬาเพื่อส่งเสริมการออกกำลังกายของนักเรียน',
                category: 'กีฬา',
                targetAmount: 35000,
                currentAmount: 15000,
                deadline: new Date('2025-12-20'),
                image: '/img/sports-equipment.jpg',
                contactName: 'สมชาย ดีมาก',
                contactPhone: '0812345678',
                contactEmail: 'somchai@school1.com',
                walletAddress: '0812345678',
                creatorId: 'creator-1',
            },
            {
                id: 'request-2',
                schoolName: 'โรงเรียนวัดสระแก้ว',
                projectTitle: 'คอมพิวเตอร์เพื่อการเรียน',
                description: 'โรงเรียนต้องการคอมพิวเตอร์สำหรับห้องปฏิบัติการเพื่อพัฒนาทักษะด้านเทคโนโลยี',
                category: 'เทคโนโลยี',
                targetAmount: 85000,
                currentAmount: 40000,
                deadline: new Date('2025-11-30'),
                image: '/img/computer-lab.jpg',
                contactName: 'สมหญิง สอนดี',
                contactPhone: '0898765432',
                contactEmail: 'somying@school2.com',
                walletAddress: '0898765432',
                creatorId: 'creator-2',
            },
        ],
    });

    // เพิ่มข้อมูลในตาราง Budget
    await prisma.budget.createMany({
        data: [
            { id: 'budget-1', donationRequestId: 'request-1', item: 'ลูกฟุตบอล 20 ลูก', amount: 10000 },
            { id: 'budget-2', donationRequestId: 'request-1', item: 'ชุดวอลเลย์บอล', amount: 15000 },
            { id: 'budget-3', donationRequestId: 'request-2', item: 'คอมพิวเตอร์ 10 เครื่อง', amount: 70000 },
            { id: 'budget-4', donationRequestId: 'request-2', item: 'ซอฟต์แวร์การเรียนรู้', amount: 15000 },
        ],
    });

    // เพิ่มข้อมูลในตาราง Outcome
    await prisma.outcome.createMany({
        data: [
            { id: 'outcome-1', donationRequestId: 'request-1', title: 'เพิ่มโอกาสการออกกำลังกาย', description: 'นักเรียนจะได้เล่นกีฬามากขึ้น' },
            { id: 'outcome-2', donationRequestId: 'request-1', title: 'พัฒนาสุขภาพ', description: 'สุขภาพนักเรียนดีขึ้นจากการออกกำลังกาย' },
            { id: 'outcome-3', donationRequestId: 'request-2', title: 'เพิ่มทักษะเทคโนโลยี', description: 'นักเรียนจะได้เรียนรู้ด้าน IT' },
            { id: 'outcome-4', donationRequestId: 'request-2', title: 'ยกระดับการศึกษา', description: 'การเรียนการสอนดีขึ้น' },
        ],
    });

    // เพิ่มข้อมูลในตาราง Update
    await prisma.update.createMany({
        data: [
            { id: 'update-1', donationRequestId: 'request-1', title: 'เริ่มโครงการ', date: new Date('2025-03-15'), description: 'เริ่มระดมทุนสำหรับอุปกรณ์กีฬา' },
            { id: 'update-2', donationRequestId: 'request-2', title: 'ได้รับเงินสนับสนุน', date: new Date('2025-03-28'), description: 'บริษัทเทคโนโลยีบริจาค 20,000 บาท' },
        ],
    });

    // เพิ่มข้อมูลในตาราง Donation
    await prisma.donation.createMany({
        data: [
            {
                id: 'donation-1',
                requestId: 'request-1',
                amount: 5000,
                name: 'นายใจดี',
                email: 'jaidee@example.com',
                phone: '0912345678',
                referenceNumber: 'REF001',
            },
            {
                id: 'donation-2',
                requestId: 'request-2',
                amount: 20000,
                name: 'บริษัท เทคโนโลยี',
                email: 'tech@example.com',
                phone: '0923456789',
                referenceNumber: 'REF002',
            },
        ],
    });

    // เพิ่มข้อมูลในตาราง Tracking
    await prisma.tracking.createMany({
        data: [
            {
                id: 'tracking-1',
                type: 'donation',
                donationId: 'donation-1',
                creatorId: 'creator-1',
                status: 'pending',
                details: 'รอตรวจสอบสลิป',
            },
            {
                id: 'tracking-2',
                type: 'donation',
                donationId: 'donation-2',
                creatorId: 'creator-2',
                status: 'completed',
                details: 'การบริจาคสำเร็จ',
            },
        ],
    });

    // เพิ่มข้อมูลในตาราง Story
    await prisma.story.createMany({
        data: [
            {
                id: 'story-1',
                title: 'นักเรียนได้ลูกบอลใหม่',
                thumbnail: '/img/football-thumb.jpg',
                media: '/img/football.jpg',
                type: 'image',
                caption: 'เด็ก ๆ ตื่นเต้นกับลูกบอลใหม่จากโครงการ',
            },
            {
                id: 'story-2',
                title: 'ห้องคอมพิวเตอร์ใหม่',
                thumbnail: '/img/computer-thumb.jpg',
                media: '/video/computer.mp4',
                type: 'video',
                videoUrl: '/video/computer.mp4',
                caption: 'ห้องคอมพิวเตอร์พร้อมใช้งานแล้ว',
            },
        ],
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