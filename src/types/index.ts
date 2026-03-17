// types/index.ts

// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserRole = "ADMIN" | "CUSTOMER";

export type AttributeType = "TEXT" | "NUMBER" | "BOOLEAN" | "SELECT";

export type SortOption = "featured" | "newest" | "price_asc" | "price_desc";

export type DocumentType =
  | "manual"
  | "spec_sheet"
  | "certificate"
  | "brochure"
  | "other";

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  userId: string;
  permissions: AdminPermissions;
  createdAt: string;
}

export interface AdminPermissions {
  products?: boolean;
  categories?: boolean;
  brands?: boolean;
  attributes?: boolean;
  seoPages?: boolean;
  users?: boolean;
}

// ─── Brand ────────────────────────────────────────────────────────────────────

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  createdAt: string;
}

export type BrandSummary = Pick<Brand, "id" | "name" | "slug" | "logoUrl">;

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface CategoryWithChildren extends Category {
  children: (Category & { productCount: number })[];
  productCount: number;
}

export interface CategoryWithParent extends Category {
  parent: Pick<Category, "name" | "slug"> | null;
  children: (Category & { productCount: number })[];
}

export type CategorySummary = Pick<
  Category,
  "id" | "name" | "slug" | "parentId"
>;

export interface CategoryTreeNode extends CategorySummary {
  children: CategoryTreeNode[];
  productCount?: number;
}

export interface Breadcrumb {
  name: string;
  slug: string;
  href: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  currency: string;
  sku: string | null;
  modelNumber: string | null;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  brandId: string | null;
  categoryId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  price: number | null;
  currency: string;
  isFeatured: boolean;
  stockQuantity: number;
  brand: BrandSummary | null;
  category: CategorySummary | null;
  images: ProductImageSummary[];
}

export interface ProductDetail extends Product {
  brand: BrandSummary | null;
  category: CategorySummary | null;
  images: ProductImage[];
  attributes: ProductAttributeWithMeta[];
  variants: ProductVariant[];
  documents: ProductDocument[];
}

// ─── Product Images ───────────────────────────────────────────────────────────

export interface ProductImage {
  id: string;
  imageUrl: string;
  altText: string | null;
  position: number;
  productId: string;
}

export type ProductImageSummary = Pick<ProductImage, "imageUrl" | "altText">;

// ─── Attributes ───────────────────────────────────────────────────────────────

export interface Attribute {
  id: string;
  name: string;
  slug: string;
  unit: string | null;
  type: AttributeType;
}

export interface AttributeValue {
  id: string;
  attributeId: string;
  value: string;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  attributeId: string;
  value: string;
}

export interface ProductAttributeWithMeta extends ProductAttribute {
  attribute: Pick<Attribute, "name" | "unit">;
}

// ─── Variants ─────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  name: string;
  sku: string | null;
  price: number | null;
  stock: number;
  productId: string;
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface ProductDocument {
  id: string;
  title: string;
  documentUrl: string;
  documentType: string | null;
  productId: string;
}

// ─── SEO ──────────────────────────────────────────────────────────────────────

export interface SeoPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string | null;
  content: string | null;
  createdAt: string;
}

export interface SeoMeta {
  title: string;
  description?: string;
  canonical?: string;
  openGraph?: {
    title: string;
    description?: string;
    images?: { url: string; alt?: string }[];
    type?: "website" | "article";
  };
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchFilters {
  query: string;
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortOption;
  page?: number;
}

export interface SearchHit extends ProductListItem {
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
  facets?: SearchFacets;
}

export interface SearchFacets {
  brands: FacetValue[];
  categories: FacetValue[];
}

export interface FacetValue {
  value: string;
  count: number;
}

export interface SearchSuggestion {
  name: string;
  slug: string;
  category: string | null;
}

// ─── Pagination ───────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Admin / Forms ────────────────────────────────────────────────────────────

export interface CreateProductInput {
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  price?: number;
  currency?: string;
  sku?: string;
  modelNumber?: string;
  stockQuantity?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  brandId?: string;
  categoryId?: string;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export interface CreateBrandInput {
  name: string;
  slug: string;
  logoUrl?: string;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export interface UploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}