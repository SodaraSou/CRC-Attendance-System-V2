import type { Metadata } from "next";
import { Noto_Sans_Khmer } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Noto_Sans_Khmer({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRC Attendance System V2",
  description: "An Attendance System For CRC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <>{children}</>
        <Toaster />
      </body>
    </html>
  );
}
