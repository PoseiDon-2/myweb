import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./ReportsDashboard.css";

type SavedReport = {
  id: number;
  name: string;
};

type SchoolData = { school: string; amount: number };
const schoolData: SchoolData[] = [
  { school: "โรงเรียนบ้านหนองแสง", amount: 320000 },
  { school: "โรงเรียนวัดโพธิ์งาม",   amount: 280000 },
  { school: "โรงเรียนบ้านหนองไผ",   amount: 240000 },
  { school: "โรงเรียนบ้านมะไฟ",    amount: 200000 },
  { school: "โรงเรียนวังสะพาน",     amount: 160000 },
  { school: "โรงเรียนบ้านดอนแดง",  amount: 140000 },
  { school: "โรงเรียนบ้านนาคำปา",  amount: 120000 },
  { school: "โรงเรียนวัดสระเกษ",   amount:  90000 },
  { school: "โรงเรียนบ้านคำแคน",   amount:  80000 },
  { school: "โรงเรียนบ้านหนองขาม", amount:  60000 },
];

type RegionData = { name: string; value: number };
const regionData: RegionData[] = [
  { name: "ภาคกลาง",    value: 31 },
  { name: "ภาคเหนือ",    value: 17 },
  { name: "ภาคอีสาน",    value: 24 },
  { name: "ภาคใต้",      value: 13 },
  { name: "ภาคตะวันออก", value:  9 },
  { name: "ภาคตะวันตก",  value:  6 },
];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#6699CC"];

const ReportsDashboard: React.FC = () => {
  const reportTypes = [
    { value: "summary", label: "รายงานการบริจาค" },
    { value: "monthly", label: "รายงานประจำเดือน" },
    { value: "yearly",  label: "รายงานประจำปี" },
  ];
  const periods = [
    { value: "7",  label: "7 วันที่ผ่านมา" },
    { value: "30", label: "30 วันที่ผ่านมา" },
    { value: "90", label: "90 วันที่ผ่านมา" },
  ];

  const [reportType, setReportType] = useState("summary");
  const [period,     setPeriod]     = useState("30");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");
  const [activeTab,  setActiveTab]  = useState<"overview" | "school" | "region">("overview");

  const savedReports: SavedReport[] = [
    { id: 1, name: "รายงานประจำเดือน ม.ค. 2566" },
    { id: 2, name: "รายงานประจำไตรมาส 4/2565" },
    { id: 3, name: "รายงานประจำปี 2565" },
  ];

  const stats = {
    totalAmount: "฿2,350,456",
    donors: 419,
    schools: 142,
    average: "฿5,609",
  };

  const applyFilter = () => {
    // TODO: ดึงข้อมูลตาม filter ที่เลือก
    console.log({ reportType, period, startDate, endDate });
  };

  return (
    <div className="reports-dashboard">
      {/* Nav Bar */}
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
          <button className="nav-search-button">🔍</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Header + Export */}
        <header className="page-header">
          <h1 className="page-title">รายงาน</h1>
          <button className="export-btn">ส่งออกรายงาน</button>
        </header>

        <div className="reports-container">
          {/* Left Filter Panel */}
          <aside className="filter-panel">
            <h4>ตัวกรองรายงาน</h4>
            <label>ประเภทรายงาน</label>
            <select value={reportType} onChange={e => setReportType(e.target.value)}>
              {reportTypes.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>

            <label>ช่วงเวลา</label>
            <select value={period} onChange={e => setPeriod(e.target.value)}>
              {periods.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>

            <label>วันที่เริ่มต้น</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />

            <label>วันที่สิ้นสุด</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />

            <button className="filter-btn" onClick={applyFilter}>กรองข้อมูล</button>

            <h4>รายงานที่บันทึกไว้</h4>
            <ul className="saved-list">
              {savedReports.map(r => (
                <li key={r.id}>
                  <span>{r.name}</span>
                  <button className="download-btn">⬇️</button>
                </li>
              ))}
            </ul>
          </aside>

          {/* Main Content */}
          <main className="main-panel">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >ภาพรวม</button>
              <button
                className={`tab ${activeTab === "school" ? "active" : ""}`}
                onClick={() => setActiveTab("school")}
              >ตามโรงเรียน</button>
              <button
                className={`tab ${activeTab === "region" ? "active" : ""}`}
                onClick={() => setActiveTab("region")}
              >ตามภูมิภาค</button>
            </div>

            <div className="chart-container">
              {activeTab === "overview" && (
                <div className="chart-placeholder">[กราฟแท่งแสดงภาพรวมการบริจาค]</div>
              )}
              {activeTab === "school" && (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={schoolData}
                    layout="vertical"
                    margin={{ top: 20, right: 20, left: 80, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={val => `฿${(val/1000).toLocaleString()}k`} />
                    <YAxis dataKey="school" type="category" width={150} />
                    <Tooltip formatter={(value: number) => `฿${value.toLocaleString()}`} />
                    <Bar dataKey="amount" fill="#333" />
                  </BarChart>
                </ResponsiveContainer>
              )}
              {activeTab === "region" && (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={regionData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={entry => `${entry.name} ${entry.value}%`}
                    >
                      {regionData.map((_, idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend layout="horizontal" verticalAlign="bottom" />
                    <Tooltip formatter={(value: number, name: string) => [`${value}%`, name]} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="stat-cards">
              <div className="card">
                <p>ยอดบริจาคทั้งหมด</p>
                <h2>{stats.totalAmount}</h2>
                <span className="change-positive">+20.1% จากเดือนเดียวกันปีก่อน</span>
              </div>
              <div className="card">
                <p>จำนวนผู้บริจาค</p>
                <h2>{stats.donors}</h2>
                <span className="change-positive">+15.3% จากเดือนเดียวกันปีก่อน</span>
              </div>
              <div className="card">
                <p>จำนวนโรงเรียนที่ได้รับบริจาค</p>
                <h2>{stats.schools}</h2>
                <span className="change-positive">+5.2% จากเดือนเดียวกันปีก่อน</span>
              </div>
              <div className="card">
                <p>ยอดบริจาคเฉลี่ยต่อครั้ง</p>
                <h2>{stats.average}</h2>
                <span className="change-positive">+3.2% จากเดือนเดียวกันปีก่อน</span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
