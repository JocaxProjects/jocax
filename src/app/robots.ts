// src/app/robots.ts
// Generates /robots.txt — tells search engine crawlers what to index.
// Next.js App Router handles this automatically via the MetadataRoute API.

import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.jocaxsolutions.co.ke";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/login-admin",
                ],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
