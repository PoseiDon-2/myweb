import { NextResponse } from "next/server";
import QRCode from "qrcode";

// ฟังก์ชันสร้าง PromptPay QR Code
function generatePromptPayQR(phoneNumber: string, amount: number): string {
    const promptPayId = `000201010212${phoneNumber}`; // ใช้เบอร์โทรผูก PromptPay
    const amountStr = amount.toFixed(2).replace(".", "");
    const payload = `${promptPayId}530376454${amountStr.length}${amountStr}5802TH6304`;
    const crc = calculateCRC(payload); // CRC16 checksum
    return `${payload}${crc}`;
}

// ฟังก์ชันคำนวณ CRC16 (ตามมาตรฐาน PromptPay)
function calculateCRC(payload: string): string {
    let crc = 0xffff;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
            crc &= 0xffff;
        }
    }
    return crc.toString(16).padStart(4, "0").toUpperCase();
}

interface PostRequestBody {
    amount: number;
}

interface PostResponseBody {
    qrCodeUrl: string;
}

export async function POST(request: Request): Promise<NextResponse<PostResponseBody>> {
    const { amount }: PostRequestBody = await request.json();
    const phoneNumber = "0812345678"; // เบอร์โทร PromptPay ของบัญชีกรุงไทยคุณ
    const qrPayload = generatePromptPayQR(phoneNumber, amount);

    const qrCodeUrl = await QRCode.toDataURL(qrPayload); // สร้าง QR Code เป็น base64
    return NextResponse.json({ qrCodeUrl });
}