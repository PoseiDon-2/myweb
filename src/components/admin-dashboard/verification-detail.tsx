"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle, XCircle, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"

// อินเทอร์เฟซสำหรับข้อมูลผู้สมัคร
interface ApplicantData {
    name: string // ชื่อ
    position: string // ตำแหน่ง
    school: string // โรงเรียน
    email: string // อีเมล
    phone: string // เบอร์โทรศัพท์
    applicationDate: string // วันที่สมัคร
    avatarUrl: string // URL รูปภาพประจำตัว
}

// อินเทอร์เฟซสำหรับเอกสาร
interface Document {
    type: "id" | "certificate" | "school" // ประเภทเอกสาร
    url: string // URL เอกสาร
    uploadDate: string // วันที่อัปโหลด
}

// อินเทอร์เฟซสำหรับ props ของคอมโพเนนต์ (ถ้าต้องการส่งข้อมูลจากภายนอก)
interface VerificationDetailProps {
    // สามารถเพิ่ม props ที่ต้องการได้
}

export default function VerificationDetail(props: VerificationDetailProps = {}) {
    const [status, setStatus] = useState<"pending" | "approved" | "rejected">("pending") // สถานะการสมัคร
    const [feedback, setFeedback] = useState<string>("") // ข้อเสนอแนะ

    // ข้อมูลผู้สมัครตัวอย่าง
    const applicant: ApplicantData = {
        name: "อาจารย์สมศรี มีศักดิ์",
        position: "ครูประจำชั้น ป.4",
        school: "โรงเรียนบ้านหนองไผ่",
        email: "somsri.m@nongphai.ac.th",
        phone: "089-123-4567",
        applicationDate: "15 มีนาคม 2568",
        avatarUrl: "/placeholder.svg?height=96&width=96",
    }

    // ข้อมูลเอกสารตัวอย่าง
    const documents: Document[] = [
        {
            type: "id",
            url: "/placeholder.svg?height=300&width=500",
            uploadDate: "15 มีนาคม 2568",
        },
        {
            type: "certificate",
            url: "/placeholder.svg?height=300&width=500",
            uploadDate: "15 มีนาคม 2568",
        },
        {
            type: "school",
            url: "/placeholder.svg?height=300&width=500",
            uploadDate: "15 มีนาคม 2568",
        },
    ]

    // ฟังก์ชันอนุมัติการสมัคร
    const handleApprove = (): void => {
        setStatus("approved")
    }

    // ฟังก์ชันปฏิเสธการสมัคร
    const handleReject = (): void => {
        setStatus("rejected")
    }

    // แปลงสถานะเป็นข้อความภาษาไทย
    const getStatusText = (status: "pending" | "approved" | "rejected"): string => {
        switch (status) {
            case "pending":
                return "รอการตรวจสอบ"
            case "approved":
                return "อนุมัติแล้ว"
            case "rejected":
                return "ปฏิเสธแล้ว"
        }
    }

    // แปลงประเภทเอกสารเป็นชื่อภาษาไทย
    const getDocumentTitle = (type: Document["type"]): string => {
        switch (type) {
            case "id":
                return "บัตรประชาชน"
            case "certificate":
                return "ใบรับรองครู"
            case "school":
                return "เอกสารโรงเรียน"
        }
    }

    return (
        <div className="container mx-auto py-6 max-w-5xl">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-bold">ตรวจสอบผู้สมัคร</h1>
                <Badge
                    variant="outline"
                    className={`ml-2 ${status === "pending"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : status === "approved"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                        }`}
                >
                    {getStatusText(status)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* คอลัมน์ซ้าย - ข้อมูลผู้สมัคร */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>ข้อมูลผู้สมัคร</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex flex-col items-center space-y-3">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={applicant.avatarUrl} alt={applicant.name} />
                                <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="text-center">
                                <h3 className="font-medium text-lg">{applicant.name}</h3>
                                <p className="text-muted-foreground">{applicant.position}</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-3">
                            <div>
                                <Label className="text-xs text-muted-foreground">โรงเรียน</Label>
                                <p className="font-medium">{applicant.school}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">อีเมล</Label>
                                <p className="font-medium">{applicant.email}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">เบอร์โทรศัพท์</Label>
                                <p className="font-medium">{applicant.phone}</p>
                            </div>
                            <div>
                                <Label className="text-xs text-muted-foreground">วันที่สมัคร</Label>
                                <p className="font-medium">{applicant.applicationDate}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* คอลัมน์ขวา - เอกสารและการตรวจสอบ */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>เอกสารประกอบการสมัคร</CardTitle>
                        <CardDescription>ตรวจสอบเอกสารทั้งหมดเพื่อยืนยันตัวตนของผู้สมัคร</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="id" className="space-y-4">
                            <TabsList className="grid grid-cols-3">
                                <TabsTrigger value="id">บัตรประชาชน</TabsTrigger>
                                <TabsTrigger value="certificate">ใบรับรองครู</TabsTrigger>
                                <TabsTrigger value="school">เอกสารโรงเรียน</TabsTrigger>
                            </TabsList>

                            {documents.map((doc) => (
                                <TabsContent key={doc.type} value={doc.type} className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <img src={doc.url} alt={getDocumentTitle(doc.type)} className="w-full object-cover" />
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="text-sm text-muted-foreground">อัพโหลดเมื่อ: {doc.uploadDate}</p>
                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                            <Download className="h-4 w-4" />
                                            ดาวน์โหลด
                                        </Button>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <div className="w-full">
                            <Label htmlFor="feedback">ข้อเสนอแนะหรือเหตุผล (ถ้ามี)</Label>
                            <Textarea
                                id="feedback"
                                placeholder="กรอกข้อเสนอแนะหรือเหตุผลในการอนุมัติหรือปฏิเสธ..."
                                className="mt-1"
                                value={feedback}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFeedback(e.target.value)}
                            />
                        </div>

                        {status === "pending" ? (
                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="outline"
                                    className="flex-1 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                                    onClick={handleReject}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    ปฏิเสธการสมัคร
                                </Button>
                                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    อนุมัติการสมัคร
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full">
                                <Button variant="outline" className="w-full" onClick={() => setStatus("pending")}>
                                    แก้ไขสถานะ
                                </Button>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}