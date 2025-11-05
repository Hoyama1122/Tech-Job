"use client";
import NavbarSuper from "@/components/Supervisor/NavbarSuper";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";
import { CardWork } from "@/lib/Mock/CardWork";
import { TechnicianMock } from "@/lib/Mock/Technician";
import { AppLoader } from "@/store/AppLoader";
import { useAuthStore } from "@/store/useAuthStore";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setUser, setCardWork } = AppLoader();
  const { role, supervisorId } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  //  ตรวจ role
  useEffect(() => {
    if (!isReady) return;
    if (!role || role !== "supervisor") {
      redirect("/");
    }
  }, [isReady, role]);

  useEffect(() => {
    const savedUser = localStorage.getItem("Technician");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.setItem("Technician", JSON.stringify(TechnicianMock));
      setUser(TechnicianMock);
    }
  }, [setUser]);

  useEffect(() => {
    if (!isReady) return;
    if (!supervisorId) return;

    console.log("📦 โหลดใบงานสำหรับหัวหน้า:", supervisorId);

    try {
      const allWork = JSON.parse(localStorage.getItem("CardWork")) || [];

      const filtered = allWork.filter(
        (work) => Number(work.supervisorId) === Number(supervisorId)
      );
      // sync storage cardwork to cardworksupervisor
      const storageKey = `CardWork_supervisor_${supervisorId}`;
      localStorage.setItem(storageKey, JSON.stringify(filtered));

      // ✅ อัปเดต Zustand state
      setCardWork(filtered);
    } catch (error) {
      console.error("❌ โหลดข้อมูลใบงานไม่สำเร็จ:", error);
    }
  }, [isReady, supervisorId, setCardWork]);

  if (!isReady) return null;

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
