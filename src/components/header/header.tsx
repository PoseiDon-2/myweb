"use client";
import "@/components/css/header.css";

interface HeaderProps {
    onSearch?: (query: string) => void; // Optional prop สำหรับ callback การค้นหา
}

function header({ onSearch }: HeaderProps = {}) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const query = (e.currentTarget.elements.namedItem("search") as HTMLInputElement)?.value;
        if (onSearch && query) {
            onSearch(query);
        }
    };

    return (
        <header className="donation-section">
            <div className="donation-left">
                <h2>สนับสนุนการศึกษาไทย ร่วมบริจาคกับเรา</h2>
                <p>แพลตฟอร์มที่เชื่อมโยงผู้บริจาคกับคุณครูที่ต้องการการสนับสนุน เพื่อพัฒนาการศึกษาของเด็กไทย</p>
                <div className="donation-buttons">
                    <button className="search-request">ค้นหาคำขอรับบริจาค</button>
                    <button className="create-request">สร้างคำขอรับบริจาค</button>
                </div>
            </div>
            <div className="donation-right">
                <p className="htext-1">ค้นหาโครงการที่ต้องการบริจาค</p>
                <p className="htext-2">ค้นหาตามชื่อโครงการ โรงเรียน หรือจังหวัด</p>
                <form className="search-container" onSubmit={handleSearch}>
                    <input
                        type="text"
                        name="search"
                        className="donation-search"
                        placeholder="ค้นหาโครงการ..."
                    />
                    <button type="submit" className="search-button">ค้นหา</button>
                </form>
            </div>
        </header>
    );
}

export default header;