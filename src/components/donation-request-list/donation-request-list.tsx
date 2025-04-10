"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

type DonationRequest = {
    id: string;
    schoolName: string;
    description: string;
    category: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: string | null;
    image?: string | null;
    creator: { schoolDistrict: string };
};

const calculateDaysRemaining = (deadline?: string | null) => {
    if (!deadline) return 0;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
};

const getUrgencyColor = (daysRemaining: number) => {
    if (daysRemaining <= 7) return "bg-red-500";
    if (daysRemaining <= 14) return "bg-orange-500";
    return "bg-yellow-500";
};

const getUrgencyText = (daysRemaining: number) => {
    if (daysRemaining <= 7) return "เร่งด่วนมาก";
    if (daysRemaining <= 14) return "เร่งด่วน";
    return "ปานกลาง";
};

export function DonationRequestList() {
    const [donationRequests, setDonationRequests] = useState<DonationRequest[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDonationRequests = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/donation-requests?page=${currentPage}`);
                if (!response.ok) throw new Error("Failed to fetch donation requests");
                const data = await response.json();
                setDonationRequests(data.donationRequests || []);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("Error fetching donation requests:", err);
                setError("เกิดข้อผิดพลาดในการโหลดคำขอรับบริจาค");
            } finally {
                setLoading(false);
            }
        };

        fetchDonationRequests();
    }, [currentPage]);

    if (loading) {
        return <div className="text-center py-12 text-gray-600 text-lg animate-pulse">กำลังโหลดข้อมูลคำขอรับบริจาค...</div>;
    }

    if (error) {
        return <div className="text-center py-8 text-red-500 font-medium">{error}</div>;
    }

    if (donationRequests.length === 0) {
        return <div className="text-center py-8 text-gray-500">ยังไม่มีคำขอรับบริจาคในขณะนี้</div>;
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {donationRequests.map((request) => {
                    const daysRemaining = calculateDaysRemaining(request.deadline);
                    const imageSrc = request.image?.trim() ? request.image : "/placeholder.svg";

                    return (
                        <Card key={request.id} className="overflow-hidden flex flex-col">
                            <div className="relative h-48">
                                <Image
                                    src={imageSrc}
                                    alt={request.schoolName}
                                    fill
                                    className="object-cover"
                                    onError={(e) => {
                                        const target = e.currentTarget as HTMLImageElement;
                                        target.src = "/placeholder.svg";
                                    }}
                                />
                                <div className="absolute top-2 right-2">
                                    <Badge variant="secondary" className="flex items-center gap-1 bg-white p-2">
                                        <span className={`w-2 h-2 rounded-full ${getUrgencyColor(daysRemaining)}`}></span>
                                        {getUrgencyText(daysRemaining)}
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className="text-xl">{request.schoolName}</CardTitle>
                                <CardDescription className="flex items-center gap-1 text-sm text-gray-600">
                                    <MapPin className="h-3 w-3" /> {request.creator?.schoolDistrict || "ไม่ระบุ"}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="space-y-4">
                                    <Badge className="bg-orange-400 text-white p-2">{request.category}</Badge>
                                    <p className="text-sm text-gray-700 line-clamp-3">{request.description}</p>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>ยอดบริจาค</span>
                                            <span className="font-medium text-gray-800">
                                                {request.currentAmount.toLocaleString()} / {request.targetAmount.toLocaleString()} บาท
                                            </span>
                                        </div>
                                        <Progress value={(request.currentAmount / request.targetAmount) * 100} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>เหลือ {daysRemaining} วัน</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-3 w-3" />
                                            <span>นักเรียน ไม่ระบุ</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Link href={`/donationDetails?id=${request.id}`}>
                                    <Button className="w-full bg-blue-500 text-white hover:bg-blue-600">
                                        ดูรายละเอียด <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={`page-${index + 1}`}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === index + 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentPage(index + 1);
                                }}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}

export default DonationRequestList;
