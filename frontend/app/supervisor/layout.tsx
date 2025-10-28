"use client";
import NavbarSuper from "@/components/Supervisor/NavbarSuper";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";
import { TechnicianMock } from "@/lib/Mock/Technician";
import { useEffect, useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [User, setUser] = useState(TechnicianMock);

 
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.setItem("User", JSON.stringify(TechnicianMock));
    }
  }, []);

 
  useEffect(() => {
    localStorage.setItem("User", JSON.stringify(User));
  }, [User]);

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
