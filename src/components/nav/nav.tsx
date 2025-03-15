import "@/components/css/nav.css";


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
            </ul>
            <div className="auth-buttons">
                <a href="/login"><button className="login">ล็อกอิน</button></a>
                <a href="/register"><button className="register">ลงทะเบียน</button></a>
            </div>
        </nav>
    )
}

export default nav
