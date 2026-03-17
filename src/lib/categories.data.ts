// src/lib/categories.data.ts
//
// ✦ SINGLE SOURCE OF TRUTH for all category data across the entire app.
//
// Every place that renders categories imports from here:
//   - src/components/home/CategoriesSection.tsx
//   - src/app/categories/page.tsx
//   - src/app/categories/[slug]/page.tsx
//   - src/components/layout/Header.tsx  (dropdown)
//   - src/app/search/page.tsx           (filter chips)
//
// When you wire up a real DB, replace getCategoryBySlug() and CATEGORIES
// with async Prisma calls — nothing else needs to change.

export interface Category {
  id:          string;
  name:        string;
  slug:        string;
  icon:        string;
  count:       number;                // product count (static until DB wired)
  description: string;               // used on category landing page
  heroImage:   string;               // Unsplash URL for hero banner
  color:       string;               // accent color for visual variation
  subcategories?: Subcategory[];
}

export interface Subcategory {
  name:  string;
  slug:  string;                     // used as ?subcategory= query on products page
  count: number;
}

// ─── Master list ──────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  {
    id:          "c1",
    name:        "Ovens & Ranges",
    slug:        "ovens-ranges",
    icon:        "🔥",
    count:       142,
    color:       "#e8a020",
    description: "Commercial convection ovens, deck ovens, combi ovens, and full gas ranges engineered for high-volume kitchens. From countertop units to full double-deck floor models.",
    heroImage:   "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
    subcategories: [
      { name: "Convection Ovens",  slug: "convection-ovens",  count: 48 },
      { name: "Deck Ovens",        slug: "deck-ovens",        count: 22 },
      { name: "Combi Ovens",       slug: "combi-ovens",       count: 18 },
      { name: "Conveyor Ovens",    slug: "conveyor-ovens",    count: 14 },
      { name: "Gas Ranges",        slug: "gas-ranges",        count: 40 },
    ],
  },
  {
    id:          "c2",
    name:        "Refrigeration",
    slug:        "refrigeration",
    icon:        "❄️",
    count:       98,
    color:       "#60a5fa",
    description: "Reach-in refrigerators, walk-in coolers, undercounter units, and prep-top refrigeration. Energy Star certified options available across all sizes.",
    heroImage:   "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200&q=80",
    subcategories: [
      { name: "Reach-In Refrigerators", slug: "reach-in-refrigerators", count: 32 },
      { name: "Reach-In Freezers",      slug: "reach-in-freezers",      count: 18 },
      { name: "Undercounter Units",     slug: "undercounter-units",      count: 24 },
      { name: "Prep Top Units",         slug: "prep-top-units",          count: 14 },
      { name: "Back Bar Coolers",       slug: "back-bar-coolers",        count: 10 },
    ],
  },
  {
    id:          "c3",
    name:        "Fryers",
    slug:        "fryers",
    icon:        "🫕",
    count:       64,
    color:       "#f97316",
    description: "Gas and electric commercial fryers from countertop to floor models. High-output millivolt controls, split-pot configurations, and filtration systems.",
    heroImage:   "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1200&q=80",
    subcategories: [
      { name: "Floor Fryers",        slug: "floor-fryers",        count: 28 },
      { name: "Countertop Fryers",   slug: "countertop-fryers",   count: 16 },
      { name: "Pressure Fryers",     slug: "pressure-fryers",     count: 8  },
      { name: "Split-Pot Fryers",    slug: "split-pot-fryers",    count: 12 },
    ],
  },
  {
    id:          "c4",
    name:        "Prep Tables",
    slug:        "prep-tables",
    icon:        "🔪",
    count:       87,
    color:       "#a78bfa",
    description: "Stainless steel prep tables, work benches, and chef bases in standard and custom lengths. NSF certified, with undershelf and marine-edge options.",
    heroImage:   "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1200&q=80",
    subcategories: [
      { name: "Work Tables",          slug: "work-tables",          count: 34 },
      { name: "Chef Bases",           slug: "chef-bases",           count: 18 },
      { name: "Refrigerated Prep",    slug: "refrigerated-prep",    count: 22 },
      { name: "Poly Top Tables",      slug: "poly-top-tables",      count: 13 },
    ],
  },
  {
    id:          "c5",
    name:        "Warewashing",
    slug:        "warewashing",
    icon:        "💧",
    count:       45,
    color:       "#34d399",
    description: "Undercounter, door-type, and conveyor dishwashers for operations of every scale. ENERGY STAR units with built-in booster heaters and auto-fill.",
    heroImage:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    subcategories: [
      { name: "Undercounter Dishwashers", slug: "undercounter-dishwashers", count: 16 },
      { name: "Door-Type Dishwashers",    slug: "door-type-dishwashers",    count: 14 },
      { name: "Conveyor Dishwashers",     slug: "conveyor-dishwashers",     count: 9  },
      { name: "Glass Washers",            slug: "glass-washers",            count: 6  },
    ],
  },
  {
    id:          "c6",
    name:        "Ventilation",
    slug:        "ventilation",
    icon:        "💨",
    count:       53,
    color:       "#94a3b8",
    description: "Commercial exhaust hoods, make-up air units, and ventilation fans. UL-Listed Type I and Type II hoods for all cooking equipment configurations.",
    heroImage:   "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=1200&q=80",
    subcategories: [
      { name: "Type I Hoods",       slug: "type-i-hoods",       count: 22 },
      { name: "Type II Hoods",      slug: "type-ii-hoods",      count: 14 },
      { name: "Make-Up Air Units",  slug: "make-up-air-units",  count: 10 },
      { name: "Exhaust Fans",       slug: "exhaust-fans",       count: 7  },
    ],
  },
  {
    id:          "c7",
    name:        "Food Warmers",
    slug:        "food-warmers",
    icon:        "♨️",
    count:       39,
    color:       "#fb923c",
    description: "Steam tables, heat lamps, holding cabinets, and soup kettles to keep food at safe serving temperatures throughout service.",
    heroImage:   "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&q=80",
    subcategories: [
      { name: "Steam Tables",       slug: "steam-tables",       count: 14 },
      { name: "Holding Cabinets",   slug: "holding-cabinets",   count: 12 },
      { name: "Heat Lamps",         slug: "heat-lamps",         count: 8  },
      { name: "Soup Kettles",       slug: "soup-kettles",       count: 5  },
    ],
  },
  {
    id:          "c8",
    name:        "Ice Machines",
    slug:        "ice-machines",
    icon:        "🧊",
    count:       31,
    color:       "#7dd3fc",
    description: "Modular ice makers, undercounter ice machines, and combination ice-and-water dispensers. Available in cube, nugget, and flake ice types.",
    heroImage:   "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1200&q=80",
    subcategories: [
      { name: "Modular Ice Makers",    slug: "modular-ice-makers",    count: 12 },
      { name: "Undercounter Ice",      slug: "undercounter-ice",      count: 10 },
      { name: "Nugget Ice Machines",   slug: "nugget-ice-machines",   count: 5  },
      { name: "Ice Dispensers",        slug: "ice-dispensers",        count: 4  },
    ],
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}