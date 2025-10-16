import FCLProvider from "@/components/providers/fcl-provider";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartLend - AI-Powered Lending on Flow",
  description:
    "Revolutionary DeFi lending protocol with AI-driven credit scoring and onchain verification on Flow blockchain",
  keywords: [
    "DeFi",
    "lending",
    "AI",
    "credit scoring",
    "Flow blockchain",
    "smart contracts",
  ],
  authors: [{ name: "SmartLend Team" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "SmartLend - AI-Powered Lending on Flow",
    description:
      "Borrow with reduced collateral through intelligent trust scoring",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLend - AI-Powered Lending on Flow",
    description:
      "Borrow with reduced collateral through intelligent trust scoring",
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
        className={`${bricolage.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <FCLProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "rgba(31, 41, 55, 0.95)",
                color: "#fff",
                border: "1px solid rgba(75, 85, 99, 0.3)",
                backdropFilter: "blur(8px)",
              },
            }}
          />
        </FCLProvider>
      </body>
    </html>
  );
}
