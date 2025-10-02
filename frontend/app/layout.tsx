import type { Metadata } from "next";
import "@/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import { Bounce, ToastContainer } from "react-toastify";
import ToastProvider from "@/components/ToastProvider";
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
    <html lang="en">
      <body >
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
