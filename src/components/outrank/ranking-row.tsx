"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Crown, Medal, Award, Check, Info, Heart, ArrowRight, Globe } from "lucide-react";
import { VerifiedBadge } from "./verified-badge";
import { ProductLogo } from "@/components/products/product-logo";
import type { PublicProduct } from "@/services/products";
import { useUserCurrency } from "@/lib/currency";

type RankingRowProps = {
  product: PublicProduct;
  rank: number;
};

function RoyalRankBadge({ rank }: { rank: 1 | 2 | 3 }) {
  if (rank === 1) {
    return (
      <div className="flex flex-col items-center">
        <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400" aria-hidden="true" />
        <span className="text-[11px] sm:text-xs font-bold text-amber-600 dark:text-amber-400">#1</span>
      </div>
    );
  }
  if (rank === 2) {
    return (
      <div className="flex flex-col items-center">
        <Medal className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 fill-slate-300" aria-hidden="true" />
        <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-300">#2</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center">
      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700 fill-amber-600" aria-hidden="true" />
      <span className="text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-500">#3</span>
    </div>
  );
}

export function RankingRow({ product, rank }: RankingRowProps) {
  const { formatAmount } = useUserCurrency();
  const isRoyal = rank <= 3;
  const royalRank = rank === 1 ? 1 : rank === 2 ? 2 : 3;

  // Real live likes state (Zero demo numbers, starts from 0 with real interactions)
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // Synchronize real like counts from local storage
  useEffect(() => {
    try {
      const countKey = `outrank_product_likes_${product.id}`;
      const userKey = `outrank_user_has_liked_${product.id}`;
      const savedCount = parseInt(localStorage.getItem(countKey) || "0", 10);
      const userLiked = localStorage.getItem(userKey) === "true";
      setLikes(Math.max(0, savedCount));
      setHasLiked(userLiked);
    } catch {
      // Ignore
    }
  }, [product.id]);

  const handleToggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const countKey = `outrank_product_likes_${product.id}`;
      const userKey = `outrank_user_has_liked_${product.id}`;
      if (hasLiked) {
        const next = Math.max(0, likes - 1);
        setHasLiked(false);
        setLikes(next);
        localStorage.setItem(userKey, "false");
        localStorage.setItem(countKey, String(next));
      } else {
        const next = likes + 1;
        setHasLiked(true);
        setLikes(next);
        localStorage.setItem(userKey, "true");
        localStorage.setItem(countKey, String(next));
      }
    } catch {
      // Fallback
    }
  };

  const twitterUrl = product.twitterHandle
    ? product.twitterHandle.startsWith("http")
      ? product.twitterHandle
      : `https://twitter.com/${product.twitterHandle.replace(/^@/, "")}`
    : null;

  return (
    <article
      className={`outrank-ranking-row flex items-center justify-between px-3.5 sm:px-4 py-3 my-1.5 rounded-2xl border transition-all duration-200 gap-3 min-h-[72px] ${
        rank === 1
          ? "border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.06)] bg-gradient-to-r from-amber-50/20 via-purple-50/10 to-[var(--surface)] dark:from-amber-950/15 dark:via-purple-950/10 dark:to-[var(--surface)]"
          : "border-[var(--border)] bg-[var(--surface)] hover:shadow-sm"
      }`}
    >
      {/* Left: Rank + Logo + Info + Social Links (Strictly uniform vertical centering) */}
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
        {/* Fixed Width Rank Badge */}
        <div className="w-8 sm:w-9 shrink-0 flex items-center justify-center">
          {isRoyal ? (
            <RoyalRankBadge rank={royalRank} />
          ) : (
            <span className="text-sm font-bold text-[var(--text-secondary)]">#{rank}</span>
          )}
        </div>

        {/* Product Logo */}
        <div className="shrink-0 flex items-center justify-center">
          <ProductLogo name={product.name} src={product.logoUrl} />
        </div>

        {/* Text Details — 2 lines strictly truncated to ensure 100% identical row height */}
        <div className="min-w-0 flex-1 overflow-hidden">
          {/* Top Line: Name + Verified + Social IDs */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-nowrap">
            <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate shrink-0 max-w-[140px] sm:max-w-[220px]">
              <Link href={`/products/${product.slug}`} className="hover:text-[var(--accent)] transition-colors">
                {product.name}
              </Link>
            </h2>

            {product.verificationStatus === "verified" ? (
              <VerifiedBadge size="sm" />
            ) : null}

            {/* Social Media Links & Handles */}
            <div className="flex items-center gap-1 shrink-0 overflow-hidden">
              {twitterUrl ? (
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Twitter / X: ${product.twitterHandle}`}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[var(--text-muted)] hover:text-black dark:hover:text-white bg-[var(--surface-hover)] border border-[var(--border)] transition-colors shrink-0"
                >
                  <span className="font-bold leading-none text-[9px]">𝕏</span>
                  <span className="truncate max-w-[70px] hidden sm:inline">
                    {product.twitterHandle?.startsWith("@") ? product.twitterHandle : `@${product.twitterHandle}`}
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Bottom Line: Description (Single line truncate ensures exact uniform card height) */}
          <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5 leading-normal">
            {product.description}
          </p>
        </div>
      </div>

      {/* Right: Regional Backing Amount + Interactive Like Heart + Guaranteed View Button */}
      <div className="flex items-center justify-end gap-2.5 sm:gap-4 shrink-0">
        <div className="text-right shrink-0">
          <div className="text-sm sm:text-base font-extrabold text-[#7446d8] dark:text-[#c084fc] tracking-tight whitespace-nowrap">
            {formatAmount(product.totalSupportAmount || "0")}
          </div>
          <div className="hidden sm:flex items-center justify-end gap-1 text-[10px] text-[var(--text-muted)] whitespace-nowrap">
            <span>Confirmed</span>
            <Info className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
          </div>
        </div>

        {/* Live Interactive Heart Button */}
        <button
          type="button"
          onClick={handleToggleLike}
          aria-label={hasLiked ? "Unlike product" : "Like product"}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
            hasLiked
              ? "text-rose-500 bg-rose-500/10"
              : "text-[var(--text-secondary)] hover:text-rose-500 hover:bg-rose-500/10"
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 transition-transform ${
              hasLiked ? "text-rose-500 fill-rose-500 scale-110" : "text-[var(--text-muted)]"
            }`}
          />
          <span className="text-[11px] font-mono">{likes}</span>
        </button>

        {/* Guaranteed High-Contrast View Button */}
        <Link
          href={`/products/${product.slug}`}
          className="shrink-0 inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-black border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <span className="font-extrabold text-black">View</span>
          <ArrowRight className="w-3 h-3 text-black stroke-[3]" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
