"use client"
import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css"

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

  // Removed metadata export as it is not compatible with client components


import { usePathname } from "next/navigation";




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
          {(pathname !== '/login' && pathname !== '/register' && pathname !=='/registrationbio') && <Header/>}


          <main>{children}</main>
          {(pathname !== '/login' && pathname !== '/register' && pathname !=='/registrationbio') && <Footer />}


        </ThemeProvider>
      </body>
    </html>
  );
}
