import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ResearchBanner from "@/components/ResearchBanner";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Texas Peptides — Austin · Research-grade peptides, shipped same-day.",
  description:
    "Research-grade peptides shipped from Austin. Same-day USPS Priority nationwide. Pay before 2 PM CT, out the door today.",
  metadataBase: new URL("https://texaspeptides.example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen bg-bg font-sans text-bone antialiased">
        <ResearchBanner />
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
