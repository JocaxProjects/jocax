// components/ProductCard/ProductCard.exports.ts — barrel export

export { default }                    from "./index";
export { default as ProductCardInteractive } from "./ProductCardClient";
export { default as ProductGrid }     from "./ProductGrid";
export { default as RelatedProducts } from "./RelatedProducts";
export { GridCard, ListCard, CompactCard } from "./index";
export { formatPrice, primaryImage, primaryAlt, badgeClass, productBadge, stockStatus } from "./index";
export type { ProductCardProps, ProductCardVariant } from "./index";
export type { ProductGridProps, GridView }           from "./ProductGrid";