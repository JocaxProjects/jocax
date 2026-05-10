// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  // ── Redirect Vercel deployment URL → custom domain ──────────────────────────
  // This prevents Google from indexing jocax.vercel.app instead of the real domain.
  // All SEO authority flows to www.jocaxsolutions.co.ke only.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "jocax.vercel.app" }],
        destination: "https://www.jocaxsolutions.co.ke/:path*",
        permanent: true, // 308 — tells Google this is the canonical domain forever
      },
    ];
  },

  images: {
    remotePatterns: [
      // ── Unsplash (dev sample images) ──────────────────────────────────────
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      // ── Cloudinary (production product images) ────────────────────────────
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      // ── Supabase Storage ──────────────────────────────────────────────────
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;