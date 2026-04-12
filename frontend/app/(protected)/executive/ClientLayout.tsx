"use client";

import React, { useEffect, useState } from "react";

import { authService } from "@/services/auth.service";

import { Users } from "@/lib/Mock/UserMock";
import { CardWork } from "@/lib/Mock/Jobs";
import NavbarExec from "@/components/Executive/NavbarExec";
import SidebarWrapperExc from "@/components/Executive/SidebarWrapperExc";

import { useAuthStore } from "@/store/useAuthStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchMe, isLoading } = useAuthStore();

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  if (isLoading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-primary`}>
      <SidebarWrapperExc />
      <div
        className="  flex flex-col 
          min-h-screen 
          bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2]
          transition-all duration-300
          lg:ml-64  "
      >
        <NavbarExec />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
