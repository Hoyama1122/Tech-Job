"use client";
import NavbarTech from "@/components/Technician/NavbarTech";
import SidebarWrapper from "@/components/Technician/SidebarWrapper";
import { CardWork } from "@/lib/Mock/Jobs";
import { Users } from "@/lib/Mock/UserMock";
import { AppLoader } from "@/store/AppLoader";
import React, { useEffect, useState } from "react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const { setCardWork, setUsers } = AppLoader();
  const [Noti, setNoti] = useState([]);
  // Loader Card
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
  // Loader User
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

  useEffect(() => {
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    const techId = Number(auth?.state?.userId);

    if (!techId) return;

    const users = JSON.parse(localStorage.getItem("Users") || "[]");
    const me = users.find((u: any) => u.id === techId);

    if (me?.notifications) {
      setNoti(me.notifications);
    }
  }, []);

  console.log(Noti);

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
        <NavbarTech Noti={Noti} />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
export default ClientLayout;