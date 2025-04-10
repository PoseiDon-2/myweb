import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">

      <nav className="nav-bar">
        <div className="nav-links">
          <a href="#" className="nav-link active">หน้าหลัก</a>
          <a href="/adminuser" className="nav-link">ผู้ใช้งาน</a>
          <a href="#" className="nav-link">คำขอบริจาค</a>
          <a href="/adminTransactions" className="nav-link">ธุรกรรมการเงิน</a>
          <a href="/adminReports" className="nav-link">รายงาน</a>
          <a href="#" className="nav-link">ตั้งค่า</a>
        </div>
        <div className="search-container">
          <input className="nav-search-input" type="text" placeholder="ค้นหา..." />
          <button className="nav-search-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="search-icon">
              <path d="M10.5 1.5a9 9 0 100 18 9 9 0 000-18zM3 10.5a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" clipRule="evenodd" />
              <path d="M19.5 19.5l-4.25-4.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>
      
      <header className="topbar">
        <div className="logo">แดชบอร์ดผู้ดูแลระบบ</div>
        <button className="new-request-btn">เพิ่มคำขอบริจาคใหม่</button>
      </header>

      <nav className="nav-tabs">
        <button className="tab active">ภาพรวม</button>
        <button className="tab">คำขอบริจาค</button>
        <button className="tab">ผู้ใช้งาน</button>
        <button className="tab">ธุรกรรมการเงิน</button>
      </nav>

      <section className="stat-cards">
        <div className="card">
          <p>คำขอบริจาคทั้งหมด</p>
          <h2>142</h2>
          <span>+18.1% จากเดือนที่แล้ว</span>
        </div>
        <div className="card">
          <p>ยอดบริจาครวม</p>
          <h2>฿2,350,456</h2>
          <span>+20.1% จากเดือนที่แล้ว</span>
        </div>
        <div className="card">
          <p>คำขอที่รอการอนุมัติ</p>
          <h2>28</h2>
          <span>-4.5% จากเดือนที่แล้ว</span>
        </div>
        <div className="card">
          <p>ผู้ใช้งานทั้งหมด</p>
          <h2>573</h2>
          <span>+12.2% จากเดือนที่แล้ว</span>
        </div>
      </section>

      <section className="content">
        <div className="chart">
          <h3>ภาพรวมการบริจาค</h3>

        </div>
        <div className="latest-activity">
          <h3>กิจกรรมล่าสุด</h3>
          <ul>
            <li>โรงเรียนบ้านหนองแสง ได้รับการบริจาค ฿15,000</li>
            <li>โรงเรียนวัดชนะสงคราม ได้รับการบริจาค ฿8,500</li>
            <li>โรงเรียนบ้านท่าสัก ได้รับการบริจาค ฿12,300</li>
            <li>โรงเรียนบ้านหนองไผ่ ได้รับการบริจาค ฿8,900</li>
            <li>โรงเรียนวังโพทอง ได้รับการบริจาค ฿21,500</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
