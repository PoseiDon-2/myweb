import React from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // ข้อมูลคำขอตัวอย่างสำหรับตาราง
  const requests = [
    {
      id: "DR001",
      school: "โรงเรียนบ้านดอนแดง",
      requestTitle: "ขอบริจาคพื้นที่นั่งพักผ่อนสำหรับนักเรียน",
      amount: "฿150,000.00",
      status: "อนุมัติแล้ว",
      createdDate: "2023-10-15",
    },
    {
      id: "DR002",
      school: "โรงเรียนวังสะพาน",
      requestTitle: "ขอบริจาคพื้นที่นั่งพักผ่อนในห้องสมุด",
      amount: "฿85,000.00",
      status: "รอดำเนินการ",
      createdDate: "2023-10-18",
    },
    // ... (ข้อมูลอื่นๆ)
    {
      id: "DR010",
      school: "โรงเรียนบ้านนาคำปา",
      requestTitle: "ขอบริจาค",
      amount: "฿130,000.00",
      status: "ปฏิเสธ",
      createdDate: "2023-11-08",
    },
  ];

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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="search-icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="user-dashboard-content-area">
        <header className="page-header">
          <div className="page-title">โรงเรียน</div>
          <button className="add-user-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            เพิ่มคำขอใหม่
          </button>
        </header>

        <nav className="user-type-tabs">
          <a href="/adminuser">
            <button className="tab ">ทั้งหมด</button>
          </a>
          <button className="tab">ผู้ดูแลระบบ</button>
          <a href="/adminschool" >
            <button className="tab active">โรงเรียน</button>
          </a>
          <a href="/admindonate">
            <button className="tab ">ผู้บริจาค</button>
          </a>
        </nav>

        <section className="user-stat-cards">
          <div className="card">
            <div className="card-header">
              <p>คำขอทั้งหมด</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3V2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6.75A2.25 2.25 0 0 0 18 4.5H6A2.25 2.25 0 0 0 3.75 6.75v10.5A2.25 2.25 0 0 0 6 20.25Z" />
              </svg>
            </div>
            <h2>{requests.length}</h2>
            <span className="change-positive">+X% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>อนุมัติแล้ว</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2>{requests.filter(req => req.status === "อนุมัติแล้ว").length}</h2>
            <span className="change-neutral">+0% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>รอดำเนินการ</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2>{requests.filter(req => req.status === "รอดำเนินการ").length}</h2>
            <span className="change-positive">+X% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>ปฏิเสธ</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="stat-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h2>{requests.filter(req => req.status === "ปฏิเสธ").length}</h2>
            <span className="change-positive">+X% จากเดือนที่แล้ว</span>
          </div>
        </section>

        <section className="all-users-section">
          <div className="section-header">
            <h3>คำขอทั้งหมด <span className="total-count">({requests.length} คำขอ)</span></h3>
            <div className="table-controls">
              <input type="text" placeholder="ค้นหาคำขอ..." className="table-search-input" />
              <div className="sort-dropdown">
                <span className="sort-label">คอลัมน์นี้</span>
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
                  <th><input type="checkbox" /></th>
                  <th>รหัส</th>
                  <th>โรงเรียน</th>
                  <th>หัวข้อคำขอ</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะ</th>
                  <th>วันที่สร้าง</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td><input type="checkbox" /></td>
                    <td>{request.id}</td>
                    <td>{request.school}</td>
                    <td>{request.requestTitle}</td>
                    <td>{request.amount}</td>
                    <td>
                      <span className={`status-tag ${
                        request.status === "อนุมัติแล้ว" ? "active" :
                        request.status === "รอดำเนินการ" ? "pending" :
                        "inactive"
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td>{request.createdDate}</td>
                    <td>
                      <button className="action-menu-btn">
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