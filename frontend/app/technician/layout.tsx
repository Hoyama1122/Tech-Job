import Navbar from "@/components/Technician/NavbarTechnician";
import SidebarWrapper from "@/components/Supervisor/SidebarWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex min-h-screen`}>
      <SidebarWrapper />
      <div className="flex-1 flex flex-col">
        <Navbar/>
        <main className="flex-1 p-6 bg-gray-200">{children}</main>
      </div>
    </div>
  );
}
