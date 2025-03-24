import DonationRequestForm from "@/components/donation-request-form/donation-request-form";

import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";

import "./page.css"
export default function Home() {
    return (
        <div>
            <Nav />
            <main className="container mx-auto py-10 px-4 mt-20">
                <h1 className="text-3xl font-bold mb-8">สร้างคำขอรับบริจาคของโรงเรียน</h1>
                <DonationRequestForm />
            </main>
            <Footer />
        </div>

    )
}

