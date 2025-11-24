import NavbarSuper from "@/components/Supervisor/NavbarSuper";
import NavbarTech from "@/components/Technician/NavbarTech";

import SidebarWrapper from "@/components/Technician/SidebarWrapper";
import ClientLayout from "./ClientLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
     <ClientLayout>{children}</ClientLayout>
  );
}
