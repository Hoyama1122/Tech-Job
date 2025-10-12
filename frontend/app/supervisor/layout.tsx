import NavbarSuper from "@/components/Supervisor/NavbarSuper";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-primary">
      {/* ✅ Sidebar อยู่ซ้ายแบบสูงเต็มจอ */}
      <SidebarWrapper />

      {/* ✅ Content ด้านขวา */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2] min-h-screen">
        <NavbarSuper />
        <main className="flex-1 p-2 lg:p-4 overflow-y-auto">{children}</main>
      </div>
      
    </div>
  );
}
