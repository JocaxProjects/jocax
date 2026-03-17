"use client";

import { useReducer, useEffect, useCallback } from "react";
import type { ProductDetail, ProductListItem, PaginatedResult } from "@/types";

export interface GetProductsOptions {
  page?:         number;
  limit?:        number;
  categorySlug?: string;
  brandSlug?:    string;
  minPrice?:     number;
  maxPrice?:     number;
  sort?:         string;
  search?:       string;
}

// ─── useProduct ───────────────────────────────────────────────────────────────

interface ProductState {
  product:   ProductDetail | null;
  isLoading: boolean;
  error:     string | null;
}

type ProductAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: ProductDetail }
  | { type: "ERROR";   payload: string };

function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case "LOADING": return { product: null, isLoading: true,  error: null };
    case "SUCCESS": return { product: action.payload, isLoading: false, error: null };
    case "ERROR":   return { product: null, isLoading: false, error: action.payload };
  }
}

export function useProduct(slug: string) {
  const [state, dispatch] = useReducer(productReducer, {
    product: null, isLoading: true, error: null,
  });
  const [tick, setTick] = useReducer((t: number) => t + 1, 0);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    dispatch({ type: "LOADING" });

    fetch(`/api/products/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data: ProductDetail) => {
        if (!cancelled) dispatch({ type: "SUCCESS", payload: data });
      })
      .catch((err: unknown) => {
        if (!cancelled) dispatch({
          type: "ERROR",
          payload: err instanceof Error ? err.message : "Failed to load product",
        });
      });

    return () => { cancelled = true; };
  }, [slug, tick]);

  const refetch = useCallback(() => setTick(), [setTick]);
  return state;
}

// ─── useProducts ──────────────────────────────────────────────────────────────

interface ProductsState {
  products:   ProductListItem[];
  total:      number;
  totalPages: number;
  isLoading:  boolean;
  error:      string | null;
}

type ProductsAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: { products: ProductListItem[]; total: number; totalPages: number } }
  | { type: "ERROR";   payload: string };

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case "LOADING": return { ...state, isLoading: true,  error: null };
    case "SUCCESS": return {
      products:   action.payload.products,
      total:      action.payload.total,
      totalPages: action.payload.totalPages,
      isLoading:  false,
      error:      null,
    };
    case "ERROR": return { ...state, isLoading: false, error: action.payload };
  }
}

export function useProducts(opts: GetProductsOptions = {}) {
  const [state, dispatch] = useReducer(productsReducer, {
    products: [], total: 0, totalPages: 0, isLoading: true, error: null,
  });
  const [tick, setTick] = useReducer((t: number) => t + 1, 0);

  const optsKey = JSON.stringify(opts);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "LOADING" });

    const params = new URLSearchParams();
    if (opts.page)                   params.set("page",     String(opts.page));
    if (opts.limit)                  params.set("limit",    String(opts.limit));
    if (opts.categorySlug)           params.set("category", opts.categorySlug);
    if (opts.brandSlug)              params.set("brand",    opts.brandSlug);
    if (opts.minPrice !== undefined) params.set("minPrice", String(opts.minPrice));
    if (opts.maxPrice !== undefined) params.set("maxPrice", String(opts.maxPrice));
    if (opts.sort)                   params.set("sort",     opts.sort);
    if (opts.search)                 params.set("q",        opts.search);

    fetch(`/api/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json() as Promise<PaginatedResult<ProductListItem>>;
      })
      .then((data) => {
        if (!cancelled) dispatch({
          type: "SUCCESS",
          payload: {
            products:   data.data,
            total:      data.pagination.total,
            totalPages: data.pagination.totalPages,
          },
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) dispatch({
          type: "ERROR",
          payload: err instanceof Error ? err.message : "Failed to load products",
        });
      });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optsKey, tick]);

  const refetch = useCallback(() => setTick(), [setTick]);
  return { ...state, refetch };
}

// ─── useFeaturedProducts ──────────────────────────────────────────────────────

interface FeaturedState {
  products:  ProductListItem[];
  isLoading: boolean;
  error:     string | null;
}

type FeaturedAction =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: ProductListItem[] }
  | { type: "ERROR";   payload: string };

function featuredReducer(state: FeaturedState, action: FeaturedAction): FeaturedState {
  switch (action.type) {
    case "LOADING": return { ...state, isLoading: true,  error: null };
    case "SUCCESS": return { products: action.payload, isLoading: false, error: null };
    case "ERROR":   return { ...state, isLoading: false, error: action.payload };
  }
}

export function useFeaturedProducts(limit = 8) {
  const [state, dispatch] = useReducer(featuredReducer, {
    products: [], isLoading: true, error: null,
  });

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "LOADING" });

    fetch(`/api/products?featured=true&limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch featured products");
        return res.json() as Promise<PaginatedResult<ProductListItem>>;
      })
      .then((data) => {
        if (!cancelled) dispatch({ type: "SUCCESS", payload: data.data });
      })
      .catch((err: unknown) => {
        if (!cancelled) dispatch({
          type: "ERROR",
          payload: err instanceof Error ? err.message : "Failed to load featured products",
        });
      });

    return () => { cancelled = true; };
  }, [limit]);

  return state;
}