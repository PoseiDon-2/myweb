// src/app/admin/transactions/page.tsx
"use client";

import React from "react";
import Nav from "@/components/nav/nav";
import Footer from "@/components/footer/footer";
import TransactionsDashboard from "./TransactionsDashboard";

export default function TransactionsPage() {
  return (
    <>

      <TransactionsDashboard />
      <Footer />
    </>
  );
}
