"use client";

// components/ProductCard/ProductCardClient.tsx
//
// Thin interactive wrapper around ProductCard.
//
// `display: contents` collapses this div out of the layout so the inner
// ProductCard participates in grid/flex exactly as if it were unwrapped.
//
// ⚠️  The inner ProductCard already renders a Next.js <Link> that handles
//     navigation to /products/[slug]. Do NOT call router.push() or any
//     other navigation inside `onClick` — that races with the <Link> and
//     can land on the wrong route. Keep onClick for side-effects only
//     (analytics, selected state, modals, etc.).

import ProductCard from "./index";
import type { ProductCardProps } from "./index";
import type { ProductListItem } from "@/types";

interface ProductCardInteractiveProps extends ProductCardProps {
  /**
   * Side-effect callback only — do NOT navigate inside this handler.
   * The <Link> inside ProductCard handles all routing.
   */
  onClick?: (product: ProductListItem) => void;
}

export default function ProductCardInteractive({
  onClick,
  product,
  ...rest
}: ProductCardInteractiveProps) {
  function handleClick() {
    // Fire the external callback for side-effects (analytics, state, etc.)
    // The inner <Link> handles the actual navigation — no need to do anything here.
    if (onClick) onClick(product);
  }

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      <ProductCard product={product} {...rest} />
    </div>
  );
}