import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skyblock Finance Terminal",
  description: "Hypixel Skyblock Bazaar Analytics",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.className} antialiased`}>{children}</body>
    </html>
  );
}
