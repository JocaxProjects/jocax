// src/components/home/BrandsSection.tsx
// Horizontally-wrapped pill links for each trusted brand.

import Link from "next/link";
import { BRANDS } from "./home.data";

export default function BrandsSection() {
  return (
    <section
      aria-labelledby="brands-heading"
      style={{
        background:   "var(--color-steel)",
        paddingBlock: "var(--space-16)",
      }}
    >
      <div className="container">
        <p
          id="brands-heading"
          className="eyebrow"
          style={{
            textAlign:    "center",
            color:        "var(--color-text-muted)",
            marginBottom: "var(--space-10)",
          }}
        >
          Trusted Equipment Brands
        </p>
        <div
          role="list"
          style={{
            display:        "flex",
            flexWrap:       "wrap",
            justifyContent: "center",
            gap:            "var(--space-4)",
          }}
        >
          {BRANDS.map((brand) => (
            <Link
              key={brand}
              href={`/products?brand=${brand.toLowerCase().replace(/\s+/g, "-")}`}
              role="listitem"
              style={{
                background:    "rgba(255,255,255,.05)",
                border:        "1px solid var(--color-border-dark)",
                borderRadius:  "var(--radius-md)",
                padding:       "0.75rem 1.75rem",
                fontFamily:    "var(--font-display)",
                fontWeight:    700,
                fontSize:      "var(--text-md)",
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
                color:         "var(--color-text-faint)",
                textDecoration:"none",
                transition:    "background var(--transition-base), border-color var(--transition-base), color var(--transition-base)",
              }}
            >
              {brand}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}