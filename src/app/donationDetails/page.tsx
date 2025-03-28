import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Calendar, Users, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import DonationForm from "@/components/donationForm/donationForm";
import DonationStories from "@/components/donationForm/donation-stories";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import "./donationDetails.css"; // สมมติว่าคุณใช้ CSS เดิมจากที่ผมให้ไป

// กำหนด TypeScript interfaces สำหรับข้อมูล
interface DonationProject {
    title: string;
    subtitle: string;
    category: string;
    logo: string;
    mainImage: string;
    raised: number;
    goal: number;
    donors: number;
    daysLeft: number;
    about: string[];
    budget: { item: string; amount: number }[];
    outcomes: { title: string; description: string; icon: React.ComponentType }[];
    updates: { title: string; date: string; description: string; color?: string }[];
    donorList: { name: string; initial: string; date: string; amount: number; color: string }[];
    contact: {
        coordinator: string;
        email: string;
        phone: string;
    };
}

// ข้อมูลตัวอย่าง (สมมติว่านี่คือข้อมูลที่ดึงมา)
const projectData: DonationProject = {
    title: "โครงการจัดหาอุปกรณ์คอมพิวเตอร์เพื่อการเรียนรู้",
    subtitle: "โรงเรียนวิทยาศาสตร์ตัวอย่าง จังหวัดกรุงเทพมหานคร",
    category: "โครงการพัฒนาการศึกษา",
    logo: "/img/logo.jpg",
    mainImage: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
    raised: 350000,
    goal: 500000,
    donors: 125,
    daysLeft: 30,
    about: [
        "โครงการจัดหาอุปกรณ์คอมพิวเตอร์เพื่อการเรียนรู้ มีวัตถุประสงค์เพื่อจัดหาคอมพิวเตอร์และอุปกรณ์การเรียนรู้ด้านเทคโนโลยีให้กับนักเรียนในโรงเรียนวิทยาศาสตร์ตัวอย่าง เพื่อเพิ่มโอกาสในการเรียนรู้และพัฒนาทักษะด้านเทคโนโลยีที่จำเป็นในศตวรรษที่ 21",
        "ปัจจุบันโรงเรียนมีคอมพิวเตอร์ที่ใช้งานได้เพียง 15 เครื่องสำหรับนักเรียนกว่า 300 คน ทำให้นักเรียนไม่สามารถเข้าถึงการเรียนรู้ด้านเทคโนโลยีได้อย่างทั่วถึง โครงการนี้จะช่วยให้โรงเรียนสามารถจัดหาคอมพิวเตอร์เพิ่มเติมอีก 30 เครื่อง พร้อมอุปกรณ์ประกอบการเรียนรู้ที่จำเป็น",
    ],
    budget: [
        { item: "คอมพิวเตอร์สำหรับการเรียนการสอน 30 เครื่อง", amount: 350000 },
        { item: "อุปกรณ์ต่อพ่วงและซอฟต์แวร์การเรียนรู้", amount: 100000 },
        { item: "การปรับปรุงห้องปฏิบัติการคอมพิวเตอร์", amount: 50000 },
    ],
    outcomes: [
        { title: "เพิ่มโอกาสการเข้าถึง", description: "นักเรียนกว่า 300 คนจะได้เข้าถึงคอมพิวเตอร์เพื่อการเรียนรู้", icon: Users },
        { title: "พัฒนาทักษะดิจิทัล", description: "นักเรียนจะได้พัฒนาทักษะด้านเทคโนโลยีที่จำเป็น", icon: BookOpen },
        { title: "ยกระดับคุณภาพการศึกษา", description: "เพิ่มประสิทธิภาพการเรียนการสอนด้านวิทยาศาสตร์และเทคโนโลยี", icon: Trophy },
    ],
    updates: [
        { title: "เริ่มโครงการระดมทุน", date: "15 มี.ค. 2025", description: "โรงเรียนวิทยาศาสตร์ตัวอย่างได้เริ่มโครงการระดมทุนเพื่อจัดหาอุปกรณ์คอมพิวเตอร์ โดยมีเป้าหมายระดมทุน 500,000 บาท" },
        { title: "ได้รับการสนับสนุนจากบริษัทเทคโนโลยี", date: "28 มี.ค. 2025", description: "บริษัทเทคโนโลยีชั้นนำได้ร่วมบริจาคเงินสนับสนุนโครงการจำนวน 200,000 บาท พร้อมเสนอส่วนลดพิเศษสำหรับการจัดซื้ออุปกรณ์", color: "green" },
    ],
    donorList: [
        { name: "บริษัท เทคโนโลยี จำกัด", initial: "บ", date: "28 มี.ค. 2025", amount: 200000, color: "blue" },
        { name: "สมาคมศิษย์เก่า", initial: "ส", date: "20 มี.ค. 2025", amount: 100000, color: "green" },
        { name: "คุณสมชาย ใจดี", initial: "ค", date: "18 มี.ค. 2025", amount: 50000, color: "purple" },
    ],
    contact: {
        coordinator: "อาจารย์สมศรี รักการศึกษา",
        email: "somsri@school.ac.th",
        phone: "02-123-4567",
    },
};

