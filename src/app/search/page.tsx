"use client";
// src/app/search/page.tsx
//
// Full-featured search command centre — FULLY RESPONSIVE, mobile-first.
// Centering strategy:
//   • Hero: eyebrow, h1, search input — centered on all sizes (hero content is always centered)
//   • Filter chips: centered wrap on mobile, left-aligned at md+
//   • Empty state section labels + pills: centered on mobile, left at md+
//   • "Browse by Category" header: space-between row (label left, link right) — unchanged
//   • No-results message: centered on all sizes (it's a full-bleed empty state)
//   • Results header: flex row, wraps cleanly
//   • All eyebrow/section labels: left-aligned in body (consistent with catalog)

import {
  useCallback, useEffect, useMemo,
  useRef, useState, useTransition,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductListItem } from "@/types";
import { CATEGORIES } from "@/lib/categories.data";

// ─── Static data ──────────────────────────────────────────────────────────────

const POPULAR_SEARCHES = [
  "convection oven", "reach-in refrigerator", "commercial fryer",
  "prep table", "undercounter dishwasher", "ice machine",
  "griddle", "steam table", "walk-in cooler", "exhaust hood",
];

const PRICE_PRESETS = [
  { label: "Under $500",  min: "",     max: "500"  },
  { label: "$500–$2k",    min: "500",  max: "2000" },
  { label: "$2k–$5k",     min: "2000", max: "5000" },
  { label: "$5,000+",     min: "5000", max: ""     },
];

const MAX_RECENT = 8;
const RECENT_KEY = "jocax_recent_searches";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(n: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(n);
}

function getRecentSearches(): string[] {
  try { return JSON.parse(sessionStorage.getItem(RECENT_KEY) ?? "[]"); }
  catch { return []; }
}
function addRecentSearch(term: string) {
  const prev = getRecentSearches().filter((s) => s !== term);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify([term, ...prev].slice(0, MAX_RECENT)));
}
function removeRecentSearch(term: string) {
  const next = getRecentSearches().filter((s) => s !== term);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

function groupByCategory(products: ProductListItem[]) {
  const map = new Map<string, { name: string; slug: string; items: ProductListItem[] }>();
  for (const p of products) {
    const key  = p.category?.slug ?? "other";
    const name = p.category?.name ?? "Other";
    const slug = p.category?.slug ?? "other";
    if (!map.has(key)) map.set(key, { name, slug, items: [] });
    map.get(key)!.items.push(p);
  }
  return Array.from(map.values());
}

function deriveSpecs(product: ProductListItem): Array<{ label: string; value: string }> {
  const specs: Array<{ label: string; value: string }> = [];
  if (product.brand)    specs.push({ label: "Brand",    value: product.brand.name });
  if (product.category) specs.push({ label: "Category", value: product.category.name });
  if (product.price !== null && product.price !== undefined)
    specs.push({ label: "Price", value: formatPrice(product.price, product.currency) });
  const stock = product.stockQuantity ?? 0;
  specs.push({ label: "Availability", value: stock > 10 ? "In Stock" : stock > 0 ? `Low Stock (${stock})` : "Out of Stock" });
  return specs;
}

// ─── SearchProductCard ────────────────────────────────────────────────────────

function SearchProductCard({ product }: { product: ProductListItem }) {
  const [hovered, setHovered] = useState(false);
  const img     = product.images?.[0];
  const inStock = (product.stockQuantity ?? 0) > 0;
  const specs   = deriveSpecs(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="search-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", flexDirection: "column",
        borderRadius: "var(--radius-lg)",
        background:   hovered ? "rgba(232,160,32,0.05)" : "rgba(255,255,255,0.03)",
        border:       `1px solid ${hovered ? "rgba(232,160,32,0.25)" : "var(--color-border-dark)"}`,
        textDecoration: "none",
        transition: "background 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        boxShadow:  hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        overflow: "hidden", position: "relative",
      }}
    >
      <div className="search-card__inner">
        {/* Thumbnail */}
        <div style={{
          width: "72px", height: "72px", flexShrink: 0,
          borderRadius: "var(--radius-md)", overflow: "hidden",
          background: "rgba(255,255,255,0.05)",
          position: "relative",
          transition: "transform 200ms ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}>
          {img ? (
            <Image src={img.imageUrl} alt={img.altText ?? product.name}
              fill sizes="72px" style={{ objectFit: "cover" }}/>
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>📦</div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start",
            justifyContent: "space-between", gap: "var(--space-2)" }}>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--text-sm)", color: "var(--color-white)",
              lineHeight: "var(--leading-snug)", maxWidth: "none",
              overflow: "hidden", textOverflow: "ellipsis",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
            }}>
              {product.name}
            </p>
            {product.price !== null && product.price !== undefined && (
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "var(--text-sm)", color: "var(--color-amber)",
                flexShrink: 0, maxWidth: "none", whiteSpace: "nowrap",
              }}>
                {formatPrice(product.price, product.currency)}
              </p>
            )}
          </div>

          {product.shortDescription && (
            <p style={{
              fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.50)",
              marginTop: "var(--space-1)", lineHeight: "var(--leading-relaxed)",
              maxWidth: "none",
              display: "-webkit-box", WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>
              {product.shortDescription}
            </p>
          )}

          <div style={{ display: "flex", gap: "var(--space-2)",
            marginTop: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
            {product.brand && (
              <span style={{
                fontSize: "var(--text-xs)", fontWeight: 700,
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase", color: "var(--color-text-muted)",
                background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-sm)",
                padding: "0.2rem 0.5rem",
                maxWidth: "8rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {product.brand.name}
              </span>
            )}
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: 600,
              letterSpacing: "var(--tracking-wide)",
              color: inStock ? "var(--color-stock-in)" : "var(--color-stock-low)",
              whiteSpace: "nowrap",
            }}>
              {inStock ? "● In Stock" : "● Low Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* Quick-specs overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          background: "rgba(13,13,13,0.93)", backdropFilter: "blur(6px)",
          borderRadius: "var(--radius-lg)", padding: "var(--space-4)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 200ms ease, transform 200ms ease",
          pointerEvents: "none",
        }}
      >
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase", color: "var(--color-amber)",
            marginBottom: "var(--space-3)", maxWidth: "none",
          }}>Quick Specs</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {specs.map(({ label, value }) => (
              <div key={label} style={{ display: "flex",
                justifyContent: "space-between", gap: "var(--space-3)", alignItems: "baseline" }}>
                <span style={{
                  fontSize: "var(--text-xs)", fontWeight: 700,
                  letterSpacing: "var(--tracking-wider)", textTransform: "uppercase",
                  color: "var(--color-text-muted)", flexShrink: 0,
                }}>{label}</span>
                <span style={{
                  fontSize: "var(--text-xs)", fontWeight: 600,
                  color: label === "Price" ? "var(--color-amber)"
                    : label === "Availability"
                    ? (value.startsWith("In") ? "var(--color-stock-in)" : "var(--color-stock-low)")
                    : "var(--color-white)",
                  textAlign: "right", maxWidth: "none",
                }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{
          marginTop: "var(--space-3)", paddingTop: "var(--space-3)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)" }}>
            View full details
          </span>
          <span style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-wider)",
            textTransform: "uppercase", color: "var(--color-amber)",
          }}>Open →</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Category Grid ────────────────────────────────────────────────────────────

function CategoryGrid() {
  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "var(--space-4)",
      }}>
        <p className="eyebrow">Browse by Category</p>
        <Link href="/categories" style={{
          fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.08em",
          textTransform: "uppercase", color: "var(--color-amber)",
          borderBottom: "1px solid rgba(232,160,32,0.4)", paddingBottom: "1px",
        }}>
          All categories →
        </Link>
      </div>
      <div className="cat-quick-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="cat-quick-card"
            title={`Browse ${cat.name} — ${cat.count} products`}
            style={{ borderTop: `2px solid ${cat.color}55` }}
          >
            <span style={{ fontSize: "clamp(1.25rem, 3vw, 1.5rem)" }}>{cat.icon}</span>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--text-xs)", letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--color-white)",
              textAlign: "center", maxWidth: "none", lineHeight: 1.3,
              overflowWrap: "break-word", wordBreak: "break-word",
            }}>
              {cat.name}
            </span>
            <span style={{
              fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.04em",
              color: cat.color, opacity: 0.75, whiteSpace: "nowrap",
            }}>
              {cat.count}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router      = useRouter();
  const urlParams   = useSearchParams();
  const [, startTransition] = useTransition();

  const [query,       setQuery]       = useState(urlParams.get("q") ?? "");
  const [results,     setResults]     = useState<ProductListItem[]>([]);
  const [total,       setTotal]       = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selCategory, setSelCategory] = useState("");
  const [selPrice,    setSelPrice]    = useState<{ min: string; max: string } | null>(null);
  const [recents,     setRecents]     = useState<string[]>([]);

  useEffect(() => { setRecents(getRecentSearches()); }, []);

  const inputRef    = useRef<HTMLInputElement>(null);
  const abortRef    = useRef<AbortController | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const fetchResults = useCallback(async (q: string, category: string, price: typeof selPrice) => {
    if (!q.trim()) { setResults([]); setTotal(0); setHasSearched(false); setLoading(false); return; }
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true); setHasSearched(true);
    try {
      const qs = new URLSearchParams({ q });
      if (category)   qs.set("category", category);
      if (price?.min) qs.set("minPrice", price.min);
      if (price?.max) qs.set("maxPrice", price.max);
      const res  = await fetch(`${window.location.origin}/api/products?${qs}`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setResults(data.products); setTotal(data.total);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") console.error(err);
    } finally { setLoading(false); }
  }, []);

  const handleQueryChange = (val: string) => {
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchResults(val, selCategory, selPrice);
      startTransition(() => {
        const params = new URLSearchParams();
        if (val) params.set("q", val);
        router.replace(`/search?${params.toString()}`, { scroll: false });
      });
    }, 350);
  };

  useEffect(() => {
    if (query.trim()) fetchResults(query, selCategory, selPrice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selCategory, selPrice]);

  const selectSuggestion = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    setRecents(getRecentSearches());
    fetchResults(term, selCategory, selPrice);
    startTransition(() => router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false }));
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query.trim());
    setRecents(getRecentSearches());
    fetchResults(query, selCategory, selPrice);
  };

  const removeRecent = (term: string) => {
    removeRecentSearch(term);
    setRecents(getRecentSearches());
  };

  const grouped = useMemo(() => groupByCategory(results), [results]);
  const brands  = useMemo(() => {
    const seen = new Set<string>();
    return results
      .filter((p) => p.brand && !seen.has(p.brand.slug) && seen.add(p.brand.slug))
      .map((p) => p.brand!);
  }, [results]);

  const showEmpty   = !loading && !hasSearched;
  const showNoMatch = !loading && hasSearched && results.length === 0;
  const showResults = !loading && results.length > 0;

  return (
    <>
      <style>{`

        /* ════════════════════════════════════════════════════════════
           SEARCH INPUT
        ════════════════════════════════════════════════════════════ */
        .search-input-wrap { position: relative; }
        .search-input-main {
          width: 100%;
          background:    rgba(255,255,255,0.06);
          border:        1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding:       0.875rem 3rem 0.875rem 3rem;
          font-family:   var(--font-display);
          font-weight:   600;
          font-size:     clamp(0.9375rem, 2.5vw, 1.25rem);
          color:         var(--color-white);
          outline:       none;
          transition:    border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
          caret-color:   var(--color-amber);
          -webkit-appearance: none;
        }
        .search-input-main::placeholder { color: rgba(255,255,255,0.25); }
        .search-input-main:focus {
          border-color: rgba(232,160,32,0.5);
          background:   rgba(255,255,255,0.09);
          box-shadow:   0 0 0 3px rgba(232,160,32,0.08);
        }
        .search-input-main::-webkit-search-cancel-button { display: none; }

        /* ════════════════════════════════════════════════════════════
           FILTER CHIPS
        ════════════════════════════════════════════════════════════ */
        .filter-chip {
          display: inline-flex; align-items: center; gap: 0.3rem;
          padding: 0.375rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: var(--text-xs); font-weight: 600; letter-spacing: 0.05em;
          cursor: pointer;
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.04); color: var(--color-text-faint);
          transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          white-space: nowrap; min-height: 2.25rem;
        }
        .filter-chip:hover  { background: rgba(255,255,255,0.08); color: var(--color-white); }
        .filter-chip.active { background: rgba(232,160,32,0.12); border-color: rgba(232,160,32,0.4); color: var(--color-amber); }

        /* ── Filter row — centered on mobile, left at md+ ── */
        .filter-row {
          display: flex; flex-wrap: wrap; gap: var(--space-2);
          align-items: center;
          margin-top: var(--space-3);
          /* Mobile: center the chip group under the search bar */
          justify-content: center;
        }
        @media (min-width: 768px) {
          .filter-row { justify-content: flex-start; }
        }

        /* ════════════════════════════════════════════════════════════
           SUGGESTION PILLS
        ════════════════════════════════════════════════════════════ */
        .suggestion-pill {
          display: inline-flex; align-items: center; gap: 0.35rem;
          padding: 0.4rem 0.875rem;
          border-radius: var(--radius-full);
          font-size: var(--text-xs); font-weight: 500;
          cursor: pointer;
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.04); color: var(--color-text-faint);
          transition: background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          white-space: nowrap; min-height: 2.25rem;
        }
        .suggestion-pill:hover { background: rgba(232,160,32,0.08); border-color: rgba(232,160,32,0.3); color: var(--color-amber); }

        /* ════════════════════════════════════════════════════════════
           CATEGORY GRID — auto-fill, no overflow
        ════════════════════════════════════════════════════════════ */
        .cat-quick-card {
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          gap: 0.35rem; padding: var(--space-3) var(--space-2);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border-dark);
          background: rgba(255,255,255,0.03);
          text-decoration: none;
          transition: background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-spring);
          cursor: pointer; min-height: 5.5rem; overflow: hidden;
        }
        .cat-quick-card:hover { background: rgba(232,160,32,0.06); border-color: rgba(232,160,32,0.2); transform: translateY(-2px); }
        @media (hover: none) and (pointer: coarse) {
          .cat-quick-card:hover { transform: none; }
          .cat-quick-card:active { background: rgba(232,160,32,0.08); }
        }
        .cat-quick-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 6.5rem), 1fr));
          gap: var(--space-3);
          width: 100%; overflow: hidden;
        }

        /* ════════════════════════════════════════════════════════════
           RESULTS GRID — 1 col mobile, 2 at sm, 3 at xl
        ════════════════════════════════════════════════════════════ */
        .results-grid {
          display: grid; grid-template-columns: 1fr;
          gap: var(--space-3);
        }
        @media (min-width: 640px)  { .results-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (min-width: 1280px) { .results-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

        /* ════════════════════════════════════════════════════════════
           SEARCH CARD — column on XS, row at SM+
        ════════════════════════════════════════════════════════════ */
        .search-card__inner {
          display: flex; gap: var(--space-4); padding: var(--space-4);
          align-items: flex-start;
          flex-direction: column;   /* XS: stacked */
        }
        @media (min-width: 480px) {
          .search-card__inner { flex-direction: row; }
        }

        /* ════════════════════════════════════════════════════════════
           HORIZONTAL SCROLL STRIP
        ════════════════════════════════════════════════════════════ */
        .scroll-strip {
          display: flex; flex-wrap: nowrap; gap: var(--space-2);
          overflow-x: auto; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; padding-bottom: var(--space-1);
          margin-inline: calc(var(--page-padding-x) * -1);
          padding-inline: var(--page-padding-x);
        }
        .scroll-strip::-webkit-scrollbar { display: none; }

        /* ════════════════════════════════════════════════════════════
           RESULTS HEADER
        ════════════════════════════════════════════════════════════ */
        .results-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-6);
          flex-wrap: wrap; gap: var(--space-3);
        }

        /* ════════════════════════════════════════════════════════════
           EMPTY STATE SECTIONS — centered on mobile, left at md+
        ════════════════════════════════════════════════════════════ */
        .empty-section {
          /* Mobile: center section label + pills */
          display: flex; flex-direction: column; align-items: center;
          text-align: center;
        }
        .empty-section .eyebrow { margin-bottom: var(--space-4); }
        .empty-section .pills-wrap {
          display: flex; flex-wrap: wrap; gap: var(--space-2);
          justify-content: center;
        }
        @media (min-width: 768px) {
          .empty-section { align-items: flex-start; text-align: left; }
          .empty-section .pills-wrap { justify-content: flex-start; }
        }

        /* ════════════════════════════════════════════════════════════
           RECENT SEARCHES ROW — label + clear button
        ════════════════════════════════════════════════════════════ */
        .recent-header {
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4);
          flex-wrap: wrap; gap: var(--space-2);
          width: 100%;
        }

        /* ════════════════════════════════════════════════════════════
           ANIMATIONS
        ════════════════════════════════════════════════════════════ */
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite linear;
          border-radius: var(--radius-md);
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ════════════════════════════════════════════════════════════
           REDUCED MOTION
        ════════════════════════════════════════════════════════════ */
        @media (prefers-reduced-motion: reduce) {
          .skeleton { animation: none; background: rgba(255,255,255,0.06); }
          .cat-quick-card:hover { transform: none; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh", background: "var(--color-ink)",
        paddingTop: "var(--nav-height)", overflowX: "hidden",
      }}>

        {/* ══════════════════════════════════════════════════════════════
            SEARCH HERO — always centered (eyebrow, h1, input)
        ══════════════════════════════════════════════════════════════ */}
        <div style={{
          background: "var(--color-steel)",
          borderBottom: "1px solid var(--color-border-dark)",
          paddingBlock: "clamp(var(--space-8), 6vw, var(--space-16))",
          position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,160,32,0.06) 0%, transparent 70%)",
          }}/>

          <div className="container" style={{ position: "relative" }}>
            {/* Eyebrow — centered always */}
            <p className="eyebrow-light" style={{
              marginBottom: "var(--space-3)", textAlign: "center",
            }}>
              Equipment Search
            </p>

            {/* Heading — centered always */}
            <h1 style={{
              color: "var(--color-white)", textAlign: "center",
              marginBottom: "var(--space-6)",
              fontSize: "clamp(var(--text-xl), 5vw, 3rem)",
              lineHeight: "var(--leading-tight)",
              letterSpacing: "var(--tracking-wide)",
              textTransform: "uppercase",
            }}>
              Find the Right Equipment
            </h1>

            {/* Search input — centered, capped at 680px */}
            <form onSubmit={handleSubmit} style={{ maxWidth: "680px", margin: "0 auto" }}>
              <div className="search-input-wrap">
                <span aria-hidden="true" style={{
                  position: "absolute", left: "1rem",
                  top: "50%", transform: "translateY(-50%)",
                  fontSize: "1rem", pointerEvents: "none", opacity: 0.5,
                }}>🔍</span>

                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="Search equipment…"
                  aria-label="Search commercial kitchen equipment"
                  className="search-input-main"
                  autoComplete="off"
                  spellCheck={false}
                />

                <div style={{
                  position: "absolute", right: "0.875rem",
                  top: "50%", transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  {loading && (
                    <div style={{
                      width: "18px", height: "18px",
                      border: "2px solid rgba(232,160,32,0.3)",
                      borderTopColor: "var(--color-amber)",
                      borderRadius: "50%", animation: "spin 0.7s linear infinite",
                      flexShrink: 0,
                    }}/>
                  )}
                  {query && !loading && (
                    <button
                      type="button"
                      onClick={() => { setQuery(""); setResults([]); setHasSearched(false); inputRef.current?.focus(); }}
                      aria-label="Clear search"
                      style={{
                        background: "rgba(255,255,255,0.1)", border: "none", cursor: "pointer",
                        color: "var(--color-text-muted)", fontSize: "0.75rem",
                        width: "22px", height: "22px", borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "background var(--transition-fast)", flexShrink: 0,
                      }}
                    >✕</button>
                  )}
                </div>
              </div>
            </form>

            {/* Filter chips — centered on mobile, left at md+ */}
            {(hasSearched || query) && (
              <div className="filter-row" style={{ maxWidth: "680px", margin: "var(--space-4) auto 0" }}>
                <span style={{
                  fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
                  fontWeight: 600, flexShrink: 0,
                }}>
                  Filter:
                </span>

                {CATEGORIES.slice(0, 5).map((cat) => (
                  <span key={cat.slug} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                    <button
                      type="button"
                      onClick={() => setSelCategory(selCategory === cat.slug ? "" : cat.slug)}
                      className={`filter-chip${selCategory === cat.slug ? " active" : ""}`}
                    >
                      <span>{cat.icon}</span>
                      {cat.name}
                      {selCategory === cat.slug && <span aria-hidden="true">✕</span>}
                    </button>
                    {selCategory === cat.slug && (
                      <Link
                        href={`/categories/${cat.slug}`}
                        title={`Go to ${cat.name} category page`}
                        style={{
                          fontSize: "var(--text-xs)", fontWeight: 700,
                          color: "var(--color-amber)", letterSpacing: "0.06em",
                          borderBottom: "1px solid rgba(232,160,32,0.35)",
                          paddingBottom: "1px", whiteSpace: "nowrap",
                        }}
                      >Browse →</Link>
                    )}
                  </span>
                ))}

                {PRICE_PRESETS.map((p) => {
                  const isSelected = selPrice?.min === p.min && selPrice?.max === p.max;
                  return (
                    <button
                      key={p.label} type="button"
                      onClick={() => setSelPrice(isSelected ? null : { min: p.min, max: p.max })}
                      className={`filter-chip${isSelected ? " active" : ""}`}
                    >
                      {p.label}
                      {isSelected && <span aria-hidden="true">✕</span>}
                    </button>
                  );
                })}

                {(selCategory || selPrice) && (
                  <button
                    type="button"
                    onClick={() => { setSelCategory(""); setSelPrice(null); }}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "var(--text-xs)", color: "rgb(248,113,113)",
                      fontWeight: 600, padding: "0.375rem 0",
                    }}
                  >Clear filters</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BODY
        ══════════════════════════════════════════════════════════════ */}
        <div className="container" style={{
          paddingBlock: "clamp(var(--space-8), 6vw, var(--space-12))",
        }}>

          {/* ── EMPTY STATE ─────────────────────────────────────────────
              Section labels + pills centered on mobile, left at md+
          ── */}
          {showEmpty && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>

              {/* Recent searches */}
              {recents.length > 0 && (
                <div className="empty-section">
                  <div className="recent-header">
                    <p className="eyebrow">Recent Searches</p>
                    <button
                      type="button"
                      onClick={() => { sessionStorage.removeItem(RECENT_KEY); setRecents([]); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
                        fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                        minHeight: "2.25rem", padding: 0,
                      }}
                    >Clear all</button>
                  </div>
                  <div className="scroll-strip" style={{ width: "100%" }}>
                    {recents.map((term) => (
                      <span key={term} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", flexShrink: 0 }}>
                        <button type="button" className="suggestion-pill"
                          onClick={() => selectSuggestion(term)}>
                          🕐 {term}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecent(term)}
                          aria-label={`Remove "${term}" from recent searches`}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--color-text-muted)", fontSize: "0.7rem",
                            padding: "0.25rem", lineHeight: 1,
                            minWidth: "1.5rem", minHeight: "1.5rem",
                          }}
                        >✕</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular searches */}
              <div className="empty-section">
                <p className="eyebrow">Popular Searches</p>
                <div className="pills-wrap">
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term} type="button" className="suggestion-pill"
                      onClick={() => selectSuggestion(term)}>
                      🔥 {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by category */}
              <div>
                <CategoryGrid />
              </div>
            </div>
          )}

          {/* ── LOADING SKELETONS ──────────────────────────────────────── */}
          {loading && (
            <div>
              <div style={{ height: "24px", width: "180px", marginBottom: "var(--space-6)" }}
                className="skeleton"/>
              <div className="results-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "var(--space-4)", padding: "var(--space-4)",
                    borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-dark)",
                    flexDirection: "column",
                  }}>
                    <div style={{ display: "flex", gap: "var(--space-4)" }}>
                      <div className="skeleton" style={{ width: "72px", height: "72px", flexShrink: 0, borderRadius: "var(--radius-md)" }}/>
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                        <div className="skeleton" style={{ height: "16px", width: "80%" }}/>
                        <div className="skeleton" style={{ height: "12px", width: "100%" }}/>
                        <div className="skeleton" style={{ height: "12px", width: "60%" }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NO RESULTS ────────────────────────────────────────────── */}
          {showNoMatch && (
            <div style={{ textAlign: "center", paddingBlock: "clamp(var(--space-10), 8vw, var(--space-16))" }}>
              <div style={{ fontSize: "clamp(2rem, 6vw, 3rem)", marginBottom: "var(--space-4)" }}>🔍</div>
              <h2 style={{
                color: "var(--color-white)", marginBottom: "var(--space-3)",
                fontSize: "clamp(var(--text-xl), 3vw, var(--text-3xl))",
                overflowWrap: "break-word", wordBreak: "break-word",
              }}>
                No results for &ldquo;{query}&rdquo;
              </h2>
              <p style={{
                color: "var(--color-text-muted)", maxWidth: "400px",
                margin: "0 auto var(--space-8)", lineHeight: "var(--leading-relaxed)",
              }}>
                Try different keywords, check the spelling, or browse by category below.
              </p>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: "var(--space-2)",
                justifyContent: "center", marginBottom: "var(--space-8)",
              }}>
                {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                  <button key={term} type="button" className="suggestion-pill"
                    onClick={() => selectSuggestion(term)}>
                    {term}
                  </button>
                ))}
              </div>
              <Link href="/products" className="btn btn-primary">
                Browse All Equipment →
              </Link>
              <div style={{ marginTop: "var(--space-12)", textAlign: "left" }}>
                <CategoryGrid />
              </div>
            </div>
          )}

          {/* ── RESULTS ───────────────────────────────────────────────── */}
          {showResults && (
            <div>
              <div className="results-header">
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                  <span style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "clamp(var(--text-lg), 3vw, var(--text-xl))",
                    color: "var(--color-white)",
                  }}>
                    {total.toLocaleString()}
                  </span>
                  {" "}result{total !== 1 ? "s" : ""} for{" "}
                  <span style={{ color: "var(--color-amber)", fontWeight: 600, wordBreak: "break-all" }}>
                    &ldquo;{query}&rdquo;
                  </span>
                </p>
                <Link
                  href={`/products?q=${encodeURIComponent(query)}${selCategory ? `&category=${selCategory}` : ""}`}
                  style={{
                    fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", borderBottom: "2px solid var(--color-amber)",
                    paddingBottom: "2px", whiteSpace: "nowrap", color: "var(--color-amber)",
                  }}
                >View all in catalog →</Link>
              </div>

              {/* Brand pills */}
              {brands.length > 1 && (
                <div style={{ marginBottom: "var(--space-6)" }}>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Brands in results</p>
                  <div className="scroll-strip">
                    {brands.map((b) => (
                      <button key={b.slug} type="button" className="suggestion-pill"
                        style={{ flexShrink: 0 }} onClick={() => selectSuggestion(b.name)}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Grouped results */}
              {grouped.map(({ name, slug, items }) => (
                <div key={name} style={{ marginBottom: "var(--space-8)" }}>
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "var(--space-4)",
                    borderBottom: "1px solid var(--color-border-dark)",
                    paddingBottom: "var(--space-3)",
                    gap: "var(--space-3)", flexWrap: "wrap",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                      <h3 style={{
                        fontFamily: "var(--font-display)", fontWeight: 800,
                        fontSize: "var(--text-sm)", letterSpacing: "0.12em",
                        textTransform: "uppercase", color: "var(--color-white)", maxWidth: "none",
                      }}>{name}</h3>
                      <span style={{
                        background: "rgba(232,160,32,0.15)", color: "var(--color-amber)",
                        fontSize: "var(--text-xs)", fontWeight: 700, padding: "0.2rem 0.6rem",
                        borderRadius: "var(--radius-full)", flexShrink: 0,
                      }}>{items.length}</span>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center", flexWrap: "wrap" }}>
                      <Link href={`/categories/${slug}`} style={{
                        fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)",
                        letterSpacing: "0.06em", whiteSpace: "nowrap",
                      }}>Category page</Link>
                      <span style={{ color: "var(--color-border-dark)", fontSize: "var(--text-xs)" }}>·</span>
                      <Link
                        href={`/products?category=${slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                        style={{
                          fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-amber)",
                          letterSpacing: "0.06em", whiteSpace: "nowrap",
                        }}
                      >All {name} →</Link>
                    </div>
                  </div>
                  <div className="results-grid">
                    {items.map((p) => <SearchProductCard key={p.id} product={p}/>)}
                  </div>
                </div>
              ))}

              {/* Bottom CTA */}
              {total > results.length && (
                <div style={{
                  textAlign: "center", marginTop: "var(--space-6)",
                  paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-border-dark)",
                }}>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                    Showing {results.length} of {total.toLocaleString()} results
                  </p>
                  <Link
                    href={`/products?q=${encodeURIComponent(query)}${selCategory ? `&category=${selCategory}` : ""}`}
                    className="btn btn-outline-light"
                  >
                    View all {total.toLocaleString()} results in catalog →
                  </Link>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  );
}