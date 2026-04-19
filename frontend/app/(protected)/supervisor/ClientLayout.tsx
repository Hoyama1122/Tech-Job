"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Dashboard/Navbar";
import { authService } from "@/services/auth.service";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";

import { useAuthStore } from "@/store/useAuthStore";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  const isLoading = useAuthStore((state) => state.isLoading);

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
    <div className="min-h-screen bg-primary">
      <SidebarWrapper />
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2] transition-all duration-300 lg:ml-64">
        <Navbar user={user} />
        <main className="flex-1 overflow-y-auto p-3 md:p-4">{children}</main>
      </div>
    </div>
  );
}
