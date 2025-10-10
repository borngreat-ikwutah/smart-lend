import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FCLProvider from "@/components/FCLProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartLend - AI-Powered Lending on Flow",
  description: "Revolutionary DeFi lending protocol with AI-driven credit scoring and onchain verification on Flow blockchain",
  keywords: ["DeFi", "lending", "AI", "credit scoring", "Flow blockchain", "smart contracts"],
  authors: [{ name: "SmartLend Team" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "SmartLend - AI-Powered Lending on Flow",
    description: "Borrow with reduced collateral through intelligent trust scoring",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLend - AI-Powered Lending on Flow",
    description: "Borrow with reduced collateral through intelligent trust scoring",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FCLProvider>
          {children}
        </FCLProvider>
      </body>
    </html>
  );
}
