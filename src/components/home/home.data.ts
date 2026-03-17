// src/components/home/home.data.ts
//
// Truly static content only — no product data lives here anymore.
// Products are fetched directly from the database in:
//   • HeroSection.tsx              → hero card + 2 mini cards
//   • FeaturedProductsSection.tsx  → carousel
//
// What belongs here: marketing copy, UI labels, static stats, and
// any data that does NOT exist in the database.

// ─── Stats ────────────────────────────────────────────────────────────────────
// Platform-level marketing numbers shown in the hero.

export const STATS = [
  { value: "2,400+", label: "Products Listed"  },
  { value: "180+",   label: "Trusted Brands"   },
  { value: "24hr",   label: "Quote Turnaround" },
  { value: "50+",    label: "Countries Served" },
];

// ─── Why Jocax features ───────────────────────────────────────────────────────

export const WHY_FEATURES = [
  { icon: "✓",  title: "Verified Specs",  text: "Every product spec is cross-checked against manufacturer data sheets." },
  { icon: "⚡", title: "Fast Quotes",     text: "Submit a quote request and receive pricing within 24 hours." },
  { icon: "🏭", title: "Bulk Orders",     text: "Volume pricing available for multi-unit and franchise operations." },
  { icon: "🔧", title: "Service Network", text: "Access to certified service technicians across all major regions." },
];

// ─── Brand display names ──────────────────────────────────────────────────────
// Used by the brand logo strip. Replace with a DB query once brand logos
// and display ordering are managed in the brands table.

export const BRANDS = [
  "Vulcan", "Hobart", "True", "Pitco",
  "Turbo Air", "Advance Tabco", "Manitowoc", "Blodgett",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(price: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency, maximumFractionDigits: 0,
  }).format(price);
}