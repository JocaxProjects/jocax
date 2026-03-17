// hooks/useDebounce.ts

"use client";

import { useState, useEffect } from "react";

// ─── useDebounce ──────────────────────────────────────────────────────────────

/**
 * Debounces a value by the given delay in milliseconds.
 * The returned value only updates once the input stops changing for `delay` ms.
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── useDebouncedCallback ─────────────────────────────────────────────────────

/**
 * Returns a debounced version of a callback function.
 * The callback is only invoked after it stops being called for `delay` ms.
 *
 * @example
 * const debouncedSave = useDebouncedCallback((value) => save(value), 500);
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const [timer, setTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    setTimer(setTimeout(() => callback(...args), delay));
  };
}