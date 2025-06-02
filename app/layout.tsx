"use client";
import React from "react";
import { Inter } from "next/font/google";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ThemeProvider } from "../components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next"; // Import Speed Insights
import "./globals.css";
import { usePathname } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {(pathname !== '/login' && pathname !== '/register' && pathname !== '/activationmessage') && <Header />}
          
          <main>{children}</main>

          {(pathname !== '/login' && pathname !== '/register' && pathname !== '/activationmessage') && <Footer />}
        </ThemeProvider>

        {/* Integrate Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}