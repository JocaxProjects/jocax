// src/app/sitemap.ts
// Generates /sitemap.xml dynamically — includes all public pages, products,
// categories, and custom SEO landing pages pulled from the database.
// Next.js calls this at build time (or on-demand with ISR).

import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

// Always use the custom domain — never the Vercel deployment URL.
// Set NEXT_PUBLIC_SITE_URL=https://www.jocaxsolutions.co.ke in Vercel env vars.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jocaxsolutions.co.ke";
const SITE_URL = (
    rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`
).replace(/\/+$/, ""); // strip trailing slashes

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // ── Static pages ────────────────────────────────────────────────────────────
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${SITE_URL}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE_URL}/products`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${SITE_URL}/categories`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${SITE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    // ── Products ─────────────────────────────────────────────────────────────────
    const products = await prisma.product.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
    });

    const productPages: MetadataRoute.Sitemap = products.map((p) => ({
        url: `${SITE_URL}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    // ── Categories ───────────────────────────────────────────────────────────────
    const categories = await prisma.category.findMany({
        select: { slug: true },
    });

    const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
        url: `${SITE_URL}/categories/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    // ── SEO landing pages ────────────────────────────────────────────────────────
    const seoPages = await prisma.seoPage.findMany({
        select: { slug: true, createdAt: true },
    });

    const seoLandingPages: MetadataRoute.Sitemap = seoPages.map((s) => ({
        url: `${SITE_URL}/${s.slug}`,
        lastModified: s.createdAt,
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    return [
        ...staticPages,
        ...productPages,
        ...categoryPages,
        ...seoLandingPages,
    ];
}
