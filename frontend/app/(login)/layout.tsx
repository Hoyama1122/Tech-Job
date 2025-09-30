import '@/styles/login.css';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` flex h-screen mx-auto justify-center items-center`}      >
  
        {children}
      </body>
    </html>
  );
}
