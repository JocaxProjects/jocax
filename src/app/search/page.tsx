"use client";
// src/app/search/page.tsx
//
// Full-featured search command centre:
//  ✦ Prominent search input — autofocused on load
//  ✦ Instant results as you type (350ms debounce → /api/products)
//  ✦ Empty state: popular categories + trending searches
//  ✦ Results: product cards grouped by category, plus brand pills
//  ✦ Inline filters: category chips + price range
//  ✦ Recent searches stored in sessionStorage (client-only, no SSR mismatch)
//  ✦ Keyboard nav: Escape clears, Enter submits

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
  { label: "Under $500",      min: "",     max: "500"   },
  { label: "$500 – $2,000",   min: "500",  max: "2000"  },
  { label: "$2,000 – $5,000", min: "2000", max: "5000"  },
  { label: "$5,000+",         min: "5000", max: ""      },
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

// ─── Group products by category ───────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

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
        display:        "flex",
        flexDirection:  "column",
        borderRadius:   "var(--radius-lg)",
        background:     hovered ? "rgba(232,160,32,0.05)" : "rgba(255,255,255,0.03)",
        border:         `1px solid ${hovered ? "rgba(232,160,32,0.25)" : "var(--color-border-dark)"}`,
        textDecoration: "none",
        transition:     "background 180ms ease, border-color 180ms ease, box-shadow 180ms ease",
        boxShadow:      hovered ? "0 8px 32px rgba(0,0,0,0.3)" : "none",
        overflow:       "hidden",
        position:       "relative",
      }}
    >
      {/* ── Normal card layout ── */}
      <div style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)", alignItems: "flex-start" }}>

        {/* Thumbnail — next/image with fill */}
        <div style={{
          width: "72px", height: "72px", flexShrink: 0,
          borderRadius: "var(--radius-md)", overflow: "hidden",
          background: "rgba(255,255,255,0.05)",
          position: "relative",             /* required for Image fill */
          transition: "transform 200ms ease",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}>
          {img ? (
            <Image
              src={img.imageUrl}
              alt={img.altText ?? product.name}
              fill
              sizes="72px"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
              📦
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "var(--space-2)" }}>
            {/* Product name — sentence case, no text-transform */}
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "var(--text-sm)", color: "var(--color-white)",
              lineHeight: "var(--leading-snug)", maxWidth: "none",
            }}>
              {product.name}
            </p>
            {product.price !== null && product.price !== undefined && (
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "var(--text-sm)", color: "var(--color-amber)",
                flexShrink: 0, maxWidth: "none",
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

          <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)", flexWrap: "wrap", alignItems: "center" }}>
            {product.brand && (
              <span style={{
                fontSize: "var(--text-xs)", fontWeight: 700,      /* was 0.68rem (10.9px) */
                letterSpacing: "var(--tracking-wider)",
                textTransform: "uppercase", color: "var(--color-text-muted)",
                background: "rgba(255,255,255,0.06)", borderRadius: "var(--radius-sm)",
                padding: "0.2rem 0.5rem",
              }}>
                {product.brand.name}
              </span>
            )}
            {/* Stock badge — token colors, text-based, never color-alone */}
            <span style={{
              fontSize: "var(--text-xs)", fontWeight: 600,
              letterSpacing: "var(--tracking-wide)",
              color: inStock ? "var(--color-stock-in)" : "var(--color-stock-low)",
            }}>
              {inStock ? "● In Stock" : "● Low Stock"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick-specs overlay (slides up on hover) ──────────────────────────
          Purely decorative/informational — no interactive children.
          aria-hidden="true" is correct; the parent card <Link> handles navigation.
          pointerEvents: "none" prevents the overlay blocking mouse events.
      ── */}
      <div
        aria-hidden="true"
        style={{
          position:       "absolute",
          inset:          0,
          background:     "rgba(13,13,13,0.93)",
          backdropFilter: "blur(6px)",
          borderRadius:   "var(--radius-lg)",
          padding:        "var(--space-4)",
          display:        "flex",
          flexDirection:  "column",
          justifyContent: "space-between",
          opacity:        hovered ? 1 : 0,
          transform:      hovered ? "translateY(0)" : "translateY(8px)",
          transition:     "opacity 200ms ease, transform 200ms ease",
          pointerEvents:  "none",
        }}
      >
        {/* Overlay header */}
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 800,
            fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-widest)",
            textTransform: "uppercase", color: "var(--color-amber)",
            marginBottom: "var(--space-3)", maxWidth: "none",
          }}>
            Quick Specs
          </p>

          {/* Spec rows — all plain text, no links inside the overlay */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
            {specs.map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-3)", alignItems: "baseline" }}>
                <span style={{
                  fontSize: "var(--text-xs)", fontWeight: 700,
                  letterSpacing: "var(--tracking-wider)",
                  textTransform: "uppercase", color: "var(--color-text-muted)",
                  flexShrink: 0,
                }}>
                  {label}
                </span>
                <span style={{
                  fontSize: "var(--text-xs)", fontWeight: 600,
                  color: label === "Price"
                    ? "var(--color-amber)"
                    : label === "Availability"
                    ? (value.startsWith("In") ? "var(--color-stock-in)" : "var(--color-stock-low)")
                    : "var(--color-white)",
                  textAlign: "right", maxWidth: "none",
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Overlay CTA */}
        <div style={{
          marginTop: "var(--space-3)",
          paddingTop: "var(--space-3)",
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
          }}>
            Open →
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SearchPage() {
  const router          = useRouter();
  const urlParams       = useSearchParams();
  const [, startTransition] = useTransition();

  // Input + results state
  const [query,        setQuery]        = useState(urlParams.get("q") ?? "");
  const [results,      setResults]      = useState<ProductListItem[]>([]);
  const [total,        setTotal]        = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [hasSearched,  setHasSearched]  = useState(false);

  // Filter state
  const [selCategory,  setSelCategory]  = useState("");
  const [selPrice,     setSelPrice]     = useState<{ min: string; max: string } | null>(null);

  // Recent searches (populated after mount to avoid SSR mismatch)
  const [recents, setRecents] = useState<string[]>([]);
  useEffect(() => { setRecents(getRecentSearches()); }, []);

  const inputRef    = useRef<HTMLInputElement>(null);
  const abortRef    = useRef<AbortController | undefined>(undefined);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Autofocus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchResults = useCallback(async (q: string, category: string, price: typeof selPrice) => {
    if (!q.trim()) { setResults([]); setTotal(0); setHasSearched(false); setLoading(false); return; }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    setHasSearched(true);

    try {
      const qs = new URLSearchParams({ q });
      if (category)   qs.set("category", category);
      if (price?.min) qs.set("minPrice", price.min);
      if (price?.max) qs.set("maxPrice", price.max);

      const res  = await fetch(`${window.location.origin}/api/products?${qs}`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      setResults(data.products);
      setTotal(data.total);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Debounced query change ───────────────────────────────────────────────
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

  // ── Instant filter re-fetch ──────────────────────────────────────────────
  useEffect(() => {
    if (query.trim()) fetchResults(query, selCategory, selPrice);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selCategory, selPrice]);

  // ── Click a suggestion / recent ─────────────────────────────────────────
  const selectSuggestion = (term: string) => {
    setQuery(term);
    addRecentSearch(term);
    setRecents(getRecentSearches());
    fetchResults(term, selCategory, selPrice);
    startTransition(() => router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false }));
    inputRef.current?.focus();
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    addRecentSearch(query.trim());
    setRecents(getRecentSearches());
    fetchResults(query, selCategory, selPrice);
  };

  // ── Remove recent ────────────────────────────────────────────────────────
  const removeRecent = (term: string) => {
    removeRecentSearch(term);
    setRecents(getRecentSearches());
  };

  // ── Grouped results ──────────────────────────────────────────────────────
  const grouped = useMemo(() => groupByCategory(results), [results]);

  // ── Unique brands in results ─────────────────────────────────────────────
  const brands = useMemo(() => {
    const seen = new Set<string>();
    return results
      .filter((p) => p.brand && !seen.has(p.brand.slug) && seen.add(p.brand.slug))
      .map((p) => p.brand!);
  }, [results]);

  const showEmpty   = !loading && !hasSearched;
  const showNoMatch = !loading && hasSearched && results.length === 0;
  const showResults = !loading && results.length > 0;

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        .search-input-wrap { position: relative; }
        .search-input-main {
          width:         100%;
          background:    rgba(255,255,255,0.06);
          border:        1px solid rgba(255,255,255,0.1);
          border-radius: var(--radius-lg);
          padding:       1rem 3.5rem 1rem 3.5rem;
          font-family:   var(--font-display);
          font-weight:   600;
          font-size:     clamp(1rem, 2.5vw, 1.25rem);
          color:         var(--color-white);
          outline:       none;
          transition:    border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast);
          caret-color:   var(--color-amber);
        }
        .search-input-main::placeholder { color: rgba(255,255,255,0.25); }
        .search-input-main:focus {
          border-color: rgba(232,160,32,0.5);
          background:   rgba(255,255,255,0.09);
          box-shadow:   0 0 0 3px rgba(232,160,32,0.08);
        }
        .filter-chip {
          display:        inline-flex;
          align-items:    center;
          gap:            0.35rem;
          padding:        0.4rem 0.9rem;
          border-radius:  var(--radius-full);
          font-size:      var(--text-xs);
          font-weight:    600;
          letter-spacing: 0.06em;
          cursor:         pointer;
          border:         1px solid var(--color-border-dark);
          background:     rgba(255,255,255,0.04);
          color:          var(--color-text-faint);
          transition:     background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          white-space:    nowrap;
        }
        .filter-chip:hover  { background: rgba(255,255,255,0.08); color: var(--color-white); }
        .filter-chip.active { background: rgba(232,160,32,0.12); border-color: rgba(232,160,32,0.4); color: var(--color-amber); }
        .suggestion-pill {
          display:        inline-flex;
          align-items:    center;
          gap:            0.4rem;
          padding:        0.45rem 1rem;
          border-radius:  var(--radius-full);
          font-size:      var(--text-xs);
          font-weight:    500;
          cursor:         pointer;
          border:         1px solid var(--color-border-dark);
          background:     rgba(255,255,255,0.04);
          color:          var(--color-text-faint);
          transition:     background var(--transition-fast), border-color var(--transition-fast), color var(--transition-fast);
          white-space:    nowrap;
        }
        .suggestion-pill:hover { background: rgba(232,160,32,0.08); border-color: rgba(232,160,32,0.3); color: var(--color-amber); }
        .cat-quick-card {
          display:         flex;
          flex-direction:  column;
          align-items:     center;
          gap:             0.4rem;
          padding:         var(--space-4);
          border-radius:   var(--radius-lg);
          border:          1px solid var(--color-border-dark);
          background:      rgba(255,255,255,0.03);
          text-decoration: none;
          transition:      background var(--transition-fast), border-color var(--transition-fast), transform var(--transition-fast);
          cursor:          pointer;
        }
        .cat-quick-card:hover { background: rgba(232,160,32,0.06); border-color: rgba(232,160,32,0.2); transform: translateY(-2px); }
        .results-grid {
          display:               grid;
          grid-template-columns: 1fr;
          gap:                   var(--space-3);
        }
        @media (min-width: 768px)  { .results-grid { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1280px) { .results-grid { grid-template-columns: 1fr 1fr 1fr; } }
        .cat-quick-grid {
          display:               grid;
          grid-template-columns: repeat(4, 1fr);
          gap:                   var(--space-3);
        }
        @media (min-width: 480px) { .cat-quick-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 768px) { .cat-quick-grid { grid-template-columns: repeat(8, 1fr); } }
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
        .skeleton {
          background:      linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%;
          animation:       shimmer 1.4s infinite linear;
          border-radius:   var(--radius-md);
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: "100vh", background: "var(--color-ink)", paddingTop: "var(--nav-height)" }}>

        {/* ── Search hero ───────────────────────────────────────────────────── */}
        <div style={{
          background:   "var(--color-steel)",
          borderBottom: "1px solid var(--color-border-dark)",
          paddingBlock: "clamp(var(--space-10), 6vw, var(--space-16))",
          position:     "relative",
          overflow:     "hidden",
        }}>
          {/* Ambient glow */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(232,160,32,0.06) 0%, transparent 70%)",
          }} />

          <div className="container" style={{ position: "relative" }}>
            <p className="eyebrow-light" style={{ marginBottom: "var(--space-3)", textAlign: "center" }}>
              Equipment Search
            </p>
            <h1 style={{
              color: "var(--color-white)", textAlign: "center",
              marginBottom: "var(--space-8)",
              fontSize: "clamp(var(--text-2xl), 5vw, 3rem)",
            }}>
              Find the Right Equipment
            </h1>

            {/* ── Main search input ── */}
            <form onSubmit={handleSubmit} style={{ maxWidth: "680px", margin: "0 auto" }}>
              <div className="search-input-wrap">
                <span aria-hidden="true" style={{
                  position: "absolute", left: "1.1rem",
                  top: "50%", transform: "translateY(-50%)",
                  fontSize: "1.1rem", pointerEvents: "none", opacity: 0.5,
                }}>
                  🔍
                </span>

                <input
                  ref={inputRef}
                  type="search"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder="convection oven, reach-in cooler, commercial fryer…"
                  aria-label="Search commercial kitchen equipment"
                  className="search-input-main"
                  autoComplete="off"
                  spellCheck={false}
                />

                {/* Right: spinner or clear */}
                <div style={{
                  position: "absolute", right: "1rem",
                  top: "50%", transform: "translateY(-50%)",
                  display: "flex", alignItems: "center", gap: "0.5rem",
                }}>
                  {loading && (
                    <div style={{
                      width: "18px", height: "18px",
                      border: "2px solid rgba(232,160,32,0.3)",
                      borderTopColor: "var(--color-amber)",
                      borderRadius: "50%", animation: "spin 0.7s linear infinite",
                    }} />
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
                        transition: "background var(--transition-fast)",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </form>

            {/* ── Inline filters ── */}
            {(hasSearched || query) && (
              <div style={{
                maxWidth: "680px", margin: "var(--space-4) auto 0",
                display: "flex", flexWrap: "wrap", gap: "var(--space-2)", alignItems: "center",
              }}>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-muted)", fontWeight: 600, flexShrink: 0 }}>
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
                      {selCategory === cat.slug && <span>✕</span>}
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
                          transition: "opacity 150ms ease",
                        }}
                      >
                        Browse page →
                      </Link>
                    )}
                  </span>
                ))}

                {PRICE_PRESETS.map((p) => {
                  const isSelected = selPrice?.min === p.min && selPrice?.max === p.max;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setSelPrice(isSelected ? null : { min: p.min, max: p.max })}
                      className={`filter-chip${isSelected ? " active" : ""}`}
                    >
                      {p.label}
                      {isSelected && <span>✕</span>}
                    </button>
                  );
                })}

                {(selCategory || selPrice) && (
                  <button
                    type="button"
                    onClick={() => { setSelCategory(""); setSelPrice(null); }}
                    style={{
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: "var(--text-xs)", color: "rgb(248,113,113)", fontWeight: 600,
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────────────── */}
        <div className="container" style={{ paddingBlock: "var(--space-10)" }}>

          {/* ── EMPTY STATE ─────────────────────────────────────────────────── */}
          {showEmpty && (
            <div>
              {recents.length > 0 && (
                <div style={{ marginBottom: "var(--space-10)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
                    <p className="eyebrow">Recent Searches</p>
                    <button
                      type="button"
                      onClick={() => { sessionStorage.removeItem(RECENT_KEY); setRecents([]); }}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
                        fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                      }}
                    >
                      Clear all
                    </button>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {recents.map((term) => (
                      <span key={term} style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <button type="button" className="suggestion-pill" onClick={() => selectSuggestion(term)}>
                          🕐 {term}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecent(term)}
                          aria-label={`Remove "${term}" from recent searches`}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--color-text-muted)", fontSize: "0.7rem",
                            padding: "0.2rem", lineHeight: 1,
                          }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: "var(--space-10)" }}>
                <p className="eyebrow" style={{ marginBottom: "var(--space-4)" }}>Popular Searches</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {POPULAR_SEARCHES.map((term) => (
                    <button key={term} type="button" className="suggestion-pill" onClick={() => selectSuggestion(term)}>
                      🔥 {term}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
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
                      <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                      <span style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "var(--text-xs)", letterSpacing: "0.08em",
                        textTransform: "uppercase", color: "var(--color-white)",
                        textAlign: "center", maxWidth: "none", lineHeight: 1.3,
                      }}>
                        {cat.name}
                      </span>
                      <span style={{
                        fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.06em",
                        color: cat.color, opacity: 0.75,
                      }}>
                        {cat.count} products
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LOADING SKELETONS ────────────────────────────────────────────── */}
          {loading && (
            <div>
              <div style={{ height: "24px", width: "180px", marginBottom: "var(--space-6)" }} className="skeleton" />
              <div className="results-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{
                    display: "flex", gap: "var(--space-4)", padding: "var(--space-4)",
                    borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-dark)",
                  }}>
                    <div className="skeleton" style={{ width: "72px", height: "72px", flexShrink: 0, borderRadius: "var(--radius-md)" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      <div className="skeleton" style={{ height: "16px", width: "80%" }} />
                      <div className="skeleton" style={{ height: "12px", width: "100%" }} />
                      <div className="skeleton" style={{ height: "12px", width: "60%" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NO RESULTS ──────────────────────────────────────────────────── */}
          {showNoMatch && (
            <div style={{ textAlign: "center", paddingBlock: "var(--space-16)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "var(--space-4)" }}>🔍</div>
              <h2 style={{ color: "var(--color-white)", marginBottom: "var(--space-3)" }}>
                No results for &ldquo;{query}&rdquo;
              </h2>
              <p style={{ color: "var(--color-text-muted)", maxWidth: "400px", margin: "0 auto var(--space-8)", lineHeight: "var(--leading-relaxed)" }}>
                Try different keywords, check the spelling, or browse by category below.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", justifyContent: "center", marginBottom: "var(--space-8)" }}>
                {POPULAR_SEARCHES.slice(0, 6).map((term) => (
                  <button key={term} type="button" className="suggestion-pill" onClick={() => selectSuggestion(term)}>
                    {term}
                  </button>
                ))}
              </div>
              <Link href="/products" className="btn btn-primary">
                Browse All Equipment →
              </Link>

              <div style={{ marginTop: "var(--space-12)", textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
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
                      <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
                      <span style={{
                        fontFamily: "var(--font-display)", fontWeight: 700,
                        fontSize: "var(--text-xs)", letterSpacing: "0.08em",
                        textTransform: "uppercase", color: "var(--color-white)",
                        textAlign: "center", maxWidth: "none", lineHeight: 1.3,
                      }}>
                        {cat.name}
                      </span>
                      <span style={{
                        fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.06em",
                        color: cat.color, opacity: 0.75,
                      }}>
                        {cat.count} products
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── RESULTS ─────────────────────────────────────────────────────── */}
          {showResults && (
            <div>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: "var(--space-6)", flexWrap: "wrap", gap: "var(--space-3)",
              }}>
                <p style={{ color: "var(--color-text-muted)", fontSize: "var(--text-sm)" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "var(--text-xl)", color: "var(--color-white)" }}>
                    {total.toLocaleString()}
                  </span>
                  {" "}result{total !== 1 ? "s" : ""} for{" "}
                  <span style={{ color: "var(--color-amber)", fontWeight: 600 }}>&ldquo;{query}&rdquo;</span>
                </p>
                <Link
                  href={`/products?q=${encodeURIComponent(query)}${selCategory ? `&category=${selCategory}` : ""}`}
                  style={{
                    fontSize: "var(--text-xs)", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", borderBottom: "2px solid var(--color-amber)",
                    paddingBottom: "2px", whiteSpace: "nowrap", color: "var(--color-amber)",
                  }}
                >
                  View all in catalog →
                </Link>
              </div>

              {/* Brand pills */}
              {brands.length > 1 && (
                <div style={{ marginBottom: "var(--space-6)" }}>
                  <p className="eyebrow" style={{ marginBottom: "var(--space-3)" }}>Brands in results</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                    {brands.map((b) => (
                      <button key={b.slug} type="button" className="suggestion-pill" onClick={() => selectSuggestion(b.name)}>
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
                      }}>
                        {name}
                      </h3>
                      <span style={{
                        background: "rgba(232,160,32,0.15)", color: "var(--color-amber)",
                        fontSize: "var(--text-xs)", fontWeight: 700, padding: "0.2rem 0.6rem",
                        borderRadius: "var(--radius-full)",
                      }}>
                        {items.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-3)", alignItems: "center" }}>
                      <Link
                        href={`/categories/${slug}`}
                        style={{
                          fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-muted)",
                          letterSpacing: "0.06em", transition: "color 150ms ease",
                        }}
                        title={`${name} category overview`}
                      >
                        Category page
                      </Link>
                      <span style={{ color: "var(--color-border-dark)", fontSize: "var(--text-xs)" }}>·</span>
                      <Link
                        href={`/products?category=${slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                        style={{
                          fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-amber)",
                          letterSpacing: "0.06em", transition: "opacity 150ms ease",
                        }}
                        title={`All ${name} products`}
                      >
                        All {name} →
                      </Link>
                    </div>
                  </div>
                  <div className="results-grid">
                    {items.map((p) => <SearchProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              ))}

              {/* Bottom CTA */}
              {total > results.length && (
                <div style={{ textAlign: "center", marginTop: "var(--space-6)", paddingTop: "var(--space-6)", borderTop: "1px solid var(--color-border-dark)" }}>
                  <p style={{ color: "var(--color-text-muted)", marginBottom: "var(--space-4)", fontSize: "var(--text-sm)" }}>
                    Showing {results.length} of {total} results
                  </p>
                  <Link
                    href={`/products?q=${encodeURIComponent(query)}${selCategory ? `&category=${selCategory}` : ""}`}
                    className="btn btn-outline-light"
                  >
                    View all {total} results in catalog →
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