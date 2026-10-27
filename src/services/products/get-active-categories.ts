import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import type { ProductSubmissionCategory } from "@/types";

export async function getActiveCategories(): Promise<ProductSubmissionCategory[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    return await getDb()
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
      })
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.name));
  } catch {
    return [];
  }
}
