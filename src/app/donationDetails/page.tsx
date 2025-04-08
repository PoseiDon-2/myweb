export const dynamic = 'auto'; // หรือลบออก เพราะ Prisma ทำให้ dynamic อยู่แล้ว

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Calendar, Users, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";
import DonationForm from "@/components/donationForm/donationForm";
import DonationStories from "@/components/donationForm/donation-stories";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { prisma } from "@/lib/prisma";
import "./donationDetails.css";

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
    contact: { coordinator: string; email: string; phone: string };
    requestId: string;
    walletAddress: string;
}

const calculateDaysRemaining = (deadline?: Date | null) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

export default async function DonationDetailsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>; // ปรับให้เป็น Promise
}) {
    const resolvedSearchParams = await searchParams; // Resolve Promise
    const requestId = resolvedSearchParams.id as string | undefined;

    if (!requestId) {
        return (
            <div>
                <Nav />
                <div className="donation-page">
                    <div className="page-container">
                        <p className="text-center py-8">กรุณาเลือกคำขอรับบริจาค</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const donationRequest = await prisma.donationRequest.findUnique({
        where: { id: requestId },
        include: {
            creator: true,
            donations: true,
            budgets: true,
            outcomes: true,
            updates: true,
        },
    });

    if (!donationRequest) {
        return (
            <div>
                <Nav />
                <div className="donation-page">
                    <div className="page-container">
                        <p className="text-center py-8">ไม่พบคำขอรับบริจาคนี้</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const projectData: DonationProject = {
        title: donationRequest.projectTitle,
        subtitle: donationRequest.schoolName,
        category: donationRequest.category,
        logo: "/img/default-logo.jpg",
        mainImage: donationRequest.image || "/img/placeholder.jpg",
        raised: donationRequest.currentAmount,
        goal: donationRequest.targetAmount,
        donors: donationRequest.donations.length,
        daysLeft: calculateDaysRemaining(donationRequest.deadline),
        about: [donationRequest.description],
        budget: donationRequest.budgets.map((budget) => ({
            item: budget.item,
            amount: budget.amount,
        })),
        outcomes: donationRequest.outcomes.map((outcome, index) => ({
            title: outcome.title,
            description: outcome.description,
            icon: index % 3 === 0 ? Users : index % 3 === 1 ? BookOpen : Trophy,
        })),
        updates: donationRequest.updates.map((update, index) => ({
            title: update.title,
            date: update.date.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
            description: update.description,
            color: index % 2 === 0 ? undefined : "green",
        })),
        donorList: donationRequest.donations.map((donation, index) => ({
            name: donation.name,
            initial: donation.name.charAt(0),
            date: donation.createdAt.toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
            amount: donation.amount,
            color: index % 3 === 0 ? "blue" : index % 3 === 1 ? "green" : "purple",
        })),
        contact: {
            coordinator: donationRequest.contactName,
            email: donationRequest.contactEmail,
            phone: donationRequest.contactPhone,
        },
        requestId: donationRequest.id,
        walletAddress: donationRequest.walletAddress,
    };

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
                            className="absolute top-4 left-4 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>
                    </Link>

                    <div className="grid-layout">
                        <div className="fade-in">
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
                            <div className="main-image">
                                <Image src={projectData.mainImage} alt="ภาพโครงการ" fill />
                            </div>
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
                                                <li key={index}>
                                                    {item.item} (฿{item.amount.toLocaleString()})
                                                </li>
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
                        <div>
                            <div className="sidebar fade-in" style={{ animationDelay: "0.3s" }}>
                                <DonationForm requestId={projectData.requestId} walletAddress={projectData.walletAddress} />
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
                                    {projectData.contact ? (
                                        <div className="contact-info">
                                            <p>
                                                <span>ชื่อผู้ประสานงาน:</span>
                                                <span>{projectData.contact.coordinator || "ไม่ระบุ"}</span>
                                            </p>
                                            <p>
                                                <span>อีเมล:</span>
                                                <span>{projectData.contact.email || "ไม่ระบุ"}</span>
                                            </p>
                                            <p>
                                                <span>โทรศัพท์:</span>
                                                <span>{projectData.contact.phone || "ไม่ระบุ"}</span>
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="section-text">ไม่มีข้อมูลผู้ติดต่อ</p>
                                    )}
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