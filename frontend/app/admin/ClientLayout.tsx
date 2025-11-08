"use client";

import React, { useEffect } from "react";
import SidebarWrapper from "@/components/Dashboard/SidebarWrapper";
import { AppLoader } from "@/store/AppLoader";
import Navbar from "@/components/Dashboard/Navbar";
import { CardWork } from "@/lib/Mock/CardWork";
import { TechnicianMock } from "@/lib/Mock/Technician";
import { Supervisor } from "@/lib/Mock/Supervisor";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setCardWork, setUser ,setsupervisor} = AppLoader();

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

  useEffect(() => {
    try {
      const savedTechnician = localStorage.getItem("Technician");
      if (savedTechnician) {
        setCardWork(JSON.parse(savedTechnician));
      } else {
        localStorage.setItem("Technician", JSON.stringify(TechnicianMock));
        setCardWork(TechnicianMock);
      }
    } catch (error) {
      console.error("โหลดข้อมูลใบงานไม่สำเร็จ", error);
    }
  }, [setUser]);
  
  useEffect(() => {
    try {
      const savedSupervisor = localStorage.getItem("Supervisor");
      if (savedSupervisor) {
        setsupervisor(JSON.parse(savedSupervisor));
      } else {
        localStorage.setItem("Supervisor", JSON.stringify(Supervisor));
        setsupervisor(Supervisor);
      }
    } catch (error) {
      console.error("โหลดข้อมูลใบงานไม่สำเร็จ", error);
    }
  }, [setsupervisor]);

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
