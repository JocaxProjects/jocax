// src/app/robots.ts
// Generates /robots.txt — tells search engine crawlers what to index.
// Next.js App Router handles this automatically via the MetadataRoute API.

import type { MetadataRoute } from "next";

// Always use the custom domain — never the Vercel deployment URL.
// Set NEXT_PUBLIC_SITE_URL=https://www.jocaxsolutions.co.ke in Vercel env vars.
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jocaxsolutions.co.ke";
const SITE_URL = (
    rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`
).replace(/\/+$/, ""); // strip any trailing slashes to prevent double-slash in sitemap URL

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/", "/login-admin"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
