import { DonationRequestList } from "@/components/donation-request-list/donation-request-list"
import { SearchFilters } from "@/components/search-filters/search-filters"

import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import "./page.css"
export default function DonationRequestsPage() {
    return (
        <div>
            <Nav />
            <div className="content p-30">
                <h1 className="text-3xl font-bold mb-2">รายการคำขอรับบริจาคโรงเรียน</h1>
                <p className="text-muted-foreground mb-6">ค้นหาและสนับสนุนโรงเรียนที่ต้องการความช่วยเหลือ</p>

                <SearchFilters />

                <div className="mt-8">
                    <DonationRequestList />
                </div>
            </div>
            <Footer />
        </div>

    )
}

