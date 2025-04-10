// src/app/admin/dashboard/page.tsx
"use client";

import React from "react";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import AdminDashboard from "./AdminDashboard"; // component หลัก

export default function AdminDashboardPage() {
  return (
    <div>
        
      <AdminDashboard />
        <Footer />
    </div>
  );
}
