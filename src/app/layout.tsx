import type { Metadata } from "next";
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import "./globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  preload: false
})

export const metadata: Metadata = {
  title: "Morph",
  description: "File Conversion Web App",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180" }
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn("min-h-screen flex flex-col bg-background text-foreground", inter.className)}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
          
          <Toaster />
      </body>
    </html>
  );
}
