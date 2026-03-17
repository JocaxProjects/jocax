# Jocax Solutions Limited  
## Commercial Kitchen Equipment Platform

A high-performance B2B platform for marketing and selling commercial kitchen equipment such as ovens, fryers, refrigerators, dishwashers, prep tables, and full restaurant kitchen infrastructure.

The platform is designed with a modern full-stack architecture using Next.js where both frontend and backend logic exist within the same application.

This system focuses on:

- SEO performance
- high-speed product search
- accessibility
- scalable product catalogs
- enterprise-grade administration tools

---

# Platform Overview

The platform includes:

- Marketing website
- Product catalog
- Advanced equipment filtering
- High-performance search
- Admin dashboard
- SEO landing pages
- Equipment comparison capability (future)
- Analytics tracking

Products are fully managed by administrators — suppliers do not create products.

---

# Technology Stack

## Frontend + Backend
Next.js (App Router)

## Language
TypeScript

## Styling
Tailwind CSS

## Database
Supabase (PostgreSQL)

## ORM
Prisma

## Search Engine
Meilisearch

## Image Management
Cloudinary

## Hosting
Vercel

---

# Architecture Overview

Users  
│  
▼  
Next.js Application (App Router)

- UI Components  
- Server Components  
- Server Actions  
- API Routes  

Database Layer  
- Prisma ORM  
- PostgreSQL (Supabase)

External Services  
- Meilisearch (Search)  
- Cloudinary (Images)  
- Vercel (Hosting + CDN)

---

# Core Platform Features

## Product Catalog

- Commercial kitchen equipment listings
- Categories and subcategories
- Brands
- Equipment specifications
- Product variants
- Product documentation

---

## Advanced Equipment Filtering

Amazon-style filtering based on:

- brand
- power
- voltage
- capacity
- dimensions
- material
- price

---

## High Performance Search

Powered by Meilisearch.

Supports:

- instant search
- filtering
- typo tolerance
- fast queries for large catalogs

---

## SEO Optimization

The platform is designed for strong search rankings.

Features include:

- Server Side Rendering
- Static Site Generation
- Schema.org structured data
- canonical URLs
- sitemap generation
- OpenGraph metadata

Example SEO pages:

/commercial-ovens  
/pizza-ovens  
/bakery-equipment  
/restaurant-refrigerators  
/stainless-prep-tables

---

# Accessibility

Accessibility standards include:

- semantic HTML
- keyboard navigation
- screen reader compatibility
- proper ARIA attributes
- accessible UI components

Testing tools:

- axe-core
- eslint-plugin-jsx-a11y
- Lighthouse

---

# Project Structure

