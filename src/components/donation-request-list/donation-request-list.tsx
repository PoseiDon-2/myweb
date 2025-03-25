"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Calendar, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

// Mock data for demonstration
const mockDonationRequests = [
    {
        id: 1,
        schoolName: "โรงเรียนบ้านห้วยเสือ",
        location: "จังหวัดเชียงราย, ภาคเหนือ",
        category: "อุปกรณ์การเรียน",
        description: "โรงเรียนของเราต้องการอุปกรณ์การเรียนสำหรับนักเรียน 120 คน เนื่องจากขาดแคลนงบประมาณในการจัดซื้อ",
        amountNeeded: 45000,
        amountRaised: 12500,
        deadline: "2023-12-15",
        urgency: "เร่งด่วน",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 120,
    },
    {
        id: 2,
        schoolName: "โรงเรียนวัดสระแก้ว",
        location: "จังหวัดนครราชสีมา, ภาคตะวันออกเฉียงเหนือ",
        category: "คอมพิวเตอร์",
        description: "โรงเรียนต้องการคอมพิวเตอร์สำหรับห้องปฏิบัติการคอมพิวเตอร์ เพื่อให้นักเรียนได้เรียนรู้ทักษะด้านเทคโนโลยี",
        amountNeeded: 85000,
        amountRaised: 37500,
        deadline: "2023-11-30",
        urgency: "เร่งด่วนมาก",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 250,
    },
    {
        id: 3,
        schoolName: "โรงเรียนบ้านทุ่งนา",
        location: "จังหวัดสุราษฎร์ธานี, ภาคใต้",
        category: "ทุนการศึกษา",
        description: "โรงเรียนต้องการทุนการศึกษาสำหรับนักเรียนยากจน เพื่อสนับสนุนค่าใช้จ่ายในการศึกษาและป้องกันการออกกลางคัน",
        amountNeeded: 60000,
        amountRaised: 42000,
        deadline: "2023-12-31",
        urgency: "ปานกลาง",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 180,
    },
    {
        id: 4,
        schoolName: "โรงเรียนวัดโพธิ์ทอง",
        location: "จังหวัดพระนครศรีอยุธยา, ภาคกลาง",
        category: "อาคารเรียน",
        description: "โรงเรียนต้องการซ่อมแซมอาคารเรียนที่ได้รับความเสียหายจากน้ำท่วม เพื่อให้นักเรียนมีสถานที่เรียนที่ปลอดภัย",
        amountNeeded: 95000,
        amountRaised: 15000,
        deadline: "2023-11-15",
        urgency: "เร่งด่วนมาก",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 210,
    },
    {
        id: 5,
        schoolName: "โรงเรียนบ้านเขาใหญ่",
        location: "จังหวัดนครนายก, ภาคตะวันออก",
        category: "อุปกรณ์กีฬา",
        description: "โรงเรียนต้องการอุปกรณ์กีฬาสำหรับนักเรียน เพื่อส่งเสริมการออกกำลังกายและพัฒนาทักษะด้านกีฬา",
        amountNeeded: 35000,
        amountRaised: 22000,
        deadline: "2023-12-20",
        urgency: "ปานกลาง",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 150,
    },
    {
        id: 6,
        schoolName: "โรงเรียนบ้านลำห้วยหิน",
        location: "จังหวัดกาญจนบุรี, ภาคตะวันตก",
        category: "เครื่องแบบนักเรียน",
        description: "โรงเรียนต้องการเครื่องแบบนักเรียนสำหรับนักเรียนยากจน เพื่อให้นักเรียนมีเครื่องแบบที่เหมาะสมในการมาเรียน",
        amountNeeded: 40000,
        amountRaised: 28000,
        deadline: "2023-12-10",
        urgency: "เร่งด่วน",
        imageUrl: "/img/mario-heller-hXLkFpvKRys-unsplash-1024x683.jpg",
        studentCount: 130,
    },
]

export function DonationRequestList() {
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 6
    const totalPages = Math.ceil(mockDonationRequests.length / itemsPerPage)

    // Calculate days remaining
    const calculateDaysRemaining = (deadline: string) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    // Get urgency color
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case "เร่งด่วนมาก":
                return "bg-red-500"
            case "เร่งด่วน":
                return "bg-orange-500"
            case "ปานกลาง":
                return "bg-yellow-500"
            default:
                return "bg-green-500"
        }
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockDonationRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden flex flex-col">
                        <div className="relative h-48">
                            <Image
                                src={request.imageUrl || "/placeholder.svg"}
                                alt={request.schoolName}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute top-2 right-2">
                                <Badge variant="secondary" className="flex items-center gap-1 bg-white p-2">
                                    <span className={`w-2 h-2 rounded-full ${getUrgencyColor(request.urgency)}`}></span>
                                    {request.urgency}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{request.schoolName}</CardTitle>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {request.location}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <div className="space-y-4">
                                <Badge className="bg-orange-400 text-white p-2">{request.category}</Badge>

                                <p className="text-sm line-clamp-3">{request.description}</p>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>ยอดบริจาค</span>
                                        <span className="font-medium">
                                            {request.amountRaised.toLocaleString()} / {request.amountNeeded.toLocaleString()} บาท
                                        </span>
                                    </div>
                                    <Progress value={(request.amountRaised / request.amountNeeded) * 100} />
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">เหลือ {calculateDaysRemaining(request.deadline)} วัน</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-muted-foreground">นักเรียน {request.studentCount} คน</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter>
                            <Link href="/donationDetails">
                                <Button className="w-full bg-blue-500  text-white">
                                    ดูรายละเอียด <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                                e.preventDefault()
                                if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }).map((_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                href="#"
                                isActive={currentPage === index + 1}
                                onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentPage(index + 1)
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
                                e.preventDefault()
                                if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                            }}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}

