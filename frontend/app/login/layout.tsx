import "@/styles/login.css";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`flex h-screen mx-auto justify-center items-center`}>
      {children}
    </div>
  );
}
