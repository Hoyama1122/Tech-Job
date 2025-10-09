import Navbar from "@/components/Navbar";
import SidebarWrapper from "@/components/Technician/SidebarWrapper";

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
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
}
