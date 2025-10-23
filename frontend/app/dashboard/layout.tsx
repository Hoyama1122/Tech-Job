import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

import SidebarWrapper from "@/components/Dashboard/SidebarWrapper";
import Navbar from "@/components/Dashboard/Navbar";

export const metadata: Metadata = {
  title: {
    template: "%s | Dashboard",
    default: APP_NAME,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`min-h-screen bg-primary`}>
      <SidebarWrapper />
      <div
        className="  flex flex-col 
          min-h-screen 
          bg-gradient-to-br from-[#e1e5ee] via-[#F4F6FB] to-[#DCE3F2]
          transition-all duration-300
          lg:ml-64  "
      >
        <Navbar />
        <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
