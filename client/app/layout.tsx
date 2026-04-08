import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Startup Validator",
  description: "Validate Your Startup Ideas with AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-slate-100 overflow-x-hidden">
        {/* Subtle background gradient mesh effect */}
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 mt-16 md:mt-24">
          {children}
        </main>
      </body>
    </html>
  );
}
