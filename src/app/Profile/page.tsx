"use client";

import React from "react";
import Nav from "@/components/nav/nav";

import Footer from "@/components/footer/footer";
import ProfileScreen from "./ProfileScreen"; // อยู่ในโฟลเดอร์เดียวกัน

export default function ProfilePage() {
  return (
    <div>
      <Nav />

      <ProfileScreen />

      <Footer />
    </div>
  );
}
