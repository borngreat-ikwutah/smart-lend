import FCLProvider from "@/components/FCLProvider";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

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
        className={`${bricolage.className} bg-gradient-to-r from-[#0A0C14] via-[#1A1F2C] to-[#0A0C14]`}
      >
        <FCLProvider>
          {children}
        </FCLProvider>
      </body>
    </html>
  );
}