export default function DonationDetailsPage() {
    const percentage = Math.round((projectData.raised / projectData.goal) * 100);

    return (
        <div>
            <Nav />
            <div className="donation-page">
                <div className="page-container">
                    <Link href="/" className="back-link">
                        <Button
                            type="button"
                            variant="ghost"
                            className="absolute top-4 left-4 p-2 text-gray-700 hover:bg-gray-100 rounded-full">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>
                    </Link>

                    <div className="grid-layout">
                        {/* Left Column - Main Content */}
                        <div className="fade-in">
                            {/* Header */}
                            <div className="header">

                                <div className="logo-container">
                                    <Image src={projectData.logo} alt="โลโก้โรงเรียน" fill />
                                </div>
                                <div className="header-content">
                                    <div className="category">
                                        <BookOpen />
                                        <span>{projectData.category}</span>
                                    </div>
                                    <h1 className="header-title">{projectData.title}</h1>
                                    <p className="header-subtitle">{projectData.subtitle}</p>
                                </div>
                            </div>
                            <DonationStories />
                            {/* Main Image */}
                            <div className="main-image">
                                <Image src={projectData.mainImage} alt="ภาพโครงการ" fill />
                            </div>

                            {/* Progress Bar */}
                            <div className="progress-section">
                                <div className="progress-header">
                                    <div>
                                        <h3 className="progress-amount">฿{projectData.raised.toLocaleString()}</h3>
                                        <p className="progress-goal">จากเป้าหมาย ฿{projectData.goal.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="progress-percentage">{percentage}%</p>
                                        <p className="progress-goal">ความคืบหน้า</p>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <div className="progress-info">
                                    <div>
                                        <Users />
                                        <span>ผู้บริจาคแล้ว {projectData.donors} คน</span>
                                    </div>
                                    <div>
                                        <Calendar />
                                        <span>เหลืออีก {projectData.daysLeft} วัน</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tabs Content */}
                            <Tabs defaultValue="details" className="tabs-container">
                                <TabsList className="tabs-list">
                                    <TabsTrigger value="details" className="tabs-trigger">รายละเอียด</TabsTrigger>
                                    <TabsTrigger value="updates" className="tabs-trigger">ความคืบหน้า</TabsTrigger>
                                    <TabsTrigger value="donors" className="tabs-trigger">ผู้บริจาค</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="tabs-content">
                                    <div>
                                        <h2 className="section-title">เกี่ยวกับโครงการ</h2>
                                        {projectData.about.map((text, index) => (
                                            <p key={index} className="section-text">{text}</p>
                                        ))}
                                    </div>
                                    <div>
                                        <h2 className="section-title">การใช้เงินบริจาค</h2>
                                        <ul className="section-list">
                                            {projectData.budget.map((item, index) => (
                                                <li key={index}>{item.item} (฿{item.amount.toLocaleString()})</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 className="section-title">ผลลัพธ์ที่คาดหวัง</h2>
                                        <div className="cards-grid">
                                            {projectData.outcomes.map((outcome, index) => (
                                                <div key={index} className="card">
                                                    <div className={`card-icon ${index === 0 ? "blue" : index === 1 ? "green" : "purple"}`}>
                                                        <outcome.icon />
                                                    </div>
                                                    <div className="card-content">
                                                        <h3>{outcome.title}</h3>
                                                        <p>{outcome.description}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="updates" className="tabs-content">
                                    <div>
                                        {projectData.updates.map((update, index) => (
                                            <div key={index} className="timeline-item">
                                                <div className="timeline-header">
                                                    <h3 className={update.color}>{update.title}</h3>
                                                    <span>{update.date}</span>
                                                </div>
                                                <p className="section-text">{update.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                                <TabsContent value="donors" className="tabs-content">
                                    <div>
                                        {projectData.donorList.map((donor, index) => (
                                            <div key={index} className={`donor-card ${donor.color}`}>
                                                <div className="donor-info">
                                                    <div className={`donor-avatar ${donor.color}`}>{donor.initial}</div>
                                                    <div className="donor-details">
                                                        <p>{donor.name}</p>
                                                        <p>{donor.date}</p>
                                                    </div>
                                                </div>
                                                <p className={`donor-amount ${donor.color}`}>฿{donor.amount.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Right Column - Donation Form */}
                        <div>
                            <div className="sidebar fade-in" style={{ animationDelay: "0.3s" }}>
                                <DonationForm requestId="exampleRequestId" walletAddress="exampleWalletAddress" />
                                <div className="sidebar-card">
                                    <h3>แชร์โครงการนี้</h3>
                                    <div className="button-group">
                                        <button className="button">
                                            <Share2 />
                                            แชร์
                                        </button>
                                        <button className="button">
                                            <Heart />
                                            ติดตาม
                                        </button>
                                    </div>
                                </div>
                                <div className="sidebar-card">
                                    <h3>ติดต่อผู้ดูแลโครงการ</h3>
                                    <div className="contact-info">
                                        <p>
                                            <span>ชื่อผู้ประสานงาน:</span>
                                            <span>{projectData.contact.coordinator}</span>
                                        </p>
                                        <p>
                                            <span>อีเมล:</span>
                                            <span>{projectData.contact.email}</span>
                                        </p>
                                        <p>
                                            <span>โทรศัพท์:</span>
                                            <span>{projectData.contact.phone}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}