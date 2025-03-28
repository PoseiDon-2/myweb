import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Share2, Heart, Calendar, Users, BookOpen } from "lucide-react";
import Link from "next/link";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import { PrismaClient, Donation } from "@prisma/client"; // Import Donation type
import DonationForm from "@/components/donationForm/donationForm";
import DonationStories from "@/components/donationForm/donation-stories";
import "./page.css";

const prisma = new PrismaClient();

export interface PageProps {
    params: Promise<{ id: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DonationDetailsPage({ params }: PageProps) {
    const { id } = await params;

    const request = await prisma.donationRequest.findUnique({
        where: { id },
        include: {
            donations: true,
            creator: true,
        },
    });

    if (!request) return <div>ไม่พบโครงการ</div>;

    const percentage = Math.round((request.currentAmount / request.targetAmount) * 100);
    const donors = request.donations.length;
    const daysLeft = request.deadline
        ? Math.max(0, Math.ceil((new Date(request.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    return (
        <div>
            <Nav />
            <div className="donation-page">
                <div className="page-container">
                    <Link href="/" className="back-link">
                        <Button variant="ghost" className="absolute top-4 left-4 p-2">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Button>
                    </Link>

                    <div className="grid-layout">
                        <div className="fade-in">
                            <div className="header">
                                <div className="logo-container" style={{ position: "relative", width: "100px", height: "100px" }}>
                                    <Image
                                        src={request.image || "/img/school-logo.jpg"}
                                        alt="โลโก้โรงเรียน"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                                <div className="header-content">
                                    <div className="category">
                                        <BookOpen />
                                        <span>{request.category}</span>
                                    </div>
                                    <h1 className="header-title">{request.projectTitle}</h1>
                                    <p className="header-subtitle">{request.schoolName}</p>
                                </div>
                            </div>

                            <DonationStories />

                            <div className="main-image" style={{ position: "relative", width: "100%", height: "300px" }}>
                                <Image
                                    src={request.image || "/img/school-computer-room.jpg"}
                                    alt="ภาพโรงเรียน"
                                    fill
                                    style={{ objectFit: "cover" }}
                                    sizes="100vw" // เพิ่มเพื่อป้องกัน warning layout shift
                                />
                            </div>

                            <div className="progress-section">
                                <div className="progress-header">
                                    <div>
                                        <h3 className="progress-amount">฿{request.currentAmount.toLocaleString()}</h3>
                                        <p className="progress-goal">จากเป้าหมาย ฿{request.targetAmount.toLocaleString()}</p>
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
                                        <span>ผู้บริจาคแล้ว {donors} คน</span>
                                    </div>
                                    <div>
                                        <Calendar />
                                        <span>เหลืออีก {daysLeft} วัน</span>
                                    </div>
                                </div>
                            </div>

                            <Tabs defaultValue="details" className="tabs-container">
                                <TabsList className="tabs-list">
                                    <TabsTrigger value="details" className="tabs-trigger">รายละเอียด</TabsTrigger>
                                    <TabsTrigger value="progress" className="tabs-trigger">การดำเนินการ</TabsTrigger>
                                    <TabsTrigger value="donors" className="tabs-trigger">ผู้บริจาค</TabsTrigger>
                                </TabsList>
                                <TabsContent value="details" className="tabs-content">
                                    <div>
                                        <h2 className="section-title">เกี่ยวกับโครงการ</h2>
                                        <p className="section-text">{request.description}</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="progress" className="tabs-content">
                                    <div>
                                        <h2 className="section-title">การดำเนินการ</h2>
                                        <p>ยังไม่มีข้อมูลการดำเนินการ</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="donors" className="tabs-content">
                                    <div>
                                        {request.donations.map((donor: Donation, index: number) => (
                                            <div key={index} className="donor-card">
                                                <div className="donor-info">
                                                    <div className="donor-avatar">{donor.name[0]}</div>
                                                    <div className="donor-details">
                                                        <p>{donor.isAnonymous ? "ผู้บริจาคนิรนาม" : donor.name}</p>
                                                        <p>{new Date(donor.createdAt).toLocaleDateString("th-TH")}</p>
                                                    </div>
                                                </div>
                                                <p className="donor-amount">฿{donor.amount.toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div>
                            <div className="sidebar fade-in" style={{ animationDelay: "0.3s" }}>
                                <div className="sidebar-card">
                                    <DonationForm requestId={request.id} walletAddress={request.walletAddress} />
                                </div>
                                <div className="sidebar-card">
                                    <h3>แชร์โครงการนี้</h3>
                                    <div className="button-group">
                                        <Button variant="outline">
                                            <Share2 /> แชร์
                                        </Button>
                                        <Button variant="outline">
                                            <Heart /> ติดตาม
                                        </Button>
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