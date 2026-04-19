"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Dashboard/Navbar";
import SidebarWrapper from "@/components/Technician/SidebarWrapper";
import { authService } from "@/services/auth.service";

import { useAuthStore } from "@/store/useAuthStore";
import { useTechnicianTracking } from "@/hooks/useTechnicianTracking";
import { AlertCircle } from "lucide-react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, fetchMe, isLoading } = useAuthStore();
  const { error: locationError } = useTechnicianTracking(!!user);

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
        <main className="flex-1 overflow-y-auto p-3 md:p-4">
          {locationError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 shadow-sm border border-red-100">
              <AlertCircle size={18} />
              <span>
                <strong>ระบบติดตามตำแหน่ง:</strong> {locationError}
              </span>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}