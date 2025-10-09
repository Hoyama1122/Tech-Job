import type { Metadata } from "next";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";

import SidebarWrapper from "@/components/Dashboard/SidebarWrapper";
import Navbar from "@/components/Navbar";

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
    <div className={`flex min-h-screen`}>
      <SidebarWrapper />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
