"use client";

import { useState } from "react";
import type { PublicProduct } from "@/services/products";
import type { ProductSubmissionCategory } from "@/types";
import { ClaimRankHero } from "./claim-rank-hero";
import { RankingList } from "./ranking-list";
import type { ClaimPeriod } from "./claim-period-toggle";

type HomeExperienceProps = {
  products: readonly PublicProduct[];
  categories: readonly ProductSubmissionCategory[];
  categoriesUnavailable: boolean;
};

export function HomeExperience({
  products,
  categories,
  categoriesUnavailable,
}: HomeExperienceProps) {
  const [period, setPeriod] = useState<ClaimPeriod>("all-time");
  const topAmount = products[0] ? parseFloat(products[0].totalSupportAmount) : 0;

  return (
    <main className="outrank-main w-full space-y-4">
      {/* Center Claim Hero */}
      <ClaimRankHero
        categories={categories}
        categoriesUnavailable={categoriesUnavailable}
        topSupportAmount={topAmount}
        period={period}
        onPeriodChange={setPeriod}
      />

      {/* Product Rankings Leaderboard */}
      <div className="w-full">
        <RankingList products={products} period={period} />
      </div>
    </main>
  );
}
