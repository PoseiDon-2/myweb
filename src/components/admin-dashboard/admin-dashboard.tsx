"use client"

import { useState } from "react"
import {
    BarChart3,
    Users,
    Heart,
    Calendar,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronDown,
    Search,
    Bell,
    CheckSquare,
    FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// นำเข้า CSS
import "@/components/css/admin.css"

// อินเทอร์เฟซสำหรับข้อมูลแดชบอร์ด
interface DashboardStats {
    totalDonations: string
    activeCampaigns: number
    totalDonors: number
    avgDonation: string
}

// อินเทอร์เฟซสำหรับการบริจาคล่าสุด
interface RecentDonation {
    donor: string
    campaign: string
    amount: string
    date: string
    status: string
}

// อินเทอร์เฟซสำหรับแคมเปญยอดนิยม
interface TopCampaign {
    name: string
    raised: number
    goal: number
    percent: number
    donors: number
}

// อินเทอร์เฟซสำหรับผู้บริจาคยอดนิยม
interface TopDonor {
    name: string
    total: string
    campaigns: number
    last: string
}

// อินเทอร์เฟซสำหรับผู้สมัครรอการตรวจสอบ
interface Applicant {
    name: string
    school: string
    date: string
    status: "รอการตรวจสอบ" | "อนุมัติแล้ว" | "ปฏิเสธแล้ว"
}

// อินเทอร์เฟซสำหรับ props ของคอมโพเนนต์
interface AdminDashboardProps {
    // สามารถเพิ่ม props ได้ตามต้องการ
}

export default function AdminDashboard(props: AdminDashboardProps = {}) {
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)

    // ข้อมูลตัวอย่างสำหรับแดชบอร์ด
    const stats: DashboardStats = {
        totalDonations: "฿1,248,590",
        activeCampaigns: 24,
        totalDonors: 3782,
        avgDonation: "฿650",
    }

    // ข้อมูลตัวอย่างสำหรับการบริจาคล่าสุด
    const recentDonations: RecentDonation[] = [
        { donor: "สมชาย ใจดี", campaign: "ช่วยเหลือผู้ประสบภัยน้ำท่วม", amount: "฿2,000", date: "2 ชั่วโมงที่แล้ว", status: "สำเร็จ" },
        { donor: "วิภา รักษ์สัตว์", campaign: "ช่วยเหลือสุนัขจรจัด", amount: "฿500", date: "3 ชั่วโมงที่แล้ว", status: "สำเร็จ" },
        { donor: "ธนา มีน้ำใจ", campaign: "ทุนการศึกษาเด็กด้อยโอกาส", amount: "฿1,500", date: "5 ชั่วโมงที่แล้ว", status: "สำเร็จ" },
        { donor: "นภา ใจบุญ", campaign: "สร้างห้องสมุดโรงเรียน", amount: "฿3,000", date: "8 ชั่วโมงที่แล้ว", status: "สำเร็จ" },
        { donor: "สมศักดิ์ รักชาติ", campaign: "ช่วยเหลือผู้ประสบภัยน้ำท่วม", amount: "฿1,000", date: "10 ชั่วโมงที่แล้ว", status: "สำเร็จ" },
    ]

    // ข้อมูลตัวอย่างสำหรับแคมเปญยอดนิยม
    const topCampaigns: TopCampaign[] = [
        { name: "ช่วยเหลือผู้ประสบภัยน้ำท่วม", raised: 850000, goal: 1000000, percent: 85, donors: 1245 },
        { name: "ทุนการศึกษาเด็กด้อยโอกาส", raised: 420000, goal: 500000, percent: 84, donors: 876 },
        { name: "สร้างห้องสมุดโรงเรียน", raised: 320000, goal: 400000, percent: 80, donors: 542 },
        { name: "ช่วยเหลือสุนัขจรจัด", raised: 180000, goal: 300000, percent: 60, donors: 423 },
        { name: "สนับสนุนอุปกรณ์การแพทย์", raised: 750000, goal: 1500000, percent: 50, donors: 689 },
    ]

    // ข้อมูลตัวอย่างสำหรับผู้บริจาคยอดนิยม
    const topDonors: TopDonor[] = [
        { name: "บริษัท ไทยรุ่งเรือง จำกัด", total: "฿150,000", campaigns: 4, last: "2 วันที่แล้ว" },
        { name: "คุณสมศักดิ์ มีเงิน", total: "฿75,000", campaigns: 6, last: "1 สัปดาห์ที่แล้ว" },
        { name: "มูลนิธิเพื่อสังคมไทย", total: "฿50,000", campaigns: 3, last: "3 วันที่แล้ว" },
        { name: "คุณวิชัย ใจบุญ", total: "฿35,000", campaigns: 8, last: "5 วันที่แล้ว" },
        { name: "บริษัท สยามพัฒนา จำกัด", total: "฿25,000", campaigns: 2, last: "1 วันที่แล้ว" },
    ]

    // ข้อมูลตัวอย่างสำหรับผู้สมัครรอการตรวจสอบ
    const applicants: Applicant[] = [
        { name: "อาจารย์สมศรี มีศักดิ์", school: "โรงเรียนบ้านหนองไผ่", date: "15 มี.ค. 2568", status: "รอการตรวจสอบ" },
        { name: "อาจารย์วิชัย ใจดี", school: "โรงเรียนวัดสว่างอารมณ์", date: "14 มี.ค. 2568", status: "รอการตรวจสอบ" },
        { name: "อาจารย์นภา รักษ์ศิษย์", school: "โรงเรียนเทศบาล 1", date: "12 มี.ค. 2568", status: "รอการตรวจสอบ" },
        { name: "อาจารย์ประเสริฐ มานะ", school: "โรงเรียนบ้านโคกสูง", date: "10 มี.ค. 2568", status: "รอการตรวจสอบ" },
        { name: "อาจารย์สุนันทา พัฒนา", school: "โรงเรียนอนุบาลเมืองใหม่", date: "8 มี.ค. 2568", status: "รอการตรวจสอบ" },
    ]

    return (
        <div className="flex min-h-screen bg-background">
            {/* ฉากหลังของแถบด้านข้างสำหรับมือถือ */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* แถบด้านข้าง */}
            <aside
                className={`
          fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:z-0
        `}
            >
                <div className="flex h-16 items-center border-b px-4">
                    <h2 className="text-lg font-semibold text-primary">Donation Platform</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-3 top-3 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X className="h-5 w-5" />
                        <span className="sr-only">ปิดแถบด้านข้าง</span>
                    </Button>
                </div>
                <nav className="space-y-1 p-2">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <BarChart3 className="h-5 w-5" />
                        Dashboard
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <Heart className="h-5 w-5" />
                        Donations
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <Users className="h-5 w-5" />
                        Users
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <CheckSquare className="h-5 w-5" />
                        การตรวจสอบ
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <Calendar className="h-5 w-5" />
                        Campaigns
                    </Button>
                    <Button variant="ghost" className="w-full justify-start gap-3 text-foreground hover:text-primary">
                        <Settings className="h-5 w-5" />
                        Settings
                    </Button>
                </nav>
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <div className="flex items-center gap-3 rounded-lg border p-3 bg-white">
                        <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                            <AvatarFallback>AD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium leading-none truncate">Admin User</p>
                            <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="dropdown-menu">
                                <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>โปรไฟล์</DropdownMenuItem>
                                <DropdownMenuItem>การตั้งค่า</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>ออกจากระบบ</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </aside>

            {/* เนื้อหาหลัก */}
            <div className="flex-1 overflow-auto">
                {/* ส่วนหัว */}
                <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">สลับเมนู</span>
                    </Button>
                    <div className="flex-1 flex items-center gap-4 md:ml-auto">
                        <form className="flex-1 md:max-w-xs">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="ค้นหา..."
                                    className="w-full bg-background pl-8 md:w-[200px] lg:w-[300px] rounded-lg border-gray-200 focus:border-primary"
                                />
                            </div>
                        </form>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">การแจ้งเตือน</span>
                            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                        </Button>
                    </div>
                </header>

                {/* เนื้อหาแดชบอร์ด */}
                <main className="grid gap-6 p-4 md:gap-8 md:p-6">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold tracking-tight text-primary">Dashboard</h1>
                    </div>

                    {/* การ์ดสถิติ */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="card-stats">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">ยอดบริจาคทั้งหมด</CardTitle>
                                <Heart className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{stats.totalDonations}</div>
                                <p className="text-xs text-muted-foreground">+18.2% จากเดือนที่แล้ว</p>
                            </CardContent>
                        </Card>
                        <Card className="card-stats">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">แคมเปญที่ดำเนินการอยู่</CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{stats.activeCampaigns}</div>
                                <p className="text-xs text-muted-foreground">+2 ใหม่ในสัปดาห์นี้</p>
                            </CardContent>
                        </Card>
                        <Card className="card-stats">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">จำนวนผู้บริจาคทั้งหมด</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{stats.totalDonors.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">+7.4% จากเดือนที่แล้ว</p>
                            </CardContent>
                        </Card>
                        <Card className="card-stats">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">ยอดบริจาคเฉลี่ย</CardTitle>
                                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-primary">{stats.avgDonation}</div>
                                <p className="text-xs text-muted-foreground">+4.1% จากเดือนที่แล้ว</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* แท็บสำหรับมุมมองต่างๆ */}
                    <Tabs defaultValue="recent" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-gray-100 rounded-lg p-1">
                            <TabsTrigger value="recent" className="rounded-md">การบริจาคล่าสุด</TabsTrigger>
                            <TabsTrigger value="campaigns" className="rounded-md">แคมเปญยอดนิยม</TabsTrigger>
                            <TabsTrigger value="donors" className="rounded-md">ผู้บริจาคยอดนิยม</TabsTrigger>
                            <TabsTrigger value="verification" className="rounded-md">การตรวจสอบผู้สมัคร</TabsTrigger>
                        </TabsList>

                        {/* แท็บการบริจาคล่าสุด */}
                        <TabsContent value="recent" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">การบริจาคล่าสุด</CardTitle>
                                    <CardDescription>คุณได้รับ 48 การบริจาคใน 24 ชั่วโมงที่ผ่านมา</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ผู้บริจาค</TableHead>
                                                <TableHead>แคมเปญ</TableHead>
                                                <TableHead>จำนวนเงิน</TableHead>
                                                <TableHead>วันที่</TableHead>
                                                <TableHead>สถานะ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {recentDonations.map((donation, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>{donation.donor}</TableCell>
                                                    <TableCell>{donation.campaign}</TableCell>
                                                    <TableCell>{donation.amount}</TableCell>
                                                    <TableCell>{donation.date}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                            {donation.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* แท็บแคมเปญยอดนิยม */}
                        <TabsContent value="campaigns" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">แคมเปญยอดนิยม</CardTitle>
                                    <CardDescription>แคมเปญระดมทุนที่ประสบความสำเร็จมากที่สุดของคุณ</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {topCampaigns.map((campaign, index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{campaign.name}</p>
                                                        <p className="text-sm text-muted-foreground">{campaign.donors} ผู้บริจาค</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium">฿{campaign.raised.toLocaleString()}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            จากเป้าหมาย ฿{campaign.goal.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Progress value={campaign.percent} className="h-2 progress-bar" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* แท็บผู้บริจาคยอดนิยม */}
                        <TabsContent value="donors" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">ผู้บริจาคยอดนิยม</CardTitle>
                                    <CardDescription>ผู้สนับสนุนที่ใจกว้างที่สุดของคุณในเดือนนี้</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ผู้บริจาค</TableHead>
                                                <TableHead>ยอดบริจาครวม</TableHead>
                                                <TableHead>จำนวนแคมเปญ</TableHead>
                                                <TableHead>การบริจาคล่าสุด</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {topDonors.map((donor, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{donor.name}</TableCell>
                                                    <TableCell>{donor.total}</TableCell>
                                                    <TableCell>{donor.campaigns}</TableCell>
                                                    <TableCell>{donor.last}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* แท็บการตรวจสอบ */}
                        <TabsContent value="verification" className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">การตรวจสอบผู้สมัครเป็นผู้สร้างคำขอ</CardTitle>
                                    <CardDescription>ตรวจสอบเอกสารและอนุมัติครูที่ต้องการสร้างคำขอบริจาค</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>ชื่อผู้สมัคร</TableHead>
                                                <TableHead>โรงเรียน</TableHead>
                                                <TableHead>วันที่สมัคร</TableHead>
                                                <TableHead>เอกสาร</TableHead>
                                                <TableHead>สถานะ</TableHead>
                                                <TableHead>การดำเนินการ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {applicants.map((applicant, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{applicant.name}</TableCell>
                                                    <TableCell>{applicant.school}</TableCell>
                                                    <TableCell>{applicant.date}</TableCell>
                                                    <TableCell>
                                                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                                                            <FileText className="h-4 w-4" />
                                                            ดูเอกสาร
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={
                                                                applicant.status === "รอการตรวจสอบ"
                                                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                                                    : applicant.status === "อนุมัติแล้ว"
                                                                        ? "bg-green-50 text-green-700 border-green-200"
                                                                        : "bg-red-50 text-red-700 border-red-200"
                                                            }
                                                        >
                                                            {applicant.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:text-green-800"
                                                            >
                                                                อนุมัติ
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                className="h-8 bg-red-50 text-red-700 border-red-200 hover:bg-red-100 hover:text-red-800"
                                                            >
                                                                ปฏิเสธ
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    )
}