// src/app/layout.tsx

import type { Metadata } from "next";
import { Outfit, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { headers } from "next/headers";

// Body font — modern, clean, highly readable at all sizes
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Display/heading font — bold, condensed, industrial authority
const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jocax Solutions | Commercial Kitchen Equipment",
  description:
    "Professional-grade commercial kitchen equipment for restaurants, hotels, and food service operations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? headersList.get("x-invoke-path") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en">
      {/*
        suppressHydrationWarning on <body> silences the mismatch caused by
        browser extensions (e.g. Grammarly, LastPass, ColorZilla) that inject
        attributes like `cz-shortcut-listen` into the DOM after SSR but before
        React hydrates. This prop only suppresses warnings one level deep —
        it does NOT affect any children, so real hydration bugs elsewhere are
        still caught and reported normally.
      */}
      <body
        className={`${outfit.variable} ${oswald.variable} antialiased`}
        suppressHydrationWarning
      >
        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
        {/* WhatsApp float — hidden on /admin, visible on all public pages */}
        {!isAdmin && <WhatsAppButton />}
      </body>
    </html>
  );
}