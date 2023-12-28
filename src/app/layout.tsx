"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { Toaster } from "react-hot-toast";
const mont = Montserrat({ subsets: ["latin"] });
// import globalRouter from "@/tools/globalRouter";
// import { useRouter } from "next/navigation";
import Footer from "@/components/Footer/page";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const router = useRouter();
  // globalRouter.navigate = router;
  return (
    <html lang="en">
      <head>
        <title>Movie Management</title>
      </head>
      <body className={`${mont.className} min-h-screen `}>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
          }}
        />
        <div className="main-ctn">
          <main className="main">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
