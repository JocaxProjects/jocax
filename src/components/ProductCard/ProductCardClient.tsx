"use client";

// components/ProductCard/ProductCardClient.tsx
//
// Thin interactive wrapper around the server-rendered ProductCard.
// `display: contents` makes this div invisible to layout so the inner
// ProductCard participates in grid/flex exactly as if unwrapped.
//
// ⚠️  The inner ProductCard already renders a Next.js <Link> that handles
//     navigation to /products/[slug].  Do NOT call router.push() or any
//     other navigation inside `onClick` — that would race with the <Link>
//     and could land on the wrong route.  Keep onClick for side-effects only
//     (analytics, selected-state, modals, etc.).

import ProductCard from "./index";
import type { ProductCardProps } from "./index";
import type { ProductListItem } from "@/types";

interface ProductCardInteractiveProps extends ProductCardProps {
  /** Side-effect only — do NOT navigate inside this handler. The <Link>
   *  inside ProductCard handles routing. */
  onClick?: (product: ProductListItem) => void;
}

export default function ProductCardInteractive({
  onClick,
  product,
  ...rest
}: ProductCardInteractiveProps) {
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    // Let the inner <Link>'s native click bubble and do its job.
    // Only fire the external callback for side-effects.
    if (onClick) onClick(product);
  }

  return (
    <div onClick={handleClick} style={{ display: "contents" }}>
      <ProductCard product={product} {...rest} />
    </div>
  );
}