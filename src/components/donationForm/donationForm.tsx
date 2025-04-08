"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import Tesseract from "tesseract.js";
import "@/components/css/donationForm.css";

// ฟังก์ชันสร้าง PromptPay Payload (คงเดิม)
const generatePromptPayPayload = (phone: string, amount: number) => {
    if (!/^\d{10}$/.test(phone)) {
        throw new Error("Phone number must be 10 digits");
    }

    const phoneFormatted = `00${phone.replace(/^0/, "66")}`;
    const formattedAmount = amount.toFixed(2);

    const merchantInfo = `0016A00000067701011101${phoneFormatted.length}${phoneFormatted}`;
    const merchantLength = merchantInfo.length.toString().padStart(2, "0");

    const basePayload = [
        "000201",
        "010211",
        `29${merchantLength}${merchantInfo}`,
        "52040000",
        "5303764",
        `54${formattedAmount.length.toString().padStart(2, "0")}${formattedAmount}`,
        "5802TH",
        "6304",
    ].join("");

    const crc = calculateCRC(basePayload);
    return `${basePayload}${crc}`;
};

// ฟังก์ชันคำนวณ CRC16 (คงเดิม)
const calculateCRC = (payload: string): string => {
    let crc = 0xffff;
    const polynomial = 0x1021;

    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ polynomial;
            } else {
                crc <<= 1;
            }
            crc &= 0xffff;
        }
    }
    return crc.toString(16).padStart(4, "0").toUpperCase();
};

export default function DonationForm({ requestId, walletAddress }: { requestId: string; walletAddress: string }) {
    const [amount, setAmount] = useState("1000");
    const [customAmount, setCustomAmount] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [taxReceipt, setTaxReceipt] = useState(false);
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [qrPayload, setQrPayload] = useState<string>("");
    const [qrError, setQrError] = useState<string | null>(null);
    const [slipText, setSlipText] = useState<string>("");
    const [extractedAmount, setExtractedAmount] = useState<number | null>(null);
    const [extractedDateTime, setExtractedDateTime] = useState<Date | null>(null);
    const [extractedReference, setExtractedReference] = useState<string | null>(null);

    useEffect(() => {
        setQrError(null);
        if (amount && parseFloat(amount) > 0) {
            try {
                const payload = generatePromptPayPayload(walletAddress, parseFloat(amount));
                setQrPayload(payload);
            } catch (error) {
                setQrError((error as Error).message);
            }
        } else {
            setQrPayload("");
        }
    }, [amount, walletAddress]);

    const handleAmountChange = (value: string) => {
        setAmount(value);
        setCustomAmount(false);
    };

    const handleCustomAmountToggle = () => {
        setCustomAmount(true);
        setAmount("");
    };

    const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSlipFile(file);

            setLoading(true);
            try {
                const { data: { text } } = await Tesseract.recognize(file, "eng+tha", {
                    logger: (m) => console.log(m),
                });
                console.log("Extracted Text from Slip:", text);
                setSlipText(text);

                // ดึงจำนวนเงิน
                const amountMatch = text.match(/จ\s*ํ\s*า\s*น\s*ว\s*น\s*เง\s*ิ\s*น\s*(\d+\.\d{2})\s*บ\s*า\s*ท/i);
                const extracted = amountMatch ? parseFloat(amountMatch[1]) : null;
                setExtractedAmount(extracted);

                // ดึงวันที่และเวลา
                let extractedDate: Date | null = null;
                const thaiMonths = {
                    "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
                    "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11
                };

                // ปรับ regex ให้ยืดหยุ่นกับช่องว่างและจุด
                const thaiDateMatch = text.match(/ว\s*ั\s*น\s*ท\s*ี\s*่\s*ท\s*ํ\s*า\s*ร\s*า\s*ย\s*ก\s*า\s*ร\s*(\d{2})\s*([ก-ฮ]+\s*\.\s*[ก-ฮ]+\s*\.\s*)\s*(\d{4})\s*-\s*(\d{2}:\d{2})/i);
                if (thaiDateMatch) {
                    const [_, day, monthStr, year, timeStr] = thaiDateMatch;
                    const monthClean = monthStr.replace(/\s*\.\s*/g, "").trim(); // ลบจุดและช่องว่าง
                    const month = thaiMonths[monthClean as keyof typeof thaiMonths];
                    if (month !== undefined) {
                        const [hours, minutes] = timeStr.split(":").map(Number);
                        extractedDate = new Date(parseInt(year) - 543, month, parseInt(day), hours, minutes);
                    }
                }

                setExtractedDateTime(extractedDate);

                // ดึงเลขที่อ้างอิง (ขยายความยาวสูงสุดเป็น 20)
                const refMatch = text.match(/(?:ร\s*ห\s*ั\s*ส\s*อ\s*้\s*า\s*ง\s*อ\s*ิ\s*ง|Ref|Reference)[:\s]*([A-Za-z0-9]{10,20})/i);
                const extractedRef = refMatch ? refMatch[1] : null;
                setExtractedReference(extractedRef);
            } catch (error) {
                console.error("OCR Error:", error);
                setSlipText("ไม่สามารถอ่านสลิปได้");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDonate = async () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert("กรุณาระบุจำนวนเงิน");
            return;
        }
        if (!name || !email || !phone) {
            alert("กรุณากรอกข้อมูลผู้บริจาคให้ครบ");
            return;
        }
        if (!slipFile) {
            alert("กรุณาอัปโหลดสลิป");
            return;
        }

        const enteredAmount = parseFloat(amount);
        if (extractedAmount === null) {
            alert("ไม่สามารถอ่านจำนวนเงินจากสลิปได้ กรุณาตรวจสอบสลิป");
            return;
        }
        if (Math.abs(extractedAmount - enteredAmount) > 0.01) {
            alert(`จำนวนเงินในสลิป (${extractedAmount} บาท) ไม่ตรงกับที่ระบุ (${enteredAmount} บาท)`);
            return;
        }

        const now = new Date();
        if (extractedDateTime === null) {
            alert("ไม่สามารถอ่านวันที่และเวลาจากสลิปได้ กรุณาตรวจสอบสลิป");
            return;
        }
        const timeDiff = (now.getTime() - extractedDateTime.getTime()) / (1000 * 60 * 60);
        if (timeDiff < 0 || timeDiff > 24) {
            alert("สลิปนี้เก่ากว่า 24 ชั่วโมงหรือวันที่ไม่ถูกต้อง กรุณาใช้สลิปการโอนล่าสุด");
            return;
        }

        if (extractedReference === null) {
            alert("ไม่สามารถอ่านเลขที่อ้างอิงจากสลิปได้ กรุณาตรวจสอบสลิป");
            return;
        }

        const refCheckRes = await fetch(`/api/donation/check-reference?ref=${extractedReference}`);
        const { exists } = await refCheckRes.json();
        if (!refCheckRes.ok || exists) {
            alert("เลขที่อ้างอิงนี้ถูกใช้ไปแล้ว กรุณาใช้สลิปการโอนใหม่");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("file", slipFile);
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            if (!uploadRes.ok) throw new Error("Failed to upload slip");
            const { url } = await uploadRes.json();

            const donationRes = await fetch("/api/donation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    requestId,
                    amount: enteredAmount,
                    name,
                    email,
                    phone,
                    message: message || null,
                    taxReceipt,
                    isAnonymous,
                    slipUrl: url,
                    referenceNumber: extractedReference,
                }),
            });
            if (!donationRes.ok) throw new Error("Failed to record donation");

            alert("บริจาคสำเร็จ! ขอบคุณที่ร่วมสนับสนุน");
            setAmount("1000");
            setCustomAmount(false);
            setName("");
            setEmail("");
            setPhone("");
            setMessage("");
            setTaxReceipt(false);
            setIsAnonymous(false);
            setSlipFile(null);
            setSlipText("");
            setExtractedAmount(null);
            setExtractedDateTime(null);
            setExtractedReference(null);
        } catch (error) {
            console.error("Donation Error:", error);
            alert("เกิดข้อผิดพลาดในการบริจาค");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="donation-form">
            <div className="form-header">
                <h2 className="form-title">ร่วมบริจาค</h2>
            </div>
            <div className="form-content">
                <div className="form-section">
                    <label className="form-label">เลือกจำนวนเงินบริจาค (บาท)</label>
                    <div className="radio-group">
                        {["100", "500", "1000", "2000", "5000"].map((val) => (
                            <div className="radio-item" key={val}>
                                <input
                                    type="radio"
                                    id={`amount-${val}`}
                                    value={val}
                                    checked={!customAmount && amount === val}
                                    onChange={() => handleAmountChange(val)}
                                    className="radio-input"
                                />
                                <label htmlFor={`amount-${val}`} className="radio-label">฿{parseInt(val).toLocaleString()}</label>
                            </div>
                        ))}
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

                {qrPayload && !qrError ? (
                    <div className="form-section">
                        <label className="form-label">สแกนเพื่อบริจาค</label>
                        <div className="qr-code">
                            <QRCodeSVG value={qrPayload} size={256} />
                            <p className="text-center mt-2">฿{parseFloat(amount).toLocaleString()}</p>
                        </div>
                    </div>
                ) : qrError ? (
                    <div className="form-section">
                        <p className="text-red-500">ข้อผิดพลาด: {qrError}</p>
                    </div>
                ) : null}

                <div className="form-section">
                    <label htmlFor="name" className="form-label">ชื่อ-นามสกุล</label>
                    <input
                        id="name"
                        placeholder="ชื่อผู้บริจาค"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="email" className="form-label">อีเมล</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="อีเมลสำหรับใบเสร็จรับเงิน"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="phone" className="form-label">เบอร์โทรศัพท์</label>
                    <input
                        id="phone"
                        placeholder="เบอร์โทรศัพท์ติดต่อ"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input"
                    />
                </div>

                <div className="form-section">
                    <label htmlFor="message" className="form-label">ข้อความถึงโรงเรียน (ไม่บังคับ)</label>
                    <textarea
                        id="message"
                        placeholder="ข้อความหรือคำอวยพรถึงโรงเรียน"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="form-textarea"
                    />
                </div>

                <div className="form-section">
                    <label className="form-label">อัปโหลดสลิปการโอน</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="form-input"
                    />
                    {slipText && (
                        <div className="text-sm mt-2">
                            <p>ข้อความจากสลิป: {slipText}</p>
                            {extractedAmount && <p>จำนวนเงิน: {extractedAmount} บาท</p>}
                            {extractedDateTime && <p>วันที่/เวลา: {extractedDateTime.toLocaleString()}</p>}
                            {extractedReference && <p>เลขที่อ้างอิง: {extractedReference}</p>}
                        </div>
                    )}
                </div>

                <div className="checkbox-group">
                    <input
                        type="checkbox"
                        id="tax"
                        checked={taxReceipt}
                        onChange={(e) => setTaxReceipt(e.target.checked)}
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
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="checkbox-input"
                    />
                    <label htmlFor="anonymous" className="checkbox-label">
                        บริจาคโดยไม่ประสงค์ออกนาม
                    </label>
                </div>
            </div>
            <div className="form-footer">
                <button
                    className="donate-button"
                    onClick={handleDonate}
                    disabled={loading}
                >
                    {loading ? "กำลังตรวจสอบ..." : "บริจาคเลย"}
                </button>
            </div>
        </div>
    );
}