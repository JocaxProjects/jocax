// scripts/create-admin.ts
//
// One-time script to seed your first admin user in local PostgreSQL.
//
// Usage:
//   npx ts-node --project tsconfig.json scripts/create-admin.ts
//
// Or add to package.json scripts:
//   "create-admin": "ts-node --project tsconfig.json scripts/create-admin.ts"
//
// Prerequisites:
//   npm install --save-dev ts-node
//   npm install bcryptjs
//   npm install --save-dev @types/bcryptjs
//
// IMPORTANT: You must add `passwordHash String?` to your User model in
// prisma/schema.prisma and run `npx prisma migrate dev` before running this.

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email    = process.env.ADMIN_EMAIL    ?? "admin@jocax.com";
  const password = process.env.ADMIN_PASSWORD ?? "change-me-in-production";

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", passwordHash },
    create: { email, role: "ADMIN", passwordHash },
  });

  console.log(`✅ Admin user ready: ${user.email} (id: ${user.id})`);
  console.log(`   Password: ${password}`);
  console.log(`   Change the password after first login!`);
}

main()
  .catch((err) => { console.error("❌ Error:", err); process.exit(1); })
  .finally(() => prisma.$disconnect());