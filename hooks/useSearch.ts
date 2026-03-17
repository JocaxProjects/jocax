// hooks/useSearch.ts

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import type {
  SearchFilters,
  SearchResult,
  SearchSuggestion,
  SortOption,
} from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseSearchOptions {
  /** Sync filters with the URL query string. Default: true */
  syncUrl?: boolean;
  /** Debounce delay in ms. Default: 300 */
  debounceMs?: number;
  /** Number of results per page. Default: 20 */
  limit?: number;
}

interface UseSearchReturn {
  // State
  query: string;
  filters: SearchFilters;
  results: SearchResult | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setQuery: (query: string) => void;
  setFilter: <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => void;
  clearFilters: () => void;
  setPage: (page: number) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
}

const DEFAULT_FILTERS: SearchFilters = {
  query: "",
  page: 1,
};

const DEBOUNCE_MS = 300;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const {
    syncUrl = true,
    debounceMs = DEBOUNCE_MS,
    limit = 20,
  } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialise from URL if syncUrl is enabled
  const initialFilters: SearchFilters = syncUrl
    ? {
        query: searchParams.get("q") ?? "",
        brand: searchParams.get("brand") ?? undefined,
        category: searchParams.get("category") ?? undefined,
        minPrice: searchParams.get("minPrice")
          ? Number(searchParams.get("minPrice"))
          : undefined,
        maxPrice: searchParams.get("maxPrice")
          ? Number(searchParams.get("maxPrice"))
          : undefined,
        sort: (searchParams.get("sort") as SortOption) ?? undefined,
        page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      }
    : DEFAULT_FILTERS;

  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [debouncedQuery, setDebouncedQuery] = useState(initialFilters.query);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // ── Debounce query ────────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(filters.query);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [filters.query, debounceMs]);

  // ── Sync URL ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!syncUrl) return;

    const params = new URLSearchParams();
    if (filters.query) params.set("q", filters.query);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.category) params.set("category", filters.category);
    if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.page && filters.page > 1) params.set("page", String(filters.page));

    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  }, [filters, syncUrl, router, pathname]);

  // ── Fetch results ─────────────────────────────────────────────────────────
  useEffect(() => {
    // Cancel any in-flight request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        params.set("q", debouncedQuery);
        params.set("limit", String(limit));
        if (filters.brand) params.set("brand", filters.brand);
        if (filters.category) params.set("category", filters.category);
        if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
        if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
        if (filters.sort) params.set("sort", filters.sort);
        if (filters.page) params.set("page", String(filters.page));

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: abortRef.current?.signal,
        });

        if (!res.ok) throw new Error("Search request failed");

        const data: SearchResult = await res.json();
        setResults(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();

    return () => abortRef.current?.abort();
  }, [debouncedQuery, filters.brand, filters.category, filters.minPrice, filters.maxPrice, filters.sort, filters.page, limit]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const setQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, query, page: 1 }));
  }, []);

  const setFilter = useCallback(
    <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    },
    []
  );

  const clearFilters = useCallback(() => {
    setFilters((prev) => ({ query: prev.query, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }));
  }, []);

  const reset = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setResults(null);
  }, []);

  return {
    query: filters.query,
    filters,
    results,
    isLoading,
    error,
    setQuery,
    setFilter,
    clearFilters,
    setPage,
    setSort,
    reset,
  };
}

// ─── useSearchSuggestions ─────────────────────────────────────────────────────

interface UseSearchSuggestionsReturn {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  clear: () => void;
}

/**
 * Lightweight hook for autocomplete/typeahead suggestions.
 */
export function useSearchSuggestions(
  query: string,
  debounceMs = 200
): UseSearchSuggestionsReturn {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim() || query.length < 2) {
        setSuggestions([]);
        return;
      }

      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setIsLoading(true);

      try {
        const res = await fetch(
          `/api/search/suggestions?q=${encodeURIComponent(query)}`,
          { signal: abortRef.current.signal }
        );
        if (!res.ok) throw new Error("Suggestions request failed");
        const data: SearchSuggestion[] = await res.json();
        setSuggestions(data);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setSuggestions([]);
        }
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
      abortRef.current?.abort();
    };
  }, [query, debounceMs]);

  const clear = useCallback(() => setSuggestions([]), []);

  return { suggestions, isLoading, clear };
}