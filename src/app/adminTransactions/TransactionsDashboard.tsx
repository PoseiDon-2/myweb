import React from "react";
import "./TransactionsDashboard.css";

type Transaction = {
  id: string;
  requestId: string;
  school: string;
  donor: string;
  amount: string;
  status: "สำเร็จ" | "รอดำเนินการ" | "ล้มเหลว";
  date: string;
};

const TransactionsDashboard: React.FC = () => {
  // ตัวอย่างข้อมูลธุรกรรม
  const transactions: Transaction[] = [
    { id: "TRX001", requestId: "DR001", school: "โรงเรียนบ้านหนองแสง", donor: "นายวัชระ สุขสันต์",   amount: "฿15,000.00", status: "สำเร็จ",    date: "2023-11-05" },
    { id: "TRX002", requestId: "DR002", school: "โรงเรียนวัดสระเกษ",   donor: "นางสาวกานดา วงศ์ทอง", amount: "฿8,500.00",  status: "สำเร็จ",    date: "2023-11-06" },
    { id: "TRX003", requestId: "DR003", school: "โรงเรียนบ้านมะไฟ",    donor: "นายประสิทธิ์ แสนดี", amount: "฿12,300.00", status: "สำเร็จ",    date: "2023-11-07" },
    { id: "TRX004", requestId: "DR004", school: "โรงเรียนบ้านหนองไผ",  donor: "นางวิภา สุขใจ",       amount: "฿9,800.00",  status: "รอดำเนินการ", date: "2023-11-08" },
    { id: "TRX005", requestId: "DR005", school: "โรงเรียนวัดโพธิ์งาม", donor: "นางสาวปาณิศา สมบูรณ์", amount: "฿21,500.00", status: "สำเร็จ",    date: "2023-11-09" },
    { id: "TRX006", requestId: "DR006", school: "โรงเรียนบ้านโพนทอง", donor: "นายสมชาย ใจดี",     amount: "฿5,200.00",  status: "ล้มเหลว",    date: "2023-11-10" },
    // … เพิ่มข้อมูลตามต้องการ
  ];

  const totalCount    = transactions.length;
  const successCount  = transactions.filter(t => t.status === "สำเร็จ").length;
  const pendingCount  = transactions.filter(t => t.status === "รอดำเนินการ").length;
  const failedCount   = transactions.filter(t => t.status === "ล้มเหลว").length;
  const totalAmount   = transactions
    .reduce((sum, t) => sum + parseFloat(t.amount.replace(/[^0-9.-]+/g, "")), 0)
    .toLocaleString("th-TH", { style: "currency", currency: "THB" });

  return (
    <div className="finance-dashboard">
      {/* แถบหัวเมนู */}
      <nav className="nav-bar">
        <div className="nav-links">
          <a href="/admin" className="nav-link">หน้าหลัก</a>
          <a href="#" className="nav-link">คำขอบริจาค</a>
          <a href="/adminTransactions" className="nav-link active">ธุรกรรมการเงิน</a>
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

      <div className="dashboard-content">
        {/* หัวเรื่องเพจ + ปุ่มส่งออก */}
        <header className="page-header">
          <div className="page-title">ธุรกรรมการเงิน</div>
          <button className="export-report-btn">
            ส่งออกรายงาน
          </button>
        </header>

        {/* แถบกรองสถานะ */}
        <nav className="transaction-tabs">
          <button className="tab active">ทั้งหมด</button>
          <button className="tab">สำเร็จ</button>
          <button className="tab">รอดำเนินการ</button>
          <button className="tab">ล้มเหลว</button>
        </nav>

        {/* สถิติภาพรวม */}
        <section className="transaction-stat-cards">
          <div className="card">
            <div className="card-header">
              <p>ธุรกรรมทั้งหมด</p>
            </div>
            <h2>{totalCount}</h2>
            <span className="change-positive">+X% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>ยอดบริจาคทั้งหมด</p>
            </div>
            <h2>{totalAmount}</h2>
            <span className="change-positive">+X% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>รอดำเนินการ</p>
            </div>
            <h2>{pendingCount}</h2>
            <span className="change-negative">-X% จากเดือนที่แล้ว</span>
          </div>
          <div className="card">
            <div className="card-header">
              <p>ล้มเหลว</p>
            </div>
            <h2>{failedCount}</h2>
            <span className="change-negative">-X% จากเดือนที่แล้ว</span>
          </div>
        </section>

        {/* ตารางรายการธุรกรรม */}
        <section className="all-transactions-section">
          <div className="section-header">
            <h3>ธุรกรรมทั้งหมด <span className="total-count">({totalCount} รายการ)</span></h3>
            <div className="table-controls">
              <input type="text" placeholder="ค้นหารหัสหรือโรงเรียน..." className="table-search-input" />
              <div className="sort-dropdown">
                <span className="sort-label">คอลัมน์นี้</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="sort-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                </svg>
              </div>
            </div>
          </div>
          <div className="table-container">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>รหัสธุรกรรม</th>
                  <th>รหัสคำขอ</th>
                  <th>โรงเรียน</th>
                  <th>ผู้บริจาค</th>
                  <th>จำนวนเงิน</th>
                  <th>สถานะ</th>
                  <th>วันที่</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td><input type="checkbox" /></td>
                    <td>{t.id}</td>
                    <td>{t.requestId}</td>
                    <td>{t.school}</td>
                    <td>{t.donor}</td>
                    <td>{t.amount}</td>
                    <td>
                      <span className={`status-tag ${
                        t.status === "สำเร็จ" ? "active" :
                        t.status === "รอดำเนินการ" ? "pending" :
                        "inactive"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.date}</td>
                    <td>
                      <button className="action-menu-btn">…</button>
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

export default TransactionsDashboard;
