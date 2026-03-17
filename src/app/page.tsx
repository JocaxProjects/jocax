// src/app/page.tsx
// Home page — composed entirely from section components.
// Each section lives in src/components/home/ and can be edited independently.

import {
  HeroSection,
  CategoriesSection,
  FeaturedProductsSection,
  BrandsSection,
  WhyJocaxSection,

} from "@/components/home";

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