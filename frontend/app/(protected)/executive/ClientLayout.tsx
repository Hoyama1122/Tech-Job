"use client";

import React, { useEffect, useState } from "react";

import { authService } from "@/services/auth.service";

import { Users } from "@/lib/Mock/UserMock";
import { CardWork } from "@/lib/Mock/Jobs";
import NavbarExec from "@/components/Executive/NavbarExec";
import SidebarWrapperExc from "@/components/Executive/SidebarWrapperExc";

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
