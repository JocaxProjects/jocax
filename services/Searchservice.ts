// services/searchService.ts

import { searchClient } from "@/lib/meilisearch";
import { prisma } from "@/lib/prisma";
import type { EnqueuedTask } from "meilisearch";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchOptions {
  query: string;
  page?: number;
  limit?: number;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "newest" | "price_asc" | "price_desc";
}

export interface SearchHit {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  currency: string;
  isFeatured: boolean;
  stockQuantity: number;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  images: { imageUrl: string; altText: string | null }[];
  _formatted?: {
    name?: string;
    shortDescription?: string;
    description?: string;
  };
}

export interface SearchResult {
  hits: SearchHit[];
  total: number;
  page: number;
  totalPages: number;
  processingTimeMs: number;
  query: string;
  facets?: {
    brands: { value: string; count: number }[];
    categories: { value: string; count: number }[];
  };
}

export interface IndexedProduct {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  sku: string | null;
  modelNumber: string | null;
  isFeatured: boolean;
  stockQuantity: number;
  isActive: boolean;
  brand: { name: string; slug: string } | null;
  category: { name: string; slug: string } | null;
  images: { imageUrl: string; altText: string | null }[];
  attributeValues: string[];
  createdAt: number; // Unix timestamp for Meilisearch sorting
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INDEX_NAME = "products";
const DEFAULT_LIMIT = 20;

function buildSortRules(sort: SearchOptions["sort"]): string[] {
  switch (sort) {
    case "price_asc":
      return ["price:asc"];
    case "price_desc":
      return ["price:desc"];
    case "newest":
      return ["createdAt:desc"];
    case "featured":
    default:
      return ["isFeatured:desc", "createdAt:desc"];
  }
}

function buildFilters(opts: SearchOptions): string {
  const filters: string[] = ["isActive = true"];

  if (opts.brand) {
    filters.push(`brand.slug = "${opts.brand}"`);
  }
  if (opts.category) {
    filters.push(`category.slug = "${opts.category}"`);
  }
  if (opts.minPrice !== undefined) {
    filters.push(`price >= ${opts.minPrice}`);
  }
  if (opts.maxPrice !== undefined) {
    filters.push(`price <= ${opts.maxPrice}`);
  }

  return filters.join(" AND ");
}

// ─── Search ───────────────────────────────────────────────────────────────────

/**
 * Search products using Meilisearch with filters, facets, and pagination.
 */
export async function searchProducts(opts: SearchOptions): Promise<SearchResult> {
  const page = Math.max(1, opts.page ?? 1);
  const limit = opts.limit ?? DEFAULT_LIMIT;
  const offset = (page - 1) * limit;

  const index = searchClient.index(INDEX_NAME);

  const result = await index.search<SearchHit>(opts.query, {
    limit,
    offset,
    filter: buildFilters(opts),
    sort: buildSortRules(opts.sort),
    facets: ["brand.name", "category.name"],
    attributesToHighlight: ["name", "shortDescription", "description"],
    highlightPreTag: "<em>",
    highlightPostTag: "</em>",
    attributesToRetrieve: [
      "id",
      "name",
      "slug",
      "shortDescription",
      "price",
      "currency",
      "isFeatured",
      "stockQuantity",
      "brand",
      "category",
      "images",
    ],
  });

  const facetDistribution = result.facetDistribution ?? {};

  return {
    hits: result.hits,
    total: result.estimatedTotalHits ?? 0,
    page,
    totalPages: Math.ceil((result.estimatedTotalHits ?? 0) / limit),
    processingTimeMs: result.processingTimeMs,
    query: result.query,
    facets: {
      brands: Object.entries(facetDistribution["brand.name"] ?? {})
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
      categories: Object.entries(facetDistribution["category.name"] ?? {})
        .map(([value, count]) => ({ value, count }))
        .sort((a, b) => b.count - a.count),
    },
  };
}

/**
 * Fetch autocomplete suggestions for the search input.
 */
export async function getSearchSuggestions(
  query: string,
  limit = 5
): Promise<{ name: string; slug: string; category: string | null }[]> {
  if (!query.trim()) return [];

  const index = searchClient.index(INDEX_NAME);

  const result = await index.search<SearchHit>(query, {
    limit,
    filter: "isActive = true",
    attributesToRetrieve: ["name", "slug", "category"],
    attributesToHighlight: [],
  });

  return result.hits.map((hit) => ({
    name: hit.name,
    slug: hit.slug,
    category: hit.category?.name ?? null,
  }));
}

// ─── Indexing ─────────────────────────────────────────────────────────────────

/**
 * Transform a Prisma product into the shape Meilisearch expects.
 */
function toIndexedProduct(
  product: Awaited<ReturnType<typeof fetchProductsForIndexing>>[number]
): IndexedProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    price: product.price,
    currency: product.currency,
    sku: product.sku,
    modelNumber: product.modelNumber,
    isFeatured: product.isFeatured,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    brand: product.brand
      ? { name: product.brand.name, slug: product.brand.slug }
      : null,
    category: product.category
      ? { name: product.category.name, slug: product.category.slug }
      : null,
    images: product.images.map((img) => ({
      imageUrl: img.imageUrl,
      altText: img.altText,
    })),
    // Flatten attribute values so they're searchable as plain strings
    attributeValues: product.attributes.map((a) => a.value),
    createdAt: Math.floor(product.createdAt.getTime() / 1000),
  };
}

async function fetchProductsForIndexing(ids?: string[]) {
  return prisma.product.findMany({
    where: ids ? { id: { in: ids } } : undefined,
    select: {
      id: true,
      name: true,
      slug: true,
      shortDescription: true,
      description: true,
      price: true,
      currency: true,
      sku: true,
      modelNumber: true,
      isFeatured: true,
      stockQuantity: true,
      isActive: true,
      createdAt: true,
      brand: { select: { name: true, slug: true } },
      category: { select: { name: true, slug: true } },
      images: {
        select: { imageUrl: true, altText: true },
        orderBy: { position: "asc" },
        take: 1,
      },
      attributes: { select: { value: true } },
    },
  });
}

/**
 * Index or re-index specific products by ID.
 * Call this after creating or updating a product.
 */
export async function indexProducts(productIds: string[]): Promise<EnqueuedTask> {
  const products = await fetchProductsForIndexing(productIds);
  const index = searchClient.index(INDEX_NAME);
  return index.addDocuments(products.map(toIndexedProduct), { primaryKey: "id" });
}

/**
 * Re-index all products in the database.
 * Use for initial setup or full re-sync.
 */
export async function reindexAllProducts(): Promise<EnqueuedTask> {
  const products = await fetchProductsForIndexing();
  const index = searchClient.index(INDEX_NAME);
  return index.addDocuments(products.map(toIndexedProduct), { primaryKey: "id" });
}

/**
 * Remove a product from the search index.
 * Call this when a product is deleted or permanently deactivated.
 */
export async function removeProductFromIndex(productId: string): Promise<EnqueuedTask> {
  const index = searchClient.index(INDEX_NAME);
  return index.deleteDocument(productId);
}

// ─── Index Configuration ──────────────────────────────────────────────────────

/**
 * Configure Meilisearch index settings.
 * Run once during initial setup or when settings need updating.
 */
export async function configureSearchIndex(): Promise<void> {
  const index = searchClient.index(INDEX_NAME);

  await index.updateSettings({
    // Fields that Meilisearch searches across
    searchableAttributes: [
      "name",
      "shortDescription",
      "description",
      "sku",
      "modelNumber",
      "brand.name",
      "category.name",
      "attributeValues",
    ],
    // Fields available for filtering and faceting
    filterableAttributes: [
      "isActive",
      "isFeatured",
      "brand.slug",
      "brand.name",
      "category.slug",
      "category.name",
      "price",
      "stockQuantity",
      "currency",
    ],
    // Fields available for sorting
    sortableAttributes: [
      "price",
      "createdAt",
      "isFeatured",
      "stockQuantity",
    ],
    // Ranking rules — relevance first, then business logic
    rankingRules: [
      "words",
      "typo",
      "proximity",
      "attribute",
      "sort",
      "exactness",
    ],
    // Typo tolerance for forgiving search
    typoTolerance: {
      enabled: true,
      minWordSizeForTypos: {
        oneTypo: 4,
        twoTypos: 8,
      },
    },
    // Pagination
    pagination: {
      maxTotalHits: 1000,
    },
  });
}