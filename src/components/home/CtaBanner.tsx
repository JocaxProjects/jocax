// src/components/home/CtaBanner.tsx
// Full-width amber call-to-action strip — "Ready to Equip Your Kitchen?"

import Link from "next/link";

export default function CtaBanner() {
  return (
    <section
      aria-label="Get a quote"
      style={{
        background:   "var(--color-amber)",
        paddingBlock: "var(--space-16)",
      }}
    >
      <div
        className="container"
        style={{
          display:        "flex",
          alignItems:     "center",
          justifyContent: "space-between",
          gap:            "var(--space-8)",
          flexWrap:       "wrap",
        }}
      >
        <div>
          <h2 style={{ color: "var(--color-ink)" }}>
            Ready to Equip Your Kitchen?
          </h2>
          <p
            style={{
              color:      "rgba(13,13,13,.65)",
              marginTop:  "var(--space-2)",
              fontWeight: 400,
              maxWidth:   "none",
            }}
          >
            Talk to our equipment specialists — no obligation, just expert advice.
          </p>
        </div>
        <Link href="/contact" className="btn btn-secondary btn-lg">
          Request a Quote →
        </Link>
      </div>
    </section>
  );
}