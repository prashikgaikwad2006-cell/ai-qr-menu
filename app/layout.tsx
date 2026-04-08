import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Digital QR Menu | Smart Digital Menu for Cafes & Restaurants",
  description: "Transform your cafe menu with AI-powered descriptions. Generate instant QR codes, attract customers with mouth-watering AI descriptions. Start free trial today!",
  keywords: ["digital menu", "QR menu", "cafe menu", "AI menu", "restaurant menu", "digital QR menu", "smart menu"],
  openGraph: {
    title: "AI Digital QR Menu | Smart Digital Menu for Cafes",
    description: "Transform your cafe menu with AI-powered descriptions. Generate instant QR codes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}