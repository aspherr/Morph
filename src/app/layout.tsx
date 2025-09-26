import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import ClickSpark from '@/components/ClickSpark';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Morph",
  description: "File Conversion Web App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen flex flex-col bg-background text-foreground", geistSans.className, geistMono.className, inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          
          <Toaster />
      </body>
    </html>
  );
}
