// src/app/api/products/route.ts
//
// GET /api/products?q=...&brand=...&category=...&minPrice=...&maxPrice=...&sort=...&page=...
//
// Called by ProductsClient on every filter/sort/search change.
// Returns JSON: { products: ProductListItem[], total: number }

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { ProductListItem } from "@/types";

const PRODUCTS_PER_PAGE = 24;

export async function GET(req: NextRequest) {
  const sp       = req.nextUrl.searchParams;
  const q        = sp.get("q")        ?? "";
  const brand    = sp.get("brand")    ?? "";
  const category = sp.get("category") ?? "";
  const minPrice = sp.get("minPrice") ?? "";
  const maxPrice = sp.get("maxPrice") ?? "";
  const sort     = sp.get("sort")     ?? "featured";
  const page     = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const skip     = (page - 1) * PRODUCTS_PER_PAGE;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(brand    && { brand:    { slug: brand    } }),
    ...(category && { category: { slug: category } }),
    ...((minPrice || maxPrice) && {
      price: {
        ...(minPrice && { gte: parseFloat(minPrice) }),
        ...(maxPrice && { lte: parseFloat(maxPrice) }),
      },
    }),
    ...(q && {
      OR: [
        { name:             { contains: q, mode: "insensitive" } },
        { shortDescription: { contains: q, mode: "insensitive" } },
        { description:      { contains: q, mode: "insensitive" } },
        { brand:    { name: { contains: q, mode: "insensitive" } } },
        { category: { name: { contains: q, mode: "insensitive" } } },
      ],
    }),
  };

  const orderBy = (() => {
    switch (sort) {
      case "price_asc":  return { price:      "asc"  as const };
      case "price_desc": return { price:      "desc" as const };
      case "newest":     return { createdAt:  "desc" as const };
      default:           return { isFeatured: "desc" as const };
    }
  })();

  try {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take:    PRODUCTS_PER_PAGE,
        orderBy,
        select: {
          id:               true,
          name:             true,
          slug:             true,
          shortDescription: true,
          price:            true,
          currency:         true,
          isFeatured:       true,
          stockQuantity:    true,
          brand:    { select: { id: true, name: true, slug: true, logoUrl: true } },
          category: { select: { id: true, name: true, slug: true, parentId: true } },
          images: {
            select:  { imageUrl: true, altText: true },
            orderBy: { position: "asc" },
            take:    1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json(
      { products: products as ProductListItem[], total },
      {
        headers: {
          // Cache for 30s on CDN, revalidate in background
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}