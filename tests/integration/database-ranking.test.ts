import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { existsSync } from "fs";

if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

import { getDb } from "@/db";
import { categories, products, productEvents } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getPublicCategories,
  getPublicProducts,
  getPublicPlatformStats,
} from "@/services/products";

describe("Database Ranking & Discovery Integration", () => {
  let createdProductId: string | null = null;

  beforeAll(async () => {
    const db = getDb();
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .limit(1);

    if (cat) {
      const [inserted] = await db
        .insert(products)
        .values({
          name: "Integration Test Product",
          slug: `test-product-${Date.now()}`,
          description: "Integration test fixture for ranking and discovery.",
          websiteUrl: `https://test-${Date.now()}.com`,
          categoryId: cat.id,
          ownerEmail: "test@outrank.dev",
          verificationStatus: "verified",
          moderationStatus: "approved",
          totalSupportAmount: "950.00",
        })
        .returning({ id: products.id });
      createdProductId = inserted.id;
    }
  });

  afterAll(async () => {
    if (createdProductId) {
      const db = getDb();
      await db.delete(productEvents).where(eq(productEvents.productId, createdProductId));
      await db.delete(products).where(eq(products.id, createdProductId));
    }
  });

  it("fetches active categories from PostgreSQL", async () => {
    const cats = await getPublicCategories();
    expect(Array.isArray(cats)).toBe(true);
    expect(cats.length).toBeGreaterThanOrEqual(8);

    const names = cats.map((c) => c.name);
    expect(names.some((n) => n.includes("AI"))).toBe(true);
    expect(names.some((n) => n.includes("Developer") || n.includes("Coding"))).toBe(true);
    expect(names.some((n) => n.includes("Productivity"))).toBe(true);
  });

  it("fetches public eligible products ordered by totalSupportAmount descending", async () => {
    const productList = await getPublicProducts({ limit: 10 });
    expect(Array.isArray(productList)).toBe(true);
    expect(productList.length).toBeGreaterThan(0);

    // Verify ordering: each product's support is >= the next product's support
    for (let i = 0; i < productList.length - 1; i++) {
      const current = parseFloat(productList[i].totalSupportAmount);
      const next = parseFloat(productList[i + 1].totalSupportAmount);
      expect(current).toBeGreaterThanOrEqual(next);
    }
  });

  it("calculates real platform statistics from PostgreSQL", async () => {
    const stats = await getPublicPlatformStats();
    expect(stats.totalProducts).toBeGreaterThanOrEqual(0);
    expect(stats.totalCategories).toBeGreaterThanOrEqual(8);
  });
});
