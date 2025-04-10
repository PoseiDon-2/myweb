"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import jwt from "jsonwebtoken"; // เพิ่มเพื่อ decode token
import "@/components/css/nav.css";

function Nav() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [username, setUsername] = useState(""); // เพิ่ม state สำหรับชื่อผู้ใช้
    const [role, setRole] = useState(""); // เพิ่ม state สำหรับบทบาท (Role)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            // Decode token เพื่อดึงข้อมูลผู้ใช้ (สมมติว่า email ใช้แทน username)
            try {
                const decoded = jwt.decode(token);
                if (typeof decoded !== "string" && decoded?.email) {
                    setUsername(decoded.email.split("@")[0] || "User"); // ใช้ส่วนก่อน @ เป็น username
                    setRole(decoded?.role || "USER"); // ดึง Role จาก token
                } else {
                    setUsername("User");
                    setRole("USER");
                }
            } catch (err) {
                console.error("Error decoding token:", err);
                setUsername("User");
                setRole("USER");
            }
        } else {
            setIsLoggedIn(false);
            setRole("USER");
        }
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setDropdownOpen(false);
        setUsername("");
        setRole("USER");
    };

    return (
        <nav className="navbar">
            <Link href="/">
                <div className="logo">Donation Platform</div>
            </Link>
            <ul className="menu">
                <li><Link href="/donationRequestsPage">คำขอรับบริจาค</Link></li>
                <li><Link href="">วิธีใช้งาน</Link></li>
                <li><Link href="#">ติดต่อเรา</Link></li>
                {/* เมนูสำหรับ Admin */}
                {role === "ADMIN" && (
                    <li><Link href="/adminPage">แอดมิน</Link></li>
                )}
                {/* เมนูสำหรับ Creator */}
                {role === "CREATOR" && (
                    <li><Link href="/donation-requests/new">ผู้สร้าง</Link></li>
                )}
            </ul>
            <div className="auth-buttons">
                {isLoggedIn ? (
                    <div className="profile-menu">
                        <div className="profile-btn" onClick={toggleDropdown}>
                            <div className="profile-circle">
                                {/* แสดงตัวอักษรย่อของ username */}
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <span className="username">{username}</span>
                        </div>
                        {dropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link href="/Profile">โปรไฟล์</Link></li>
                                <li><Link href="#">ประวัติการบริจาค</Link></li>
                                <li><Link href="#">การติดตาม</Link></li>
                                <li>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        ออกจากระบบ
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <>
                        <Link href="/login">
                            <button className="login">ล็อกอิน</button>
                        </Link>
                        <Link href="/register">
                            <button className="register">ลงทะเบียน</button>
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Nav;
