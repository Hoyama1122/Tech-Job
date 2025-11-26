

import NavbarExec from "@/components/Executive/NavbarExec";
import SidebarWrapper from "@/components/Executive/SidebarWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  
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
        <NavbarExec />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
