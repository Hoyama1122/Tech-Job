"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/Dashboard/Navbar";
import { authService } from "@/services/auth.service";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";

type UserRole =
  | "ADMIN"
  | "SUPERVISOR"
  | "TECHNICIAN"
  | "EXECUTIVE"
  | "SUPERADMIN";

type AuthUser = {
  id: number;
  email: string;
  empno?: string;
  role: UserRole;
  departmentId?: number | null;
  profile?: {
    firstname?: string | null;
    lastname?: string | null;
    avatar?: string | null;
    phone?: string | null;
  } | null;
};

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await authService.me();
        setUser(res.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, []);

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
