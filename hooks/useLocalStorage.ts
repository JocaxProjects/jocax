// hooks/useLocalStorage.ts

"use client";

import { useState, useEffect, useCallback } from "react";

// ─── useLocalStorage ──────────────────────────────────────────────────────────

/**
 * A useState-like hook that persists its value in localStorage.
 * SSR-safe — falls back to the initial value on the server.
 *
 * @example
 * const [recentlyViewed, setRecentlyViewed] = useLocalStorage<string[]>("recentlyViewed", []);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Keep in sync across tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      try {
        setStoredValue(
          event.newValue ? (JSON.parse(event.newValue) as T) : initialValue
        );
      } catch {
        // Ignore parse errors from other tabs
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [key, initialValue]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const next =
          typeof value === "function"
            ? (value as (prev: T) => T)(storedValue)
            : value;
        setStoredValue(next);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(next));
        }
      } catch {
        // localStorage may be unavailable (e.g. private browsing quota)
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

// ─── useRecentlyViewed ────────────────────────────────────────────────────────

const RECENTLY_VIEWED_KEY = "jocax_recently_viewed";
const MAX_RECENTLY_VIEWED = 10;

export interface RecentlyViewedItem {
  slug: string;
  name: string;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  viewedAt: number;
}

/**
 * Track and retrieve recently viewed products.
 * Persisted in localStorage with a cap of 10 items.
 *
 * @example
 * const { items, addItem, clear } = useRecentlyViewed();
 */
export function useRecentlyViewed() {
  const [items, setItems, clearItems] = useLocalStorage<RecentlyViewedItem[]>(
    RECENTLY_VIEWED_KEY,
    []
  );

  const addItem = useCallback(
    (item: Omit<RecentlyViewedItem, "viewedAt">) => {
      setItems((prev) => {
        const filtered = prev.filter((p) => p.slug !== item.slug);
        return [{ ...item, viewedAt: Date.now() }, ...filtered].slice(
          0,
          MAX_RECENTLY_VIEWED
        );
      });
    },
    [setItems]
  );

  return { items, addItem, clear: clearItems };
}