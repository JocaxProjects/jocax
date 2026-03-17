// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// ─── Singleton Pattern ────────────────────────────────────────────────────────
// Prevents multiple PrismaClient instances from being created during
// Next.js hot reloads in development (which would exhaust the connection pool).

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined;
}

const prisma: PrismaClient =
  global._prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global._prisma = prisma;
}

export { prisma };