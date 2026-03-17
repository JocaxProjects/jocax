// hooks/useFilters.ts

"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { SortOption } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: SortOption;
  page: number;
}

interface UseFiltersOptions {
  /** Base path to build filter URLs against. Defaults to current pathname. */
  basePath?: string;
  /** Default sort order. Default: "featured" */
  defaultSort?: SortOption;
}

interface UseFiltersReturn {
  filters: FilterState;
  hasActiveFilters: boolean;
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  clearFilter: (key: keyof FilterState) => void;
  clearAll: () => void;
  setPage: (page: number) => void;
  setSort: (sort: SortOption) => void;
  buildUrl: (overrides?: Partial<FilterState>) => string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useFilters(options: UseFiltersOptions = {}): UseFiltersReturn {
  const { defaultSort = "featured" } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const basePath = options.basePath ?? pathname;

  const [filters, setFilters] = useState<FilterState>(() => ({
    brand: searchParams.get("brand") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    minPrice: searchParams.get("minPrice")
      ? Number(searchParams.get("minPrice"))
      : undefined,
    maxPrice: searchParams.get("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : undefined,
    sort: (searchParams.get("sort") as SortOption) ?? defaultSort,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  }));

  // ── Build URL from filter state ───────────────────────────────────────────

  const buildUrl = useCallback(
    (overrides: Partial<FilterState> = {}): string => {
      const merged = { ...filters, page: 1, ...overrides };
      const params = new URLSearchParams();

      if (merged.brand) params.set("brand", merged.brand);
      if (merged.category) params.set("category", merged.category);
      if (merged.minPrice !== undefined) params.set("minPrice", String(merged.minPrice));
      if (merged.maxPrice !== undefined) params.set("maxPrice", String(merged.maxPrice));
      if (merged.sort && merged.sort !== defaultSort) params.set("sort", merged.sort);
      if (merged.page > 1) params.set("page", String(merged.page));

      const qs = params.toString();
      return `${basePath}${qs ? `?${qs}` : ""}`;
    },
    [filters, basePath, defaultSort]
  );

  // ── Sync state and push URL ───────────────────────────────────────────────

  const applyFilters = useCallback(
    (next: FilterState) => {
      setFilters(next);
      const params = new URLSearchParams();
      if (next.brand) params.set("brand", next.brand);
      if (next.category) params.set("category", next.category);
      if (next.minPrice !== undefined) params.set("minPrice", String(next.minPrice));
      if (next.maxPrice !== undefined) params.set("maxPrice", String(next.maxPrice));
      if (next.sort && next.sort !== defaultSort) params.set("sort", next.sort);
      if (next.page > 1) params.set("page", String(next.page));
      const qs = params.toString();
      router.push(`${basePath}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, basePath, defaultSort]
  );

  // ── Actions ───────────────────────────────────────────────────────────────

  const setFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      applyFilters({ ...filters, [key]: value, page: 1 });
    },
    [filters, applyFilters]
  );

  const clearFilter = useCallback(
    (key: keyof FilterState) => {
      const next = { ...filters, page: 1 };
      delete next[key];
      if (key === "sort") next.sort = defaultSort;
      applyFilters(next);
    },
    [filters, applyFilters, defaultSort]
  );

  const clearAll = useCallback(() => {
    applyFilters({ sort: defaultSort, page: 1 });
  }, [applyFilters, defaultSort]);

  const setPage = useCallback(
    (page: number) => {
      applyFilters({ ...filters, page });
    },
    [filters, applyFilters]
  );

  const setSort = useCallback(
    (sort: SortOption) => {
      applyFilters({ ...filters, sort, page: 1 });
    },
    [filters, applyFilters]
  );

  // ── Derived ───────────────────────────────────────────────────────────────

  const hasActiveFilters = useMemo(
    () =>
      !!(
        filters.brand ||
        filters.category ||
        filters.minPrice !== undefined ||
        filters.maxPrice !== undefined
      ),
    [filters]
  );

  return {
    filters,
    hasActiveFilters,
    setFilter,
    clearFilter,
    clearAll,
    setPage,
    setSort,
    buildUrl,
  };
}