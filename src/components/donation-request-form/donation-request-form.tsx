"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarIcon, ImagePlus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function DonationRequestForm() {
    const [formData, setFormData] = useState({
        schoolName: "",
        projectTitle: "",
        description: "",
        category: "",
        targetAmount: "",
        deadline: undefined as Date | undefined,
        contactName: "",
        contactPhone: "",
        contactEmail: "",
        image: null as string | null,
    })

    const [previewVisible, setPreviewVisible] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date: Date | undefined) => {
        setFormData((prev) => ({ ...prev, deadline: date }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setFormData((prev) => ({ ...prev, image: reader.result as string }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically send the data to your backend
        alert("คำขอรับบริจาคถูกส่งเรียบร้อยแล้ว!")
    }

    const togglePreview = () => {
        setPreviewVisible(!previewVisible)
    }

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="schoolName">ชื่อโรงเรียน</Label>
                        <Input
                            id="schoolName"
                            name="schoolName"
                            value={formData.schoolName}
                            onChange={handleChange}
                            placeholder="โรงเรียนของคุณ"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectTitle">ชื่อโครงการ</Label>
                        <Input
                            id="projectTitle"
                            name="projectTitle"
                            value={formData.projectTitle}
                            onChange={handleChange}
                            placeholder="ชื่อโครงการขอรับบริจาค"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">หมวดหมู่</Label>
                        <Select onValueChange={(value) => handleSelectChange("category", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกหมวดหมู่" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                <SelectItem value="education">อุปกรณ์การศึกษา</SelectItem>
                                <SelectItem value="sports">อุปกรณ์กีฬา</SelectItem>
                                <SelectItem value="infrastructure">สิ่งก่อสร้าง</SelectItem>
                                <SelectItem value="scholarship">ทุนการศึกษา</SelectItem>
                                <SelectItem value="other">อื่นๆ</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">รายละเอียด</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="อธิบายรายละเอียดของโครงการและความจำเป็นในการขอรับบริจาค"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="targetAmount">จำนวนเงินที่ต้องการ (บาท)</Label>
                        <Input
                            id="targetAmount"
                            name="targetAmount"
                            type="number"
                            value={formData.targetAmount}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>วันที่สิ้นสุดโครงการ</Label>
                        <Popover>
                            <PopoverTrigger asChild className="bg-white">
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !formData.deadline && "text-muted-foreground",
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {formData.deadline ? format(formData.deadline, "PPP", { locale: th }) : <span>เลือกวันที่</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar mode="single" selected={formData.deadline} onSelect={handleDateChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactName">ชื่อผู้ติดต่อ</Label>
                        <Input
                            id="contactName"
                            name="contactName"
                            value={formData.contactName}
                            onChange={handleChange}
                            placeholder="ชื่อ-นามสกุล"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="contactPhone">เบอร์โทรศัพท์</Label>
                            <Input
                                id="contactPhone"
                                name="contactPhone"
                                value={formData.contactPhone}
                                onChange={handleChange}
                                placeholder="0xx-xxx-xxxx"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contactEmail">อีเมล</Label>
                            <Input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={formData.contactEmail}
                                onChange={handleChange}
                                placeholder="example@school.ac.th"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="image">รูปภาพประกอบ</Label>
                        <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                            <input type="file" id="image" className="hidden" accept="image/*" onChange={handleImageChange} />
                            <label htmlFor="image" className="cursor-pointer">
                                <ImagePlus className="mx-auto h-12 w-12 text-muted-foreground" />
                                <p className="mt-2 text-sm text-muted-foreground">คลิกเพื่ออัพโหลดรูปภาพ</p>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={togglePreview} className="bg-white flex-1">
                            {previewVisible ? "ซ่อนตัวอย่าง" : "แสดงตัวอย่าง"}
                        </Button>
                        <Button type="submit" className="flex-1 bg-primary hover:bg-primary-dark">
                            ส่งคำขอรับบริจาค
                        </Button>
                    </div>
                </form>
            </div>

            <div className={cn(!previewVisible && "hidden md:block")}>
                <h2 className="text-xl font-semibold mb-4">ตัวอย่างคำขอรับบริจาค</h2>
                <Card>
                    <CardContent className="p-6">
                        {formData.image && (
                            <div className="mb-4 rounded-md overflow-hidden">
                                <img
                                    src={formData.image || "/placeholder.svg"}
                                    alt="รูปภาพประกอบ"
                                    className="w-full h-70 object-cover"
                                />
                            </div>
                        )}
                        {!formData.image && (
                            <div className="mb-4 rounded-md bg-muted h-48 flex items-center justify-center">
                                <p className="text-muted-foreground">ไม่มีรูปภาพ</p>
                            </div>
                        )}
                        <h3 className="text-xl font-bold">{formData.projectTitle || "ชื่อโครงการ"}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{formData.schoolName || "ชื่อโรงเรียน"}</p>
                        <div className="mb-4">
                            <span className="inline-block bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
                                {formData.category === "education"
                                    ? "อุปกรณ์การศึกษา"
                                    : formData.category === "sports"
                                        ? "อุปกรณ์กีฬา"
                                        : formData.category === "infrastructure"
                                            ? "สิ่งก่อสร้าง"
                                            : formData.category === "scholarship"
                                                ? "ทุนการศึกษา"
                                                : formData.category === "other"
                                                    ? "อื่นๆ"
                                                    : "หมวดหมู่"}
                            </span>
                        </div>
                        <p className="mb-4">{formData.description || "รายละเอียดของโครงการ..."}</p>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm font-medium">เป้าหมาย</p>
                                <p className="text-xl font-bold">
                                    {formData.targetAmount ? `${Number.parseInt(formData.targetAmount).toLocaleString()} บาท` : "0 บาท"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium">วันที่สิ้นสุด</p>
                                <p className="text-sm">
                                    {formData.deadline ? format(formData.deadline, "PPP", { locale: th }) : "ไม่ระบุ"}
                                </p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm font-medium">ติดต่อ</p>
                            <p className="text-sm">{formData.contactName || "ชื่อผู้ติดต่อ"}</p>
                            <div className="flex gap-2 text-sm text-muted-foreground">
                                <p>{formData.contactPhone || "เบอร์โทรศัพท์"}</p>
                                <span>•</span>
                                <p>{formData.contactEmail || "อีเมล"}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

