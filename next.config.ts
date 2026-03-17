// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

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