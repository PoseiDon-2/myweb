"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "@/components/css/donationForm.css";

// ฟังก์ชันสร้าง PromptPay Payload
const generatePromptPayPayload = (phone: string, amount: number) => {
    if (!/^\d{10}$/.test(phone)) {
        throw new Error("Phone number must be 10 digits");
    }

    const phoneFormatted = `00${phone.replace(/^0/, "66")}`; // เช่น 0812345678 -> 660812345678
    const formattedAmount = amount.toFixed(2); // เช่น 1000 -> 1000.00

    // คำนวณความยาวของ PromptPay Merchant Info
    const merchantInfo = `0016A00000067701011101${phoneFormatted.length}${phoneFormatted}`;
    const merchantLength = merchantInfo.length.toString().padStart(2, "0");

    // สร้าง Payload
    const basePayload = [
        "000201", // Payload Format Indicator
        "010211", // Static QR
        `29${merchantLength}${merchantInfo}`, // PromptPay Merchant Info
        "52040000", // Merchant Category Code
        "5303764", // Currency Code (THB)
        `54${formattedAmount.length.toString().padStart(2, "0")}${formattedAmount}`, // Amount
        "5802TH", // Country Code
        "6304", // Checksum Placeholder
    ].join("");

    const crc = calculateCRC(basePayload);
    console.log("Payload (before CRC):", basePayload); // ดีบัก
    console.log("CRC:", crc); // ดีบัก
    return `${basePayload}${crc}`;
};

// ฟังก์ชันคำนวณ CRC16
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

    useEffect(() => {
        setQrError(null);
        if (amount && parseFloat(amount) > 0) {
            try {
                const payload = generatePromptPayPayload(walletAddress, parseFloat(amount));
                console.log("Final QR Payload:", payload); // ดีบัก
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

    const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSlipFile(e.target.files[0]);
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
                    amount: parseFloat(amount),
                    name,
                    email,
                    phone,
                    message: message || null,
                    taxReceipt,
                    isAnonymous,
                    slipUrl: url,
                }),
            });
            if (!donationRes.ok) throw new Error("Failed to record donation");
            const donation = await donationRes.json();

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
                    {loading ? "กำลังบันทึก..." : "บริจาคเลย"}
                </button>
            </div>
        </div>
    );
}