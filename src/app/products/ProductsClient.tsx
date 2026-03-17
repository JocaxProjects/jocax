"use client";
// src/app/products/ProductsClient.tsx
// Enhanced UX/UI — premium B2B industrial design using Jocax design system.
// Fully responsive: mobile-first, tablet, desktop, wide screens.

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { ProductListItem } from "@/types";
import ProductGrid from "@/components/ProductCard/ProductGrid";

interface FilterOption { id: string; name: string; slug: string; }

interface ProductsClientProps {
  initialProducts: ProductListItem[];
  initialTotal:    number;
  brands:          FilterOption[];
  categories:      FilterOption[];
  searchParams: {
    brand?: string; category?: string; minPrice?: string;
    maxPrice?: string; sort?: string; page?: string; q?: string;
  };
}

const PRODUCTS_PER_PAGE = 24;

const SORT_OPTIONS = [
  { value: "featured",   label: "Featured"          },
  { value: "newest",     label: "Newest"            },
  { value: "price_asc",  label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
];

export default function ProductsClient({
  initialProducts, initialTotal, brands, categories, searchParams: initialParams,
}: ProductsClientProps) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [products, setProducts]       = useState<ProductListItem[]>(initialProducts);
  const [total, setTotal]             = useState(initialTotal);
  const [loading, setLoading]         = useState(false);
  const [searchValue, setSearchValue] = useState(initialParams.q ?? "");
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const [sortOpen, setSortOpen]       = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortRef    = useRef<AbortController | undefined>(undefined);
  const sortRef     = useRef<HTMLDivElement>(null);

  const currentParams = useMemo(() => ({
    q:        searchParams.get("q")        ?? "",
    brand:    searchParams.get("brand")    ?? "",
    category: searchParams.get("category") ?? "",
    minPrice: searchParams.get("minPrice") ?? "",
    maxPrice: searchParams.get("maxPrice") ?? "",
    sort:     searchParams.get("sort")     ?? "featured",
    page:     searchParams.get("page")     ?? "1",
  }), [searchParams]);

  const pushParams = useCallback((overrides: Partial<typeof currentParams>) => {
    const next = { ...currentParams, page: "1", ...overrides };
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => { if (v && (v !== "featured" || k === "sort")) params.set(k, v); });
    startTransition(() => { router.push(`/products?${params.toString()}`, { scroll: false }); });
  }, [currentParams, router]);

  const fetchProducts = useCallback(async (params: typeof currentParams) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => { if (v) qs.set(k, v); });
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const res  = await fetch(`${base}/api/products?${qs.toString()}`, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      setProducts(data.products);
      setTotal(data.total);
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== "AbortError") console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(currentParams); }, [searchParams.toString()]);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { pushParams({ q: value, page: "1" }); }, 350);
  };

  const handlePriceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    pushParams({ minPrice: fd.get("minPrice") as string, maxPrice: fd.get("maxPrice") as string });
    setDrawerOpen(false);
  };

  const clearAllFilters = () => {
    setSearchValue("");
    pushParams({ q: "", brand: "", category: "", minPrice: "", maxPrice: "" });
  };

  const hasActiveFilters = !!(currentParams.brand || currentParams.category ||
    currentParams.minPrice || currentParams.maxPrice || currentParams.q);

  const activeFilterCount = [
    currentParams.brand,
    currentParams.category,
    currentParams.minPrice || currentParams.maxPrice ? "price" : "",
    currentParams.q,
  ].filter(Boolean).length;

  const totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  const page       = parseInt(currentParams.page, 10);
  const currentSortLabel = SORT_OPTIONS.find(o => o.value === currentParams.sort)?.label ?? "Featured";

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    Object.entries({ ...currentParams, page: String(p) }).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/products?${params.toString()}`;
  }

  // Pagination range helper
  function getPageRange(current: number, total: number, delta = 2): (number | "…")[] {
    const range: (number | "…")[] = [];
    const left  = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);
    range.push(1);
    if (left > 2) range.push("…");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push("…");
    if (total > 1) range.push(total);
    return range;
  }

  // ── Filter Panel (shared between sidebar + drawer) ──
  const FilterPanel = ({ inDrawer = false }: { inDrawer?: boolean }) => (
    <div className={inDrawer ? "space-y-6" : "space-y-6 sticky top-[calc(var(--nav-height)+1.5rem)]"}>

      {/* Category */}
      <FilterSection title="Category">
        <FilterItem
          label="All Categories"
          active={!currentParams.category}
          onClick={() => { pushParams({ category: "" }); if (inDrawer) setDrawerOpen(false); }}
        />
        {categories.map((cat) => (
          <FilterItem key={cat.id} label={cat.name} active={currentParams.category === cat.slug}
            onClick={() => { pushParams({ category: cat.slug }); if (inDrawer) setDrawerOpen(false); }} />
        ))}
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <FilterItem
          label="All Brands"
          active={!currentParams.brand}
          onClick={() => { pushParams({ brand: "" }); if (inDrawer) setDrawerOpen(false); }}
        />
        {brands.map((brand) => (
          <FilterItem key={brand.id} label={brand.name} active={currentParams.brand === brand.slug}
            onClick={() => { pushParams({ brand: brand.slug }); if (inDrawer) setDrawerOpen(false); }} />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <form onSubmit={handlePriceSubmit} className="space-y-3 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs pointer-events-none">$</span>
              <input
                type="number" name="minPrice" placeholder="Min"
                defaultValue={currentParams.minPrice}
                className="w-full pl-6 pr-2 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber-muted)] transition-all"
              />
            </div>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-xs pointer-events-none">$</span>
              <input
                type="number" name="maxPrice" placeholder="Max"
                defaultValue={currentParams.maxPrice}
                className="w-full pl-6 pr-2 py-2 text-sm rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-amber)] focus:ring-2 focus:ring-[var(--color-amber-muted)] transition-all"
              />
            </div>
          </div>
          <button type="submit" className="filter-apply-btn">Apply Price</button>
        </form>
      </FilterSection>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={() => { clearAllFilters(); if (inDrawer) setDrawerOpen(false); }}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-error)] border border-[var(--color-error-border)] rounded-md hover:bg-[var(--color-error-bg)] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-catalog-bg)" }}>

      {/* ── Drawer Overlay ── */}
      <div
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
        style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(2px)",
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? "auto" : "none",
          transition: "opacity 300ms ease",
        }}
        className="lg:hidden"
      />

      {/* ── Mobile Filter Drawer ── */}
      <div
        role="dialog" aria-modal="true" aria-label="Filters"
        style={{
          position: "fixed", inset: "0 auto 0 0", zIndex: 50,
          width: "min(20rem, 90vw)",
          backgroundColor: "var(--color-surface)",
          boxShadow: "var(--shadow-xl)",
          transform: drawerOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 300ms cubic-bezier(0.32,0.72,0,1)",
          display: "flex", flexDirection: "column",
        }}
        className="lg:hidden"
      >
        {/* Drawer Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "1.25rem 1.25rem 1rem",
          borderBottom: "1px solid var(--color-border)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <svg style={{ width: "1rem", height: "1rem", color: "var(--color-amber)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "var(--text-sm)",
              letterSpacing: "var(--tracking-wide)", textTransform: "uppercase",
              color: "var(--color-text-primary)",
            }}>
              Filters
            </span>
            {activeFilterCount > 0 && (
              <span style={{
                background: "var(--color-amber)", color: "var(--color-ink)",
                fontSize: "0.625rem", fontWeight: 700,
                borderRadius: "var(--radius-full)", padding: "0.1rem 0.45rem",
              }}>
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              padding: "0.5rem", borderRadius: "var(--radius-md)",
              color: "var(--color-text-muted)",
              transition: "background var(--transition-fast), color var(--transition-fast)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--color-surface-alt)";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--color-text-muted)";
            }}
            aria-label="Close filters"
          >
            <svg style={{ width: "1.25rem", height: "1.25rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ overflowY: "auto", flex: 1, padding: "1.25rem" }}>
          <FilterPanel inDrawer />
        </div>
      </div>

      {/* ── Page Header ── */}
      <div style={{
        background: "var(--color-steel)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="container" style={{ paddingBlock: "clamp(1.25rem, 4vw, 2rem)" }}>

          {/* Breadcrumb */}
          <nav style={{ marginBottom: "0.875rem" }} aria-label="Breadcrumb">
            <ol style={{ display: "flex", alignItems: "center", gap: "0.375rem", listStyle: "none", padding: 0, margin: 0 }}>
              <li>
                <Link href="/" style={{
                  fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-body)", transition: "color var(--transition-fast)",
                  textDecoration: "none",
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
                >
                  Home
                </Link>
              </li>
              <li style={{ color: "rgba(255,255,255,0.25)", fontSize: "var(--text-xs)" }}>›</li>
              <li style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-body)" }}>
                Catalog
              </li>
            </ol>
          </nav>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow-light" style={{ marginBottom: "0.375rem" }}>Full Catalog</p>
              <h1 style={{
                fontFamily: "var(--font-display)", fontWeight: 700,
                fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
                color: "var(--color-white)", letterSpacing: "-0.01em",
                textTransform: "uppercase", lineHeight: 1.05, margin: 0,
              }}>
                Commercial Kitchen Equipment
              </h1>
            </div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-md)", padding: "0.5rem 0.875rem",
              flexShrink: 0,
            }}>
              <span style={{ fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-body)" }}>
                {loading ? "Searching…" : (
                  <>
                    <span style={{ fontWeight: 700, color: "var(--color-amber)", fontSize: "var(--text-sm)" }}>
                      {total.toLocaleString()}
                    </span>
                    {" "}
                    <span style={{ color: "rgba(255,255,255,0.5)" }}>
                      {total === 1 ? "product" : "products"}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div style={{ marginTop: "1.25rem", display: "flex", gap: "0.625rem", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1 }}>
              {/* Search icon */}
              <svg style={{
                position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)",
                width: "1rem", height: "1rem", color: "rgba(255,255,255,0.3)", pointerEvents: "none",
              }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>

              <input
                type="search"
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search equipment, brands, models…"
                aria-label="Search products"
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  borderRadius: "var(--radius-lg)",
                  paddingLeft: "2.625rem", paddingRight: "2.75rem",
                  paddingBlock: "0.75rem",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-white)",
                  fontFamily: "var(--font-body)",
                  outline: "none",
                  transition: "border-color var(--transition-fast), background var(--transition-fast), box-shadow var(--transition-fast)",
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor = "var(--color-amber)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--color-amber-muted)";
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              {/* Loading spinner / clear button */}
              <div style={{
                position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)",
              }}>
                {(loading || isPending) ? (
                  <div style={{
                    width: "1rem", height: "1rem",
                    border: "2px solid var(--color-amber)",
                    borderTopColor: "transparent",
                    borderRadius: "var(--radius-full)",
                    animation: "spin 0.7s linear infinite",
                  }} />
                ) : searchValue ? (
                  <button
                    onClick={() => { setSearchValue(""); pushParams({ q: "" }); }}
                    style={{
                      color: "rgba(255,255,255,0.4)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "1.25rem", height: "1.25rem", borderRadius: "var(--radius-full)",
                      transition: "color var(--transition-fast), background var(--transition-fast)",
                    }}
                    aria-label="Clear search"
                  >
                    <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div style={{
              marginTop: "0.875rem",
              display: "flex", alignItems: "center", gap: "0.5rem",
              overflowX: "auto", paddingBottom: "0.25rem",
              msOverflowStyle: "none", scrollbarWidth: "none",
            }}>
              <span style={{
                fontSize: "var(--text-xs)", color: "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-body)", flexShrink: 0, fontWeight: 500,
              }}>
                Active:
              </span>

              {currentParams.q && (
                <ActiveChip
                  label={`"${currentParams.q}"`}
                  onRemove={() => { setSearchValue(""); pushParams({ q: "" }); }}
                />
              )}
              {currentParams.category && (
                <ActiveChip
                  label={categories.find(c => c.slug === currentParams.category)?.name ?? currentParams.category}
                  onRemove={() => pushParams({ category: "" })}
                />
              )}
              {currentParams.brand && (
                <ActiveChip
                  label={brands.find(b => b.slug === currentParams.brand)?.name ?? currentParams.brand}
                  onRemove={() => pushParams({ brand: "" })}
                />
              )}
              {(currentParams.minPrice || currentParams.maxPrice) && (
                <ActiveChip
                  label={`$${currentParams.minPrice || "0"} – $${currentParams.maxPrice || "∞"}`}
                  onRemove={() => pushParams({ minPrice: "", maxPrice: "" })}
                />
              )}

              <button
                onClick={clearAllFilters}
                style={{
                  flexShrink: 0, marginLeft: "0.25rem",
                  fontSize: "var(--text-xs)", color: "rgba(255,180,180,0.8)",
                  fontWeight: 600, letterSpacing: "0.03em",
                  background: "rgba(185,28,28,0.15)",
                  border: "1px solid rgba(185,28,28,0.25)",
                  borderRadius: "var(--radius-full)",
                  padding: "0.25rem 0.625rem",
                  cursor: "pointer",
                  transition: "background var(--transition-fast)",
                  fontFamily: "var(--font-body)",
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Toolbar Strip ── */}
      <div style={{
        background: "var(--color-surface)",
        borderBottom: "1px solid var(--color-border)",
        position: "sticky", top: "var(--nav-height)", zIndex: 30,
      }}>
        <div className="container" style={{ paddingBlock: "0.625rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>

            {/* Left: mobile filter button */}
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.5rem",
                padding: "0.5rem 0.875rem",
                border: "1.5px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                background: hasActiveFilters ? "var(--color-amber-muted)" : "var(--color-surface)",
                borderColor: hasActiveFilters ? "var(--color-amber)" : "var(--color-border)",
                color: hasActiveFilters ? "var(--color-amber-dark)" : "var(--color-text-secondary)",
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase", cursor: "pointer",
                transition: "all var(--transition-fast)",
              }}
              className="lg:hidden"
              aria-label="Open filters"
            >
              <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span style={{
                  background: "var(--color-amber)", color: "var(--color-ink)",
                  fontSize: "0.625rem", fontWeight: 800,
                  borderRadius: "var(--radius-full)", padding: "0.05rem 0.35rem",
                  lineHeight: 1.5, minWidth: "1rem", textAlign: "center",
                }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Result count — desktop */}
            <p style={{
              fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
              fontFamily: "var(--font-body)", display: "none",
            }} className="lg:block">
              {loading ? (
                <span style={{ color: "var(--color-text-faint)" }}>Searching…</span>
              ) : (
                <>
                  <span style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {total.toLocaleString()}
                  </span>
                  {" "}{total === 1 ? "product" : "products"}
                </>
              )}
            </p>

            {/* Right: sort controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginLeft: "auto" }}>
              <span style={{
                fontSize: "var(--text-xs)", color: "var(--color-text-muted)",
                fontFamily: "var(--font-body)", fontWeight: 500,
                display: "none",
              }} className="md:block">
                Sort by:
              </span>

              {/* Mobile: compact dropdown */}
              <div ref={sortRef} style={{ position: "relative" }} className="sm:hidden">
                <button
                  onClick={() => setSortOpen(o => !o)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "0.375rem",
                    padding: "0.5rem 0.75rem",
                    border: "1.5px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-secondary)",
                    fontFamily: "var(--font-body)", fontWeight: 500,
                    fontSize: "var(--text-xs)", cursor: "pointer",
                    transition: "border-color var(--transition-fast)",
                  }}
                >
                  {currentSortLabel}
                  <svg style={{
                    width: "0.875rem", height: "0.875rem",
                    transform: sortOpen ? "rotate(180deg)" : "rotate(0)",
                    transition: "transform var(--transition-fast)",
                  }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sortOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: "calc(100% + 0.375rem)", zIndex: 50,
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-lg)",
                    boxShadow: "var(--shadow-lg)",
                    overflow: "hidden", minWidth: "11rem",
                  }}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { pushParams({ sort: opt.value }); setSortOpen(false); }}
                        style={{
                          display: "block", width: "100%", textAlign: "left",
                          padding: "0.625rem 0.875rem",
                          fontSize: "var(--text-sm)", fontFamily: "var(--font-body)",
                          color: currentParams.sort === opt.value ? "var(--color-amber-dark)" : "var(--color-text-secondary)",
                          background: currentParams.sort === opt.value ? "var(--color-amber-muted)" : "transparent",
                          fontWeight: currentParams.sort === opt.value ? 600 : 400,
                          cursor: "pointer",
                          borderBottom: "1px solid var(--color-border)",
                          transition: "background var(--transition-fast)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tablet+: pill buttons */}
              <div style={{ display: "none", alignItems: "center", gap: "0.375rem" }} className="hidden sm:flex">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => pushParams({ sort: opt.value })}
                    style={{
                      padding: "0.4375rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      fontSize: "var(--text-xs)",
                      fontFamily: "var(--font-display)", fontWeight: 500,
                      letterSpacing: "var(--tracking-wide)",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all var(--transition-fast)",
                      border: "1.5px solid",
                      background: currentParams.sort === opt.value ? "var(--color-ink)" : "var(--color-surface)",
                      borderColor: currentParams.sort === opt.value ? "var(--color-ink)" : "var(--color-border)",
                      color: currentParams.sort === opt.value ? "var(--color-white)" : "var(--color-text-secondary)",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="container" style={{ paddingBlock: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <div style={{ display: "flex", gap: "clamp(1.5rem, 3vw, 2.5rem)", alignItems: "start" }}>

          {/* ── Desktop Sidebar ── */}
          <aside style={{
            width: "var(--sidebar-width)", flexShrink: 0,
            display: "none",
          }} className="lg:block">
            {/* Sidebar Header */}
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: "1.25rem",
              paddingBottom: "0.75rem",
              borderBottom: "2px solid var(--color-amber)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg style={{ width: "0.875rem", height: "0.875rem", color: "var(--color-amber)" }}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                <span style={{
                  fontFamily: "var(--font-display)", fontWeight: 600,
                  fontSize: "var(--text-sm)", letterSpacing: "var(--tracking-wide)",
                  textTransform: "uppercase", color: "var(--color-text-primary)",
                }}>
                  Refine
                </span>
              </div>
              {activeFilterCount > 0 && (
                <span style={{
                  background: "var(--color-amber)", color: "var(--color-ink)",
                  fontSize: "0.625rem", fontWeight: 700,
                  borderRadius: "var(--radius-full)", padding: "0.15rem 0.5rem",
                  fontFamily: "var(--font-body)",
                }}>
                  {activeFilterCount} active
                </span>
              )}
            </div>
            <FilterPanel />
          </aside>

          {/* ── Product Area ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Loading overlay */}
            <div style={{
              opacity: loading ? 1 : 0,
              pointerEvents: loading ? "auto" : "none",
              transition: "opacity var(--transition-base)",
            }}>
              {loading && (
                <div style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  padding: "0.625rem 1rem",
                  background: "var(--color-amber-muted)",
                  border: "1px solid rgba(232,160,32,0.25)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "1rem",
                }}>
                  <div style={{
                    width: "0.875rem", height: "0.875rem",
                    border: "2px solid var(--color-amber)",
                    borderTopColor: "transparent",
                    borderRadius: "var(--radius-full)",
                    animation: "spin 0.7s linear infinite",
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: "var(--text-xs)", color: "var(--color-amber-dark)",
                    fontFamily: "var(--font-body)", fontWeight: 500,
                  }}>
                    Updating results…
                  </span>
                </div>
              )}
            </div>

            {/* Product Grid */}
            <ProductGrid
              products={products} columns={3} showToggle loading={loading}
              skeletonCount={6} priorityCount={6}
              emptyMessage="No products match your filters. Try adjusting your search or clearing some filters."
              cardProps={{ showDescription: true, showSpecs: false, showStock: true }}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: "0.25rem",
                  marginTop: "clamp(2rem, 5vw, 3rem)",
                  paddingTop: "clamp(1.5rem, 4vw, 2rem)",
                  borderTop: "1px solid var(--color-border)",
                }}
              >
                {/* Prev */}
                {page > 1 ? (
                  <Link
                    href={pageUrl(page - 1)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", fontWeight: 500,
                      textDecoration: "none",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Prev</span>
                  </Link>
                ) : (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-faint)",
                    fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", fontWeight: 500,
                    opacity: 0.45, cursor: "not-allowed",
                  }}>
                    <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Prev</span>
                  </span>
                )}

                {/* Page numbers */}
                {getPageRange(page, totalPages).map((p, i) =>
                  p === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      style={{
                        width: "2.25rem", height: "2.25rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "var(--text-sm)", color: "var(--color-text-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      …
                    </span>
                  ) : (
                    <Link
                      key={p}
                      href={pageUrl(p as number)}
                      aria-current={p === page ? "page" : undefined}
                      style={{
                        width: "2.25rem", height: "2.25rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        borderRadius: "var(--radius-md)",
                        border: "1.5px solid",
                        fontSize: "var(--text-sm)", fontFamily: "var(--font-body)",
                        textDecoration: "none",
                        transition: "all var(--transition-fast)",
                        background: p === page ? "var(--color-ink)" : "var(--color-surface)",
                        borderColor: p === page ? "var(--color-ink)" : "var(--color-border)",
                        color: p === page ? "var(--color-white)" : "var(--color-text-secondary)",
                        fontWeight: p === page ? 700 : 500,
                      }}
                    >
                      {p}
                    </Link>
                  )
                )}

                {/* Next */}
                {page < totalPages ? (
                  <Link
                    href={pageUrl(page + 1)}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "var(--radius-md)",
                      border: "1.5px solid var(--color-border)",
                      background: "var(--color-surface)",
                      color: "var(--color-text-secondary)",
                      fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", fontWeight: 500,
                      textDecoration: "none",
                      transition: "all var(--transition-fast)",
                    }}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ) : (
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: "0.25rem",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "var(--radius-md)",
                    border: "1.5px solid var(--color-border)",
                    background: "var(--color-surface)",
                    color: "var(--color-text-faint)",
                    fontSize: "var(--text-sm)", fontFamily: "var(--font-body)", fontWeight: 500,
                    opacity: 0.45, cursor: "not-allowed",
                  }}>
                    <span className="hidden sm:inline">Next</span>
                    <svg style={{ width: "0.875rem", height: "0.875rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </nav>
            )}

          </div>
        </div>
      </div>

      {/* Spin keyframe */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 0; height: 0; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }

        /* Hover states for pagination links */
        nav[aria-label="Pagination"] a:hover {
          border-color: var(--color-ink) !important;
          background: var(--color-surface-alt) !important;
        }
        nav[aria-label="Pagination"] a[aria-current="page"]:hover {
          background: var(--color-steel) !important;
          border-color: var(--color-steel) !important;
        }

        /* Sidebar show on lg */
        @media (min-width: 1024px) {
          aside { display: block !important; }
          .lg\\:hidden { display: none !important; }
          .lg\\:block { display: block !important; }
        }

        /* Tablet+ flex show for sort pills */
        @media (min-width: 640px) {
          .hidden.sm\\:flex { display: flex !important; }
          .sm\\:hidden { display: none !important; }
          .hidden.sm\\:inline { display: inline !important; }
          .hidden.sm\\:block { display: block !important; }
        }

        @media (min-width: 768px) {
          .hidden.md\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}

/* ── Sub-components ── */

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: "0.375rem",
        marginBottom: "0.625rem",
        paddingBottom: "0.5rem",
        borderBottom: "1px solid var(--color-border)",
      }}>
        <span style={{
          fontFamily: "var(--font-body)", fontWeight: 700,
          fontSize: "var(--text-xs)",
          letterSpacing: "var(--tracking-widest)",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
        }}>
          {title}
        </span>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        {children}
      </ul>
    </div>
  );
}

function FilterItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          width: "100%", textAlign: "left",
          padding: "0.5rem 0.625rem",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--text-sm)", fontFamily: "var(--font-body)",
          fontWeight: active ? 600 : 400,
          color: active ? "var(--color-amber-dark)" : "var(--color-text-secondary)",
          background: active ? "var(--color-amber-muted)" : "transparent",
          border: active ? "1px solid rgba(232,160,32,0.2)" : "1px solid transparent",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}
        onMouseEnter={e => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "var(--color-surface-alt)";
            (e.currentTarget as HTMLElement).style.color = "var(--color-text-primary)";
          }
        }}
        onMouseLeave={e => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "var(--color-text-secondary)";
          }
        }}
      >
        {active && (
          <svg style={{ width: "0.75rem", height: "0.75rem", color: "var(--color-amber)", flexShrink: 0 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
        <span style={{ flex: 1 }}>{label}</span>
      </button>
    </li>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "0.375rem",
      background: "rgba(232,160,32,0.15)",
      border: "1px solid rgba(232,160,32,0.3)",
      color: "var(--color-amber-light)",
      fontSize: "var(--text-xs)", fontWeight: 500, fontFamily: "var(--font-body)",
      padding: "0.25rem 0.5rem 0.25rem 0.625rem",
      borderRadius: "var(--radius-full)", flexShrink: 0,
      maxWidth: "12rem",
    }}>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
      <button
        onClick={onRemove}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "1rem", height: "1rem", flexShrink: 0,
          borderRadius: "var(--radius-full)",
          color: "rgba(245,184,64,0.6)",
          cursor: "pointer",
          transition: "all var(--transition-fast)",
          background: "rgba(255,255,255,0.1)",
        }}
        aria-label={`Remove ${label} filter`}
      >
        <svg style={{ width: "0.625rem", height: "0.625rem" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </span>
  );
}