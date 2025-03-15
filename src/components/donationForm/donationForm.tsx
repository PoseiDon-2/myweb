"use client";
import { useState } from "react"
import "@/components/css/donationForm.css"

export default function DonationForm() {
    const [amount, setAmount] = useState("1000")
    const [customAmount, setCustomAmount] = useState(false)



    const handleAmountChange = (value: string) => {
        setAmount(value)
        setCustomAmount(false)
    }

    const handleCustomAmountToggle = () => {
        setCustomAmount(true)
        setAmount("")
    }

    return (
        <div className="donation-form">
            <div className="form-header">
                <h2 className="form-title">ร่วมบริจาค</h2>
            </div>
            <div className="form-content">
                <div className="form-section">
                    <label className="form-label">เลือกจำนวนเงินบริจาค (บาท)</label>
                    <div className="radio-group">
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-100"
                                value="100"
                                checked={!customAmount && amount === "100"}
                                onChange={() => handleAmountChange("100")}
                                className="radio-input"
                            />
                            <label htmlFor="amount-100" className="radio-label">฿100</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-500"
                                value="500"
                                checked={!customAmount && amount === "500"}
                                onChange={() => handleAmountChange("500")}
                                className="radio-input"
                            />
                            <label htmlFor="amount-500" className="radio-label">฿500</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-1000"
                                value="1000"
                                checked={!customAmount && amount === "1000"}
                                onChange={() => handleAmountChange("1000")}
                                className="radio-input"
                            />
                            <label htmlFor="amount-1000" className="radio-label">฿1,000</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-2000"
                                value="2000"
                                checked={!customAmount && amount === "2000"}
                                onChange={() => handleAmountChange("2000")}
                                className="radio-input"
                            />
                            <label htmlFor="amount-2000" className="radio-label">฿2,000</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-5000"
                                value="5000"
                                checked={!customAmount && amount === "5000"}
                                onChange={() => handleAmountChange("5000")}
                                className="radio-input"
                            />
                            <label htmlFor="amount-5000" className="radio-label">฿5,000</label>
                        </div>
                        <div className="radio-item">
                            <input
                                type="radio"
                                id="amount-custom"
                                value="custom"
                                checked={customAmount}
                                onChange={handleCustomAmountToggle}
                                className="radio-input"
                            />
                            <label htmlFor="amount-custom" className="radio-label">อื่นๆ</label>
                        </div>
                    </div>

                    {customAmount && (
                        <div className="custom-amount-input">
                            <input
                                type="number"
                                placeholder="ระบุจำนวนเงิน"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="form-input"
                            />
                        </div>
                    )}
                </div>

                <div className="form-section">
                    <label htmlFor="name" className="form-label">ชื่อ-นามสกุล</label>
                    <input
                        id="name"
                        placeholder="ชื่อผู้บริจาค"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="email" className="form-label">อีเมล</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="อีเมลสำหรับใบเสร็จรับเงิน"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="phone" className="form-label">เบอร์โทรศัพท์</label>
                    <input
                        id="phone"
                        placeholder="เบอร์โทรศัพท์ติดต่อ"
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="message" className="form-label">ข้อความถึงโรงเรียน (ไม่บังคับ)</label>
                    <textarea
                        id="message"
                        placeholder="ข้อความหรือคำอวยพรถึงโรงเรียน"
                        className="form-textarea"
                    />
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="tax"
                        className="checkbox-input"
                    />
                    <label htmlFor="tax" className="checkbox-label">
                        ต้องการใบเสร็จรับเงินเพื่อลดหย่อนภาษี
                    </label>
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="anonymous"
                        className="checkbox-input"
                    />
                    <label htmlFor="anonymous" className="checkbox-label">
                        บริจาคโดยไม่ประสงค์ออกนาม
                    </label>
                </div>
            </div>
            <div className="form-footer">
                <button className="donate-button">บริจาคเลย</button>
            </div>
        </div>
    )
}