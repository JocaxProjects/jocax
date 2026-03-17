import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CategorySummary = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    parentId: true;
  };
}>;

export type CategoryWithChildren = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    parentId: true;
    children: {
      select: {
        id: true;
        name: true;
        slug: true;
        description: true;
        _count: { select: { products: true } };
      };
    };
    _count: { select: { products: true } };
  };
}>;

export type CategoryWithParent = Prisma.CategoryGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    parentId: true;
    parent: { select: { name: true; slug: true } };
    children: {
      select: {
        id: true;
        name: true;
        slug: true;
        description: true;
        _count: { select: { products: true } };
      };
    };
  };
}>;

// ─── Service Functions ────────────────────────────────────────────────────────

export async function getTopLevelCategories(): Promise<CategoryWithChildren[]> {
  return prisma.category.findMany({
    where: {
      parentId: null,
      products: { some: { isActive: true } },
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        orderBy: { name: "asc" },
      },
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
  });
}

export async function getCategoryBySlug(
  slug: string
): Promise<CategoryWithParent | null> {
  return prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
      parent: { select: { name: true, slug: true } },
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          _count: {
            select: { products: { where: { isActive: true } } },
          },
        },
        orderBy: { name: "asc" },
      },
    },
  });
}

export async function getAllCategories(): Promise<CategorySummary[]> {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      parentId: true,
    },
    orderBy: [{ parentId: "asc" }, { name: "asc" }],
  });
}

export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  return prisma.category.findMany({
    select: { slug: true },
  });
}

export async function getActiveCategories() {
  return prisma.category.findMany({
    where: {
      products: { some: { isActive: true } },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      parentId: true,
      _count: {
        select: { products: { where: { isActive: true } } },
      },
    },
    orderBy: { name: "asc" },
  });
}

export interface CategoryTreeNode extends CategorySummary {
  children: CategoryTreeNode[];
  productCount?: number;
}

export function buildCategoryTree(
  categories: (CategorySummary & { productCount?: number })[]
): CategoryTreeNode[] {
  const map = new Map<string, CategoryTreeNode>();

  categories.forEach((cat) => {
    map.set(cat.id, { ...cat, children: [] });
  });

  const roots: CategoryTreeNode[] = [];

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
}

export async function getCategoryBreadcrumb(
  slug: string
): Promise<{ name: string; slug: string }[]> {
  const breadcrumb: { name: string; slug: string }[] = [];
  let currentSlug: string | null = slug;

  while (currentSlug) {
    // Explicit return type annotation fixes TS7022 circular inference error
    const category: {
      name: string;
      slug: string;
      parent: { slug: string } | null;
    } | null = await prisma.category.findUnique({
      where: { slug: currentSlug },
      select: {
        name: true,
        slug: true,
        parent: { select: { slug: true } },
      },
    });

    if (!category) break;

    breadcrumb.unshift({ name: category.name, slug: category.slug });
    currentSlug = category.parent?.slug ?? null;
  }

  return breadcrumb;
}