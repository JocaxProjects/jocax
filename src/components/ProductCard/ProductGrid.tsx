"use client";

import { useState } from "react";
import ProductCard from "./index";
import type { ProductListItem } from "@/types";
import type { ProductCardVariant } from "./index";

export type GridView = "grid" | "list";

export interface ProductGridProps {
  products:       ProductListItem[];
  showToggle?:    boolean;
  defaultView?:   GridView;
  columns?:       2 | 3 | 4;
  loading?:       boolean;
  skeletonCount?: number;
  emptyMessage?:  string;
  priorityCount?: number;
  cardProps?:     Omit<import("./index").ProductCardProps, "product">;
}

function SkeletonCard() {
  return (
    <div className="product-card-base" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div className="skeleton" style={{ aspectRatio: "4/3", borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />
      <div style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div className="skeleton" style={{ height: "0.7rem", width: "40%", borderRadius: "var(--radius-sm)" }} />
        <div className="skeleton" style={{ height: "1rem", width: "85%", borderRadius: "var(--radius-sm)" }} />
        <div className="skeleton" style={{ height: "1rem", width: "65%", borderRadius: "var(--radius-sm)" }} />
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <div className="skeleton" style={{ height: "1.4rem", width: "4rem", borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: "1.4rem", width: "4rem", borderRadius: "var(--radius-sm)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "var(--space-2)" }}>
          <div className="skeleton" style={{ height: "1.5rem", width: "5rem", borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: "0.7rem", width: "3.5rem", borderRadius: "var(--radius-sm)" }} />
        </div>
      </div>
    </div>
  );
}

function SkeletonListCard() {
  return (
    <div className="product-card-base" aria-hidden="true" style={{ pointerEvents: "none" }}>
      <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div className="skeleton" style={{ width: "100px", aspectRatio: "4/3", flexShrink: 0, borderRadius: "var(--radius-md)" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-3)", minWidth: "120px" }}>
          <div className="skeleton" style={{ height: "0.7rem", width: "30%", borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: "1.25rem", width: "70%", borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: "0.85rem", width: "90%", borderRadius: "var(--radius-sm)" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "var(--space-3)", flexShrink: 0 }}>
          <div className="skeleton" style={{ height: "1.5rem", width: "5rem", borderRadius: "var(--radius-sm)" }} />
          <div className="skeleton" style={{ height: "2rem", width: "7rem", borderRadius: "var(--radius-sm)" }} />
        </div>
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }: { view: GridView; onChange: (v: GridView) => void }) {
  return (
    <div role="group" aria-label="View mode" style={{
      display: "inline-flex", gap: "2px",
      background: "var(--color-surface-alt)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-md)", padding: "3px",
    }}>
      {(["grid", "list"] as GridView[]).map((v) => (
        <button
          key={v} onClick={() => onChange(v)}
          aria-pressed={view === v} aria-label={`${v} view`}
          style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            padding: "0.4rem 0.75rem", borderRadius: "var(--radius-sm)",
            border: "none", cursor: "pointer",
            fontSize: "var(--text-xs)", fontWeight: 700,
            letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
            transition: "background var(--transition-fast), color var(--transition-fast)",
            background: view === v ? "var(--color-ink)" : "transparent",
            color:      view === v ? "var(--color-white)" : "var(--color-text-muted)",
            gap: "var(--space-2)",
          }}
        >
          {v === "grid" ? (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="5" height="5" rx="1" /><rect x="7" y="0" width="5" height="5" rx="1" /><rect x="0" y="7" width="5" height="5" rx="1" /><rect x="7" y="7" width="5" height="5" rx="1" /></svg>Grid</>
          ) : (
            <><svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true"><rect x="0" y="0" width="12" height="2.5" rx="1" /><rect x="0" y="4.75" width="12" height="2.5" rx="1" /><rect x="0" y="9.5" width="12" height="2.5" rx="1" /></svg>List</>
          )}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div role="status" style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "var(--space-16) var(--space-8)",
      textAlign: "center", gap: "var(--space-4)",
    }}>
      <span style={{ fontSize: "3rem" }} aria-hidden="true">🔍</span>
      <h3 style={{ fontSize: "var(--text-xl)", color: "var(--color-text-secondary)" }}>No products found</h3>
      <p style={{ color: "var(--color-text-muted)", maxWidth: "360px" }}>{message}</p>
    </div>
  );
}

export default function ProductGrid({
  products,
  showToggle    = false,
  defaultView   = "grid",
  columns       = 3,
  loading       = false,
  skeletonCount = 6,
  emptyMessage  = "Try adjusting your search or filters to find what you're looking for.",
  priorityCount = 3,
  cardProps     = {},
}: ProductGridProps) {
  const [view, setView] = useState<GridView>(defaultView);
  const cardVariant: ProductCardVariant = view === "list" ? "list" : "grid";

  return (
    <section aria-label="Product results">
      <style>{`
        .pg-grid-2 { grid-template-columns: repeat(1, 1fr); }
        .pg-grid-3 { grid-template-columns: repeat(1, 1fr); }
        .pg-grid-4 { grid-template-columns: repeat(1, 1fr); }

        @media (min-width: 480px) {
          .pg-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .pg-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .pg-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 768px) {
          .pg-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .pg-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .pg-grid-4 { grid-template-columns: repeat(3, 1fr); }
        }
        @media (min-width: 1024px) {
          .pg-grid-2 { grid-template-columns: repeat(2, 1fr); }
          .pg-grid-3 { grid-template-columns: repeat(3, 1fr); }
          .pg-grid-4 { grid-template-columns: repeat(4, 1fr); }
        }
      `}</style>

      {showToggle && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "var(--space-5)" }}>
          <ViewToggle view={view} onChange={setView} />
        </div>
      )}

      {loading && (
        <div
          aria-busy="true" aria-label="Loading products"
          className={view === "grid" ? `pg-grid-${columns}` : undefined}
          style={view === "grid"
            ? { display: "grid", gap: "var(--space-4)" }
            : { display: "flex", flexDirection: "column", gap: "var(--space-4)" }
          }
        >
          {Array.from({ length: skeletonCount }).map((_, i) =>
            view === "grid" ? <SkeletonCard key={i} /> : <SkeletonListCard key={i} />
          )}
        </div>
      )}

      {!loading && products.length === 0 && <EmptyState message={emptyMessage} />}

      {!loading && products.length > 0 && (
        <div
          className={view === "grid" ? `stagger pg-grid-${columns}` : "stagger"}
          style={view === "grid"
            ? { display: "grid", gap: "var(--space-4)" }
            : { display: "flex", flexDirection: "column", gap: "var(--space-4)" }
          }
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              variant={cardVariant}
              priority={index < priorityCount}
              // className removed — not a valid ProductCardProps key (caused TS2322)
              {...cardProps}
            />
          ))}
        </div>
      )}
    </section>
  );
}