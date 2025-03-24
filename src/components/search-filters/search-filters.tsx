"use client"

import { useState } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

import "./page.css"

export function SearchFilters() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedFilters, setSelectedFilters] = useState<string[]>([])
    const [amountRange, setAmountRange] = useState([0, 100000])

    const handleFilterToggle = (filter: string) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter((f) => f !== filter))
        } else {
            setSelectedFilters([...selectedFilters, filter])
        }
    }

    const clearFilters = () => {
        setSelectedFilters([])
        setAmountRange([0, 100000])
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="ค้นหาโดยชื่อโรงเรียน, สถานที่, หรือประเภทการบริจาค"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="เรียงตาม" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="newest">ล่าสุด</SelectItem>
                            <SelectItem value="urgent">เร่งด่วน</SelectItem>
                            <SelectItem value="amount-high">จำนวนเงินมากไปน้อย</SelectItem>
                            <SelectItem value="amount-low">จำนวนเงินน้อยไปมาก</SelectItem>
                        </SelectContent>
                    </Select>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon">
                                <SlidersHorizontal className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-white">
                            <SheetHeader>
                                <SheetTitle>ตัวกรอง</SheetTitle>
                                <SheetDescription>กรองรายการคำขอรับบริจาคตามความต้องการของคุณ</SheetDescription>
                            </SheetHeader>

                            <div className="mt-6 space-y-6 p-4">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="category">
                                        <AccordionTrigger>ประเภทการบริจาค</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                {["อุปกรณ์การเรียน", "อุปกรณ์กีฬา", "คอมพิวเตอร์", "เครื่องแบบนักเรียน", "ทุนการศึกษา", "อาคารเรียน"].map(
                                                    (category) => (
                                                        <div className="flex items-center space-x-2" key={category}>
                                                            <Checkbox
                                                                id={`category-${category}`}
                                                                checked={selectedFilters.includes(category)}
                                                                onCheckedChange={() => handleFilterToggle(category)}
                                                            />
                                                            <Label htmlFor={`category-${category}`}>{category}</Label>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="location">
                                        <AccordionTrigger>ภูมิภาค</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                {["ภาคเหนือ", "ภาคกลาง", "ภาคตะวันออกเฉียงเหนือ", "ภาคตะวันออก", "ภาคตะวันตก", "ภาคใต้"].map(
                                                    (region) => (
                                                        <div className="flex items-center space-x-2" key={region}>
                                                            <Checkbox
                                                                id={`region-${region}`}
                                                                checked={selectedFilters.includes(region)}
                                                                onCheckedChange={() => handleFilterToggle(region)}
                                                            />
                                                            <Label htmlFor={`region-${region}`}>{region}</Label>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="amount">
                                        <AccordionTrigger>จำนวนเงินที่ต้องการ</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-6 mt-14 bg">
                                                <Slider
                                                    defaultValue={[0, 100000]}
                                                    max={100000}
                                                    step={1000}
                                                    value={amountRange}
                                                    onValueChange={setAmountRange}
                                                    className="[&>span:first-child]:bg-gray-300 [&>span:first-child>span]:bg-blue-500 [&>span:last-child]:bg-white [&>span:last-child]:border-red-500"
                                                />
                                                <div className="flex justify-between">
                                                    <span>{amountRange[0].toLocaleString()} บาท</span>
                                                    <span>{amountRange[1].toLocaleString()} บาท</span>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>

                                    <AccordionItem value="urgency">
                                        <AccordionTrigger>ความเร่งด่วน</AccordionTrigger>
                                        <AccordionContent>
                                            <div className="space-y-2">
                                                {["เร่งด่วนมาก", "เร่งด่วน", "ปานกลาง", "ไม่เร่งด่วน"].map((urgency) => (
                                                    <div className="flex items-center space-x-2" key={urgency}>
                                                        <Checkbox
                                                            id={`urgency-${urgency}`}
                                                            checked={selectedFilters.includes(urgency)}
                                                            onCheckedChange={() => handleFilterToggle(urgency)}
                                                        />
                                                        <Label htmlFor={`urgency-${urgency}`}>{urgency}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                                <div className="flex justify-between">
                                    <Button variant="outline" onClick={clearFilters}>
                                        ล้างตัวกรอง
                                    </Button>
                                    <Button>นำไปใช้</Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {selectedFilters.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFilters.map((filter) => (
                        <Badge key={filter} variant="secondary" className="flex items-center gap-1">
                            {filter}
                            <button className="ml-1 hover:text-destructive" onClick={() => handleFilterToggle(filter)}>
                                ×
                            </button>
                        </Badge>
                    ))}
                    <Button variant="link" size="sm" onClick={clearFilters} className="h-6 mt-2.5">
                        ล้างตัวกรองทั้งหมด
                    </Button>
                </div>
            )}
        </div>
    )
}

