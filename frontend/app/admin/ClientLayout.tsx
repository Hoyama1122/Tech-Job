"use client";

import React, { useEffect } from "react";
import SidebarWrapper from "@/components/Dashboard/SidebarWrapper";
import { AppLoader } from "@/store/AppLoader";
import Navbar from "@/components/Dashboard/Navbar";
import { CardWork } from "@/lib/Mock/CardWork";
import { Users } from "@/lib/Mock/UserMock";


export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCardWork, setUsers ,} = AppLoader();

  // Loader
  useEffect(() => {
    try {
      const savedWork = localStorage.getItem("CardWork");
      if (savedWork) {
        setCardWork(JSON.parse(savedWork));
      } else {
        localStorage.setItem("CardWork", JSON.stringify(CardWork));
        setCardWork(CardWork);
      }
    } catch (error) {
      console.error("โหลดข้อมูลใบงานไม่สำเร็จ", error);
    }
  }, [setCardWork]);
  // Loader
  useEffect(() => {
    try {
      const users = localStorage.getItem("Users");
      if (users) {
        setUsers(JSON.parse(users));
      } else {
        localStorage.setItem("Users", JSON.stringify(Users));
        setUsers(Users);
      }
    } catch (error) {
      console.error("โหลดข้อมูลใบงานไม่สำเร็จ", error);
    }
  }, [setUsers]);

  

  return (
    <div className={`min-h-screen bg-primary`}>
      <SidebarWrapper />
      <div
        className="  flex flex-col 
          min-h-screen 
          bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2]
          transition-all duration-300
          lg:ml-64  "
      >
        <Navbar />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
