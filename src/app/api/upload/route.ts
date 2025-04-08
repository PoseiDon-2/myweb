import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join, resolve } from "path";
import Tesseract from "tesseract.js";

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${file.name}`;
        const path = join(process.cwd(), "public", "uploads", fileName);
        await writeFile(path, buffer);

        const url = `/uploads/${fileName}`;

        // สร้าง worker ด้วย path ที่ชัดเจน
        const workerPath = resolve(process.cwd(), "node_modules", "tesseract.js", "src", "worker-script", "node", "index.js");
        const worker = await Tesseract.createWorker("eng+tha", 1, {
            workerPath,
            logger: (m) => console.log(m), // ดูความคืบหน้า
        });

        // อ่านข้อความจากสลิป
        const { data: { text } } = await worker.recognize(path);
        await worker.terminate(); // ปิด worker หลังใช้งาน

        console.log("Extracted Text from Slip:", text);

        // ดึงจำนวนเงินจากสลิป
        const amountMatch = text.match(/(\d+\.\d{2})/);
        const extractedAmount = amountMatch ? parseFloat(amountMatch[0]) : null;

        return NextResponse.json({
            url,
            extractedAmount,
            rawText: text,
        }, { status: 200 });
    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: "Failed to upload or process slip" }, { status: 500 });
    }
}