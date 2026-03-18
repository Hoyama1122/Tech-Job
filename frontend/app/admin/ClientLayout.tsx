"use client";

import React, { useEffect } from "react";
import SidebarWrapper from "@/components/Dashboard/SidebarWrapper";
import { AppLoader } from "@/store/AppLoader";
import Navbar from "@/components/Dashboard/Navbar";

import { Users } from "@/lib/Mock/UserMock";
import { CardWork } from "@/lib/Mock/Jobs";
import { useAuthStore } from "@/store/authStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchMe = useAuthStore((state) => state.fetchMe);
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);
 

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
