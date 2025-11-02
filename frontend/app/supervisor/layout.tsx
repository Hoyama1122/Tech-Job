"use client";
import NavbarSuper from "@/components/Supervisor/NavbarSuper";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";
import { CardWork } from "@/lib/Mock/CardWork";
import { TechnicianMock } from "@/lib/Mock/Technician";

import { AppLoader } from "@/store/AppLoader";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser, setCardWork } = AppLoader();
  useEffect(() => {
    const savedUser = localStorage.getItem("User");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.setItem("User", JSON.stringify(TechnicianMock));
      setUser(TechnicianMock);
    }
  }, [setUser]);

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
      console.error("โหลดข้อมูลใบงานไม่สำเร็จ:", error);
    }
  }, [setCardWork]);
  return (
    <div className="min-h-screen bg-primary">
      <SidebarWrapper />
      <div
        className="
          flex flex-col 
          min-h-screen 
          bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2]
          transition-all duration-300
          lg:ml-64 
        "
      >
        <NavbarSuper />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
