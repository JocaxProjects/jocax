// src/app/layout.tsx

import type { Metadata } from "next";
import { Outfit, Oswald } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { headers } from "next/headers";

// Always use the custom domain — never the Vercel deployment URL.
// Set NEXT_PUBLIC_SITE_URL=https://www.jocaxsolutions.co.ke in Vercel env vars.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jocaxsolutions.co.ke";
// Ensure the URL always has a protocol — guards against env vars set without https://
const SITE_URL = (
  rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`
).replace(/\/+$/, "");

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
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Jocax Solutions Limited | Commercial Kitchen Equipment Kenya",
    template: "%s | Jocax Solutions Limited",
  },
  description:
    "Kenya's leading supplier of professional-grade commercial kitchen equipment for restaurants, hotels, and food service operations. Shop ovens, fryers, refrigeration, and more.",

  keywords: [
    "commercial kitchen equipment Kenya",
    "restaurant equipment Nairobi",
    "hotel kitchen equipment",
    "catering equipment Kenya",
    "commercial ovens Kenya",
    "industrial refrigeration Kenya",
    "food service equipment",
    "Jocax Solutions Limited",
  ],

  authors: [{ name: "Jocax Solutions Limited", url: SITE_URL }],
  creator: "Jocax Solutions Limited",
  publisher: "Jocax Solutions Limited",

  // Canonical URL — prevents duplicate-content penalties
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_KE",
    url: SITE_URL,
    siteName: "Jocax Solutions Limited",
    title: "Jocax Solutions Limited | Commercial Kitchen Equipment Kenya",
    description: "Kenya's leading supplier of professional-grade commercial kitchen equipment for restaurants, hotels, and food service operations.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Jocax Solutions Limited Logo",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jocax Solutions Limited | Commercial Kitchen Equipment Kenya",
    description: "Kenya's leading supplier of professional-grade commercial kitchen equipment.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    // Add your Google Search Console verification token here once you have it:
    // google: "YOUR_GOOGLE_VERIFICATION_TOKEN",
  },
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
        {/* Organization structured data — helps Google understand the business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Jocax Solutions Limited",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.png`,
              description:
                "Kenya's leading supplier of professional-grade commercial kitchen equipment for restaurants, hotels, and food service operations.",
              address: {
                "@type": "PostalAddress",
                addressCountry: "KE",
                addressLocality: "Nairobi",
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                availableLanguage: ["English"],
              },
              sameAs: [],
            }),
          }}
        />
        {!isAdmin && <Header />}
        {children}
        {!isAdmin && <Footer />}
        {/* WhatsApp float — hidden on /admin, visible on all public pages */}
        {!isAdmin && <WhatsAppButton />}
      </body>
    </html>
  );
}