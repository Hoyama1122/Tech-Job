import type { Metadata } from "next";
import { Anuphan } from "next/font/google";
import "@/styles/globals.css";
import "@/styles/calendar.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import ToastProvider from "@/components/ToastProvider";
import ChatWidget from "@/components/chat/ChatWidget";

const anuphan = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-anuphan",
  display: "swap",
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
    <html lang="th" className={`${anuphan.variable}`}>
      <body className="font-sans antialiased text-text bg-bg selection:bg-accent/20">
        {children}
        <ToastProvider />
        <ChatWidget />
      </body>
    </html>
  );
}
