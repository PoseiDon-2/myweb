import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // ข้อมูลผู้ใช้งานตัวอย่างสำหรับตาราง
  const users = [
    { id: "USR001", name: "นายสมชาย ใจดี", email: "somchai@example.com", role: "ผู้ดูแลระบบ", status: "ใช้งาน", createdDate: "2023-01-15" },
    { id: "USR002", name: "นางสาวสมหญิง ผู้บริจาค", email: "somying@example.com", role: "ผู้บริจาค", status: "ใช้งาน", createdDate: "2023-02-20" },
    { id: "USR003", name: "นายวิชัย สุขสันต์", email: "wichai@example.com", role: "โรงเรียน", status: "ใช้งาน", createdDate: "2023-03-10" },
    { id: "USR004", name: "นายอิทธ พรสวรรค์", email: "niphai@example.com", role: "โรงเรียน", status: "ไม่ใช้งาน", createdDate: "2023-03-15" },
    { id: "USR005", name: "นางมาลี มีสุข", email: "malee@example.com", role: "ผู้บริจาค", status: "ใช้งาน", createdDate: "2023-04-05" },
    { id: "USR006", name: "นายประยุทธ์ จันทร์โอชา", email: "prayuth@example.com", role: "ผู้ดูแลระบบ", status: "ใช้งาน", createdDate: "2023-04-20" },
    { id: "USR007", name: "นายกิติกร สมบูรณ์", email: "kittikorn@example.com", role: "ผู้บริจาค", status: "ใช้งาน", createdDate: "2023-05-01" },
    { id: "USR008", name: "นางสาวพรทิพย์ ชัยชนะ", email: "porntip@example.com", role: "โรงเรียน", status: "ไม่ใช้งาน", createdDate: "2023-05-10" },
    { id: "USR009", name: "นายชนะชัย แก้วดี", email: "chanachai@example.com", role: "ผู้บริจาค", status: "ใช้งาน", createdDate: "2023-05-18" },
  ];

  return (
    <div className="admin-dashboard"> {/* คอนเทนเนอร์หลักของแดชบอร์ด */}
      {/* แถบนำทางด้านบน (Global Nav Bar) - คาดว่าใช้ร่วมกันทุกหน้า */}
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
            {/* Search Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* พื้นที่เนื้อหาเฉพาะสำหรับหน้าแดชบอร์ดผู้ใช้งาน */}
      <div className="user-dashboard-content-area">
        {/* ส่วนหัวของหน้า (Page-specific header) */}
        <header className="page-header">
          <div className="page-title">ผู้ใช้งาน</div>
          <button className="add-user-btn">
            {/* Plus Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            เพิ่มผู้ใช้งานใหม่
          </button>
        </header>

        {/* แท็บประเภทผู้ใช้งาน */}
        <nav className="user-type-tabs">
            <a href="/adminuser">
          <button className="tab active">ทั้งหมด</button>
            </a>
          <button className="tab">ผู้ดูแลระบบ</button>
            <a href="/adminschool" >
          <button className="tab ">โรงเรียน</button>
            </a>
            <a href="/admindonate">
          <button className="tab ">ผู้บริจาค</button>
            </a>
        </nav>

        {/* แผงสถิติผู้ใช้งาน */}
        <section className="user-stat-cards">
          <div className="card">
            <div className="card-header">
                <p>ผู้ใช้งานทั้งหมด</p>
                {/* User Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
            </div>
            <h2>573</h2>
            <span className="change-positive">+12.2% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
                <p>ผู้ดูแลระบบ</p>
                {/* Shield Check Icon (Closest representation for admin) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <h2>12</h2>
            <span className="change-neutral">+0% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
                <p>โรงเรียน</p>
                {/* Building Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21V19.5m0 1.5a2.25 2.25 0 0 0 2.25-2.25V15m0 6a2.25 2.25 0 0 1-2.25-2.25V15M3.75 21h16.5m-16.5 0H6.75m-3 0H2.25m18 0H17.25m3 0h1.5a2.25 2.25 0 0 0 2.25-2.25V15M21.75 21h-3.75M15 15a2.25 2.25 0 0 0 2.25-2.25V9a2.25 2.25 0 0 0-2.25-2.25H9a2.25 2.25 0 0 0-2.25 2.25v3.75m3.75-9H15a2.25 2.25 0 0 1 2.25 2.25V15m-4.5 0h.008v.008H12m-.75 4.5H12m-.75 4.5V19.5" />
                </svg>
            </div>
            <h2>142</h2>
            <span className="change-positive">+5.2% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
                <p>ผู้บริจาค</p>
                {/* Heart Icon (for donors) */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            </div>
            <h2>419</h2>
            <span className="change-positive">+1.5% จากเดือนที่แล้ว</span>
          </div>
        </section>

        {/* ส่วนตารางผู้ใช้งานทั้งหมด */}
        <section className="all-users-section">
          <div className="section-header">
            <h3>ผู้ใช้งานทั้งหมด <span className="total-count">({users.length} คน)</span></h3>
            <div className="table-controls">
              <input type="text" placeholder="ค้นหาผู้ใช้งาน..." className="table-search-input" />
              <div className="sort-dropdown">
                <span className="sort-label">คอลัมน์นี้</span>
                {/* Sort Up/Down Arrows Icon */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sort-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th> {/* ช่องทำเครื่องหมาย */}
                  <th>รหัส</th>
                  <th>ชื่อ-นามสกุล</th>
                  <th>อีเมล</th>
                  <th>บทบาท</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th></th> {/* สำหรับ Actions / จุดสามจุด */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td><input type="checkbox" /></td>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-tag ${
                        user.role === "ผู้ดูแลระบบ" ? "admin" :
                        user.role === "โรงเรียน" ? "school" :
                        "donor" // Default to donor if not admin/school
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${
                        user.status === "ใช้งาน" ? "active" : "inactive"
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.createdDate}</td>
                    <td>
                      <button className="action-menu-btn">
                        {/* Ellipsis Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="ellipsis-icon">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;