import "@/components/css/nav.css";
import Link from "next/link";

function nav() {
    return (
        <nav className="navbar">
            <Link href="/">
                <div className="logo">Donation Platform</div>
            </Link>
            <ul className="menu">
                <li><Link href="#">คำขอรับบริจาค</Link></li>
                <li><Link href="#">วิธีใช้งาน</Link></li>
                <li><Link href="#">ติดต่อเรา</Link></li>
            </ul>
            <div className="auth-buttons">
                <Link href="/login"><button className="login">ล็อกอิน</button></Link>
                <Link href="/register"><button className="register">ลงทะเบียน</button></Link>
            </div>
        </nav>
    )
}

export default nav
