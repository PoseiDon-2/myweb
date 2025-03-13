import "@/components/css/nav.css";
import Link from "next/link";

function nav() {
    return (
        <nav className="navbar">
            <a href="/">
                <div className="logo">Donation Platform</div>
            </a>
            <ul className="menu">
                <li><a href="#">คำขอรับบริจาค</a></li>
                <li><a href="#">วิธีใช้งาน</a></li>
                <li><a href="#">ติดต่อเรา</a></li>
                <li><a href="/admin">แอดมิน</a></li>
            </ul>
            <div className="auth-buttons">
                <button className="login">ล็อกอิน</button>
                <button className="register">ลงทะเบียน</button>
            </div>
        </nav>
    )
}

export default nav
