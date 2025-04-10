'use client';

import React, { useEffect, useState } from 'react';
import './ProfileScreen.css';

export default function ProfileScreen() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    interests: [] as string[],
  });

  const donationOptions = [
    'หนังสือเรียน',
    'อุปกรณ์กีฬา',
    'อุปกรณ์วิทยาศาสตร์',
    'ทุนการศึกษา',
    'คอมพิวเตอร์และอุปกรณ์ไอที',
    'อุปกรณ์ศิลปะ',
    'เครื่องดนตรี',
    'แก้ปัญหาจากการเรียน',
  ];

  // 🟦 โหลดข้อมูลจาก backend
  useEffect(() => {
    fetch('/api/user') // Endpoint ดึงข้อมูลผู้ใช้
      .then((res) => res.json())
      .then((data) => {
        setForm({
          username: data.username || '',
          email: data.email || '',
          firstName: data.fname || '',
          lastName: data.lname || '',
          phone: data.phone || '',
          interests: data.interests || [],
        });
      });
  }, []);

  const toggleInterest = (item: string) => {
    setForm((prev) => ({
      ...prev,
      interests: prev.interests.includes(item)
        ? prev.interests.filter((i) => i !== item)
        : [...prev.interests, item],
    }));
  };

  return (
    <>


      <div className="profile-page-container min-h-screen bg-gray-50 p-4 flex justify-center items-center relative">
        {/* ปุ่มย้อนกลับ */}
        <button
          type="button"
          className="absolute top-4 left-4 ghost"
          onClick={() => history.back()}
        >
          <svg
            className="arrow-left"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* การ์ดฟอร์ม */}
        <div className="card w-full max-w-4xl p-8">
          <h2 className="text-2xl font-bold mb-1">โปรไฟล์ของฉัน</h2>
          <p className="text-gray-500 mb-6">
            แก้ไขข้อมูลส่วนตัวและความสนใจในการบริจาคให้กับโรงเรียน
          </p>

          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gray-200" />
              <button className="text-sm text-blue-600 mt-2 hover:underline">
                เปลี่ยนรูปโปรไฟล์
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1 font-medium">ชื่อบัญชี</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">อีเมล</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">ชื่อ</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">นามสกุล</label>
              <input
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-medium">เบอร์โทรศัพท์</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-2">ความสนใจในการบริจาค</h3>
            <p className="text-sm text-gray-500 mb-4">เลือกประเภทการบริจาคที่คุณสนใจ</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {donationOptions.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.interests.includes(item)}
                    onChange={() => toggleInterest(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <button
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
              onClick={() => alert('บันทึกข้อมูลสำเร็จ')}
            >
              บันทึกข้อมูล
            </button>
            
          </div>
        </div>
      </div>

    </>
  );
}
