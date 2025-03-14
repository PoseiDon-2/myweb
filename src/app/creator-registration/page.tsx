"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import "./page.css"

export default function CreatorRegistrationPage() {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [licenseFile, setLicenseFile] = useState<File | null>(null)
    const [positionFile, setPositionFile] = useState<File | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setIsLoading(true)

        // Simulate form submission
        setTimeout(() => {
            setIsLoading(false)
            router.push("/registration-success")
        }, 1500)
    }

    return (

        <div className="flex items-center justify-center min-h-screen p-4 py-10">
            <Button
                type="button"
                variant="ghost"
                className="absolute top-4 left-4 p-2 text-gray-700 hover:bg-gray-100 rounded-full"
                onClick={() => window.location.href = '/'}
            >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </Button>
            <Card className="w-full max-w-2xl shadow-lg p-0">

                <CardHeader className="space-y-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-6">
                    <CardTitle className="text-2xl font-bold text-center">ลงทะเบียนสำหรับผู้จัดทำคำขอรับบริจาค</CardTitle>
                    <CardDescription className="text-center text-blue-100">
                        สมัครเป็นผู้จัดทำคำขอรับบริจาคเพื่อโรงเรียนของคุณ
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-8 p-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">ข้อมูลส่วนตัว</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName" className="text-gray-700">ชื่อ</Label>
                                    <Input id="firstName" placeholder="จอห์น" required className="border-gray-300 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName" className="text-gray-700">นามสกุล</Label>
                                    <Input id="lastName" placeholder="โด" required className="border-gray-300 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">อีเมล</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required className="border-gray-300 focus:ring-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-gray-700">หมายเลขโทรศัพท์</Label>
                                <Input id="phone" type="tel" placeholder="(123) 456-7890" required className="border-gray-300 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">ข้อมูลโรงเรียน</h3>
                            <div className="space-y-2">
                                <Label htmlFor="schoolName" className="text-gray-700">ชื่อโรงเรียน</Label>
                                <Input id="schoolName" placeholder="โรงเรียน ABC" required className="border-gray-300 focus:ring-blue-500" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="schoolDistrict" className="text-gray-700">เขตการศึกษา</Label>
                                    <Input id="schoolDistrict" placeholder="ชื่อเขตการศึกษา" required className="border-gray-300 focus:ring-blue-500" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="position" className="text-gray-700">ตำแหน่ง</Label>
                                    <Select required>
                                        <SelectTrigger id="position" className="border-gray-300 focus:ring-blue-500">
                                            <SelectValue placeholder="เลือกตำแหน่ง" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="teacher">ครู</SelectItem>
                                            <SelectItem value="principal">ผู้อำนวยการ</SelectItem>
                                            <SelectItem value="administrator">ผู้บริหาร</SelectItem>
                                            <SelectItem value="other">อื่นๆ</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="schoolAddress" className="text-gray-700">ที่อยู่โรงเรียน</Label>
                                <Textarea id="schoolAddress" placeholder="ที่อยู่โรงเรียนแบบเต็ม" required className="border-gray-300 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">การอัปโหลดเอกสาร</h3>
                            <div className="space-y-2">
                                <Label htmlFor="license" className="text-gray-700">ใบอนุญาตวิชาชีพ</Label>
                                <div className="flex items-center gap-4">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="license" className="sr-only">ใบอนุญาตวิชาชีพ</Label>
                                        <div className="flex items-center justify-center border rounded-md p-4 h-32 bg-gray-50 hover:bg-gray-100 transition">
                                            {licenseFile ? (
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-800">{licenseFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(licenseFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">อัปโหลดใบอนุญาตวิชาชีพของคุณ</p>
                                                </div>
                                            )}
                                            <Input
                                                id="license"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setLicenseFile(e.target.files[0]);
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button type="button" variant="outline" onClick={() => document.getElementById("license")?.click()}>
                                        {licenseFile ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">อัปโหลดไฟล์ PDF, JPG หรือ PNG (สูงสุด 5MB)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="position-document" className="text-gray-700">เอกสารยืนยันตำแหน่ง</Label>
                                <div className="flex items-center gap-4">
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="position-document" className="sr-only">เอกสารยืนยันตำแหน่ง</Label>
                                        <div className="flex items-center justify-center border rounded-md p-4 h-32 bg-gray-50 hover:bg-gray-100 transition">
                                            {positionFile ? (
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-800">{positionFile.name}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {(positionFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-500">อัปโหลดเอกสารยืนยันตำแหน่งของคุณ</p>
                                                </div>
                                            )}
                                            <Input
                                                id="position-document"
                                                type="file"
                                                className="hidden"
                                                accept=".pdf,.jpg,.jpeg,.png"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        setPositionFile(e.target.files[0]);
                                                    }
                                                }}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => document.getElementById("position-document")?.click()}
                                    >
                                        {positionFile ? "เปลี่ยนไฟล์" : "เลือกไฟล์"}
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-500">อัปโหลดไฟล์ PDF, JPG หรือ PNG (สูงสุด 5MB)</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">ข้อตกลงและเงื่อนไข</h3>
                            <div className="space-y-2">
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="terms" required className="mt-1" />
                                    <Label htmlFor="terms" className="text-sm text-gray-700">
                                        ข้าพเจ้ายืนยันว่าข้อมูลทั้งหมดที่ให้ไว้นั้นถูกต้องและข้าพเจ้ามีอำนาจในการสร้างคำขอรับบริจาคในนามของโรงเรียน
                                        ข้าพเจ้าเข้าใจว่าบัญชีของข้าพเจ้าจะได้รับการตรวจสอบก่อนได้รับการอนุมัติ
                                    </Label>
                                </div>
                                <div className="flex items-start space-x-2">
                                    <Checkbox id="privacy" required className="mt-1" />
                                    <Label htmlFor="privacy" className="text-sm text-gray-700">
                                        ข้าพเจ้ายอมรับ{" "}
                                        <Button variant="link" className="p-0 h-auto text-blue-600" onClick={(e) => e.preventDefault()}>
                                            ข้อกำหนดการให้บริการ
                                        </Button>{" "}
                                        และ{" "}
                                        <Button variant="link" className="p-0 h-auto text-blue-600" onClick={(e) => e.preventDefault()}>
                                            นโยบายความเป็นส่วนตัว
                                        </Button>
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="p-6">
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    กำลังส่งข้อมูล...
                                </>
                            ) : (
                                "ยื่นใบสมัคร"
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}

