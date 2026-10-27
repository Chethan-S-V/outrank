import { and, count, eq, gt, lt, or } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products } from "@/db/schema";

type ProductEligibilityStatus = Pick<
  InferSelectModel<typeof products>,
  "verificationStatus" | "moderationStatus"
>;

export function isProductPubliclyEligible(product: ProductEligibilityStatus) {
  return (
    product.verificationStatus === "verified" &&
    product.moderationStatus === "approved"
  );
}

export async function getPublicProductBySlug(slug: string) {
  if (!process.env.DATABASE_URL) return undefined;

  try {
    const db = getDb();
    const [product] = await db
      .select({
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
        createdAt: products.createdAt,
      })
      .from(products)
      .innerJoin(categories, eq(products.categoryId, categories.id))
      .where(
        and(
          eq(products.slug, slug),
          eq(products.verificationStatus, "verified"),
          eq(products.moderationStatus, "approved"),
        ),
      )
      .limit(1);

    if (!product) return undefined;
    const [position] = await db.select({ total: count() }).from(products).where(and(eq(products.verificationStatus, "verified"), eq(products.moderationStatus, "approved"), or(gt(products.totalSupportAmount, product.totalSupportAmount), and(eq(products.totalSupportAmount, product.totalSupportAmount), lt(products.createdAt, product.createdAt)))));
    return { ...product, rank: Number(position.total) + 1 };
  } catch {
    return undefined;
  }
}
