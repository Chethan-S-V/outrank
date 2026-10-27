import { describe, expect, it } from "vitest";
import { isProductPubliclyEligible } from "@/services/products/public-product";

describe("Product Eligibility & Ranking Logic", () => {
  describe("isProductPubliclyEligible", () => {
    it("returns true only when product is both verified and approved", () => {
      const eligible = {
        verificationStatus: "verified" as const,
        moderationStatus: "approved" as const,
      };
      expect(isProductPubliclyEligible(eligible)).toBe(true);
    });

    it("returns false if product is pending verification", () => {
      const pendingVerification = {
        verificationStatus: "pending" as const,
        moderationStatus: "approved" as const,
      };
      expect(isProductPubliclyEligible(pendingVerification)).toBe(false);
    });

    it("returns false if product is pending moderation", () => {
      const pendingModeration = {
        verificationStatus: "verified" as const,
        moderationStatus: "pending" as const,
      };
      expect(isProductPubliclyEligible(pendingModeration)).toBe(false);
    });

    it("returns false if product is rejected or suspended", () => {
      expect(
        isProductPubliclyEligible({
          verificationStatus: "rejected" as const,
          moderationStatus: "approved" as const,
        }),
      ).toBe(false);

      expect(
        isProductPubliclyEligible({
          verificationStatus: "verified" as const,
          moderationStatus: "suspended" as const,
        }),
      ).toBe(false);

      expect(
        isProductPubliclyEligible({
          verificationStatus: "rejected" as const,
          moderationStatus: "rejected" as const,
        }),
      ).toBe(false);
    });
  });

  describe("Deterministic Ranking Comparator", () => {
    type ProductComparisonItem = {
      name: string;
      totalSupportAmount: number;
      createdAt: Date;
    };

    function sortProducts(items: ProductComparisonItem[]) {
      return [...items].sort((a, b) => {
        // Higher support first
        if (b.totalSupportAmount !== a.totalSupportAmount) {
          return b.totalSupportAmount - a.totalSupportAmount;
        }
        // Tie-breaker: earlier creation date first
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    }

    it("orders products strictly by confirmed support amount descending", () => {
      const list = [
        { name: "Beta", totalSupportAmount: 1000, createdAt: new Date("2026-01-01") },
        { name: "Alpha", totalSupportAmount: 5000, createdAt: new Date("2026-01-02") },
        { name: "Gamma", totalSupportAmount: 250, createdAt: new Date("2026-01-03") },
      ];

      const sorted = sortProducts(list);
      expect(sorted.map((p) => p.name)).toEqual(["Alpha", "Beta", "Gamma"]);
    });

    it("resolves exact support ties deterministically using earlier creation timestamp", () => {
      const t1 = new Date("2026-01-01T10:00:00Z");
      const t2 = new Date("2026-01-01T11:00:00Z");

      const list = [
        { name: "LaterProduct", totalSupportAmount: 5000, createdAt: t2 },
        { name: "EarlierProduct", totalSupportAmount: 5000, createdAt: t1 },
      ];

      const sorted = sortProducts(list);
      expect(sorted[0].name).toBe("EarlierProduct");
      expect(sorted[1].name).toBe("LaterProduct");
    });
  });
});
