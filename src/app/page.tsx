// src/app/page.tsx
// Home page — composed entirely from section components.
// Each section lives in src/components/home/ and can be edited independently.

import type { Metadata } from "next";
import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  BrandsSection,
  WhyJocaxSection,
} from "@/components/home";

export const metadata: Metadata = {
  title: "Commercial Kitchen Equipment Kenya | Jocax Solutions Limited",
  description:
    "Shop professional commercial kitchen equipment in Kenya — ovens, fryers, refrigeration, grills, and more. Trusted by restaurants, hotels, and caterers across Nairobi.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Commercial Kitchen Equipment Kenya | Jocax Solutions Limited",
    description: "Shop professional commercial kitchen equipment in Kenya — ovens, fryers, refrigeration, grills, and more.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      <main id="main-content">
        <HeroSection />
        <CategoriesSection />
        <FeaturedProductsSection />
        <BrandsSection />
        <WhyJocaxSection />

      </main>
    </>
  );
}