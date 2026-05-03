import type { Metadata } from "next";
import { Inter, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Texas Peptides | Premium Research Peptides — Austin, TX",
  description:
    "Texas Peptides is Austin's premier supplier of high-purity research peptides. Serving all of Texas with lab-grade compounds for scientific research. Not for human use.",
  keywords: [
    "research peptides",
    "peptides Texas",
    "Austin peptides",
    "lab-grade peptides",
    "Texas Peptides",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bodoniModa.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
