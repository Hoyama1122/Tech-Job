// app/layout.tsx หรือ RootLayout.tsx
import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/calendar.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import ToastProvider from "@/components/ToastProvider";

// ✅ โหลดฟอนต์ Sarabun จาก Google Fonts
const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun", 
});

export const metadata: Metadata = {
  title: {
    template: "%s | Tech Job",
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
    <html lang="th" className={sarabun.variable}>
      <body className="font-sans">
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
