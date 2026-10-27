import { and, asc, count, desc, eq, ilike, or, sql, sum } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, contributions, products } from "@/db/schema";
import { ALL_CATALOG_CATEGORIES } from "@/lib/constants/category-catalog";

export type PublicProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  websiteUrl: string;
  logoUrl: string | null;
  categoryName: string;
  categorySlug: string;
  totalSupportAmount: string;
  supportCurrency: string;
  verificationStatus: "verified" | "pending" | "rejected";
  rank: number;
  makerName?: string | null;
  twitterHandle?: string | null;
  githubUrl?: string | null;
  discordUrl?: string | null;
};

export type PublicCategory = {
  name: string;
  slug: string;
  description: string | null;
  productCount: number;
};

export type PublicPlatformStats = {
  totalCategories: number;
  totalProducts: number;
  totalContributions: number;
  totalConfirmedAmount: string; // supporter contributions
  totalBackingAmount: string;   // total cumulative backing
};

type DiscoveryFilters = {
  query?: string;
  category?: string;
  limit?: number;
};

const publicProductConditions = [
  eq(products.verificationStatus, "verified"),
  eq(products.moderationStatus, "approved"),
];

function publicProductSelection() {
  return {
    id: products.id,
    name: products.name,
    slug: products.slug,
    description: products.description,
    websiteUrl: products.websiteUrl,
    logoUrl: products.logoUrl,
    categoryName: categories.name,
    categorySlug: categories.slug,
    totalSupportAmount: products.totalSupportAmount,
    supportCurrency: products.supportCurrency,
    verificationStatus: products.verificationStatus,
    makerName: products.makerName,
    twitterHandle: products.twitterHandle,
    githubUrl: products.githubUrl,
    discordUrl: products.discordUrl,
    rank: sql<number>`row_number() over (order by ${products.totalSupportAmount} desc, ${products.createdAt} asc)`
      .mapWith(Number)
      .as("rank"),
  };
}

export async function getPublicProducts({
  query,
  category,
  limit = 5000,
}: DiscoveryFilters = {}): Promise<PublicProduct[]> {
  if (!process.env.DATABASE_URL) {
    return [];
  }

  try {
    const normalizedQuery = query?.trim();
    const conditions: SQL[] = [...publicProductConditions];

    if (category) {
      conditions.push(eq(categories.slug, category));
    }

    if (normalizedQuery) {
      const search = `%${normalizedQuery}%`;
      const searchCondition = or(
        ilike(products.name, search),
        ilike(products.description, search),
        ilike(products.websiteUrl, search),
        ilike(categories.name, search),
      );

      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    return await getDb()
      .select(publicProductSelection())
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(and(...conditions))
      .orderBy(desc(products.totalSupportAmount), asc(products.createdAt))
      .limit(Math.min(Math.max(limit, 1), 10000));
  } catch (err) {
    console.warn("getPublicProducts database query skipped:", err);
    return [];
  }
}

export async function getPublicCategories(): Promise<PublicCategory[]> {
  try {
    const dbCategories = await getDb()
      .select({
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        productCount: count(products.id).mapWith(Number),
      })
      .from(categories)
      .leftJoin(
        products,
        and(eq(products.categoryId, categories.id), ...publicProductConditions),
      )
      .where(eq(categories.isActive, true))
      .groupBy(categories.id, categories.name, categories.slug, categories.description)
      .orderBy(asc(categories.name));

    const existingMap = new Map<string, PublicCategory>();
    for (const c of dbCategories) {
      existingMap.set(c.slug, c);
    }

    for (const cat of ALL_CATALOG_CATEGORIES) {
      if (!existingMap.has(cat.slug)) {
        existingMap.set(cat.slug, {
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          productCount: 0,
        });
      }
    }

    return Array.from(existingMap.values()).sort((a, b) => a.name.localeCompare(b.name));
  } catch {
    return ALL_CATALOG_CATEGORIES.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      productCount: 0,
    }));
  }
}

export async function getPublicCategoryBySlug(slug: string): Promise<PublicCategory | null> {
  try {
    const [category] = await getDb()
      .select({
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        productCount: count(products.id).mapWith(Number),
      })
      .from(categories)
      .leftJoin(
        products,
        and(eq(products.categoryId, categories.id), ...publicProductConditions),
      )
      .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
      .groupBy(categories.id, categories.name, categories.slug, categories.description)
      .limit(1);

    if (category) {
      return category;
    }
  } catch {
    // Fall back to catalog
  }

  const catalogMatch = ALL_CATALOG_CATEGORIES.find((c) => c.slug === slug);
  if (catalogMatch) {
    return {
      name: catalogMatch.name,
      slug: catalogMatch.slug,
      description: catalogMatch.description,
      productCount: 0,
    };
  }

  return null;
}

export async function getPublicPlatformStats(): Promise<PublicPlatformStats> {
  if (!process.env.DATABASE_URL) {
    return {
      totalProducts: 0,
      totalCategories: ALL_CATALOG_CATEGORIES.length,
      totalContributions: 0,
      totalConfirmedAmount: "0",
      totalBackingAmount: "0",
    };
  }

  try {
    const [productResult, categoryResult, contributionResult] = await Promise.all([
      getDb()
        .select({
          total: count(products.id).mapWith(Number),
          totalBacking: sum(products.totalSupportAmount),
        })
        .from(products)
        .where(and(...publicProductConditions)),
      getDb()
        .select({ total: count(categories.id).mapWith(Number) })
        .from(categories)
        .where(eq(categories.isActive, true)),
      getDb()
        .select({
          totalCount: count(contributions.id).mapWith(Number),
          totalSum: sum(contributions.amount),
        })
        .from(contributions)
        .where(eq(contributions.status, "succeeded")),
    ]);

    return {
      totalProducts: productResult[0]?.total ?? 0,
      totalCategories: Math.max(categoryResult[0]?.total ?? 0, ALL_CATALOG_CATEGORIES.length),
      totalContributions: contributionResult[0]?.totalCount ?? 0,
      totalConfirmedAmount: contributionResult[0]?.totalSum ?? "0",
      totalBackingAmount: productResult[0]?.totalBacking ?? "0",
    };
  } catch {
    return {
      totalProducts: 0,
      totalCategories: ALL_CATALOG_CATEGORIES.length,
      totalContributions: 0,
      totalConfirmedAmount: "0",
      totalBackingAmount: "0",
    };
  }
}