```
jocax-kitchen-platform/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── categories/
│   │   └── [slug]/page.tsx
│   ├── search/
│   │   └── page.tsx
│   └── admin/
│       ├── dashboard/
│       ├── products/
│       ├── categories/
│       ├── brands/
│       ├── attributes/
│       └── seo/
├── app/api/
│   ├── products/
│   ├── search/
│   └── uploads/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── product/
│   ├── search/
│   └── filters/
├── lib/
│   ├── prisma.ts
│   ├── supabase.ts
│   ├── meilisearch.ts
│   └── cloudinary.ts
├── services/
│   ├── productService.ts
│   ├── categoryService.ts
│   └── searchService.ts
├── hooks/
├── types/
├── prisma/
│   └── schema.prisma
├── scripts/
│   └── seed.ts
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

# Database Architecture

Database: PostgreSQL (Supabase)

Managed using Prisma ORM.

Core entities:

- Users  
- AdminUsers  
- Products  
- ProductImages  
- ProductAttributes  
- ProductVariants  
- ProductDocuments  
- Categories  
- Brands  
- Attributes  
- SEO Pages

---

# Prisma Schema (Core Models)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  ADMIN
  CUSTOMER
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  role      UserRole @default(CUSTOMER)
  createdAt DateTime @default(now())
}

model AdminUser {
  id          String   @id @default(uuid())
  userId      String   @unique
  permissions Json
  createdAt   DateTime @default(now())
}

model Brand {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  logoUrl   String?
  createdAt DateTime @default(now())

  products Product[]
}

model Category {
  id          String  @id @default(uuid())
  name        String
  slug        String  @unique
  description String?

  parentId String?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")

  products Product[]
}

model Product {
  id               String  @id @default(uuid())
  name             String
  slug             String  @unique
  shortDescription String?
  description      String?

  price    Float?
  currency String @default("USD")

  sku         String?
  modelNumber String?

  stockQuantity Int @default(0)

  isActive   Boolean @default(true)
  isFeatured Boolean @default(false)

  brandId    String?
  categoryId String?

  brand    Brand?    @relation(fields: [brandId], references: [id])
  category Category? @relation(fields: [categoryId], references: [id])

  images     ProductImage[]
  attributes ProductAttribute[]
  variants   ProductVariant[]
  documents  ProductDocument[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ProductImage {
  id       String  @id @default(uuid())
  imageUrl String
  altText  String?
  position Int     @default(0)

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model Attribute {
  id   String        @id @default(uuid())
  name String
  slug String        @unique
  unit String?
  type AttributeType

  values AttributeValue[]
}

enum AttributeType {
  TEXT
  NUMBER
  BOOLEAN
  SELECT
}

model AttributeValue {
  id          String @id @default(uuid())
  attributeId String
  value       String

  attribute Attribute @relation(fields: [attributeId], references: [id])
}

model ProductAttribute {
  id          String @id @default(uuid())
  productId   String
  attributeId String
  value       String

  product   Product   @relation(fields: [productId], references: [id])
  attribute Attribute @relation(fields: [attributeId], references: [id])
}

model ProductVariant {
  id    String  @id @default(uuid())
  name  String
  sku   String?
  price Float?

  stock Int @default(0)

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model ProductDocument {
  id           String  @id @default(uuid())
  title        String
  documentUrl  String
  documentType String?

  productId String
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
}

model SeoPage {
  id              String   @id @default(uuid())
  slug            String   @unique
  title           String
  metaDescription String?
  content         String?
  createdAt       DateTime @default(now())
}
```

---

# Row Level Security (Supabase)

Enable RLS:

```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
```

Public product access:

```sql
create policy "Public products visible"
on products
for select
using (is_active = true);
```

Admin access:

```sql
create policy "Admins manage products"
on products
for all
using (
  exists (
    select 1 from users
    where users.id = auth.uid()
    and users.role = 'ADMIN'
  )
);
```

---

# Environment Variables

Create `.env.local`:

```env
DATABASE_URL=

SUPABASE_URL=
SUPABASE_ANON_KEY=

MEILISEARCH_HOST=
MEILISEARCH_API_KEY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

# Key Dependencies

## Core Next.js + TypeScript
```
next react react-dom
typescript @types/react @types/node
```

## Styling
```
tailwindcss postcss autoprefixer
```

## Database + ORM
```
@prisma/client prisma
@supabase/supabase-js
```

## Search
```
meilisearch
```

## Images
```
cloudinary
```

## Form Handling & Validation
```
react-hook-form zod
```

## Utilities
```
axios clsx dayjs
```

## SEO
```
next-seo
```

## Dev Tools
```
eslint prettier eslint-config-next eslint-plugin-tailwindcss
```

---

# Local Development

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Database migration:

```bash
npx prisma migrate dev
```

Generate Prisma client:

```bash
npx prisma generate
```

Search setup:

```bash
docker run -p 7700:7700 getmeili/meilisearch
```

---

# Deployment

Deploy using Vercel:

1. Connect GitHub repository  
2. Configure environment variables  
3. Deploy  

Vercel provides:

- global CDN
- edge caching
- serverless functions
- automatic scaling

---

# Performance & Security

- Static rendering and incremental static regeneration
- Optimized images via Cloudinary
- Lazy loading
- RLS policies for admin-only product management
- Environment variable protection
- Prisma query validation

---

# Future Enhancements

- Product comparison system  
- Advanced analytics dashboard  
- AI recommendation engine  
- Automated SEO page generator  
- Supplier integrations  
- Equipment financing integrations  

---

# Company

Developed by: **Jocax Solutions Limited**  

Specializing in scalable web platforms, SaaS systems, and enterprise digital infrastructure.

---

# License

Proprietary software owned by **Jocax Solutions Limited**.
