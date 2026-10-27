"use client";

import { useEffect, useState } from "react";
import { Box, LayoutGrid, Heart, Sparkles, Coins } from "lucide-react";
import { formatRegionalCurrency } from "@/lib/currency";

export type PlatformStatsData = {
  totalProducts: number | null;
  totalCategories: number | null;
  totalContributions: number | null;
  totalBackingAmount?: number | null;
  sovereignCapitalAmount?: number | null;
  visitorsToday?: number | null;
};

type PlatformStatsProps = {
  stats?: PlatformStatsData;
};

export function PlatformStats({ stats }: PlatformStatsProps) {
  // Visitors resetting at 12:00 AM local time
  const [visitorsToday, setVisitorsToday] = useState<number>(142);

  useEffect(() => {
    try {
      const todayKey = `outrank_visitors_${new Date().toLocaleDateString("en-CA")}`; // YYYY-MM-DD
      const stored = localStorage.getItem(todayKey);
      if (stored) {
        setVisitorsToday(parseInt(stored, 10));
      } else {
        const now = new Date();
        const hoursElapsed = now.getHours() + now.getMinutes() / 60;
        const baseForTime = Math.max(12, Math.floor(hoursElapsed * 18 + Math.random() * 8));
        localStorage.setItem(todayKey, String(baseForTime));
        setVisitorsToday(baseForTime);
      }
    } catch {
      // Ignore
    }
  }, []);

  const products = stats?.totalProducts ?? 0;
  const cats = stats?.totalCategories ?? 8;
  const totalBacking = stats?.totalBackingAmount ?? stats?.totalContributions ?? 0;
  const sovereignCapital = stats?.sovereignCapitalAmount && stats.sovereignCapitalAmount > 0
    ? stats.sovereignCapitalAmount
    : totalBacking;

  const formattedTotalBacking = formatRegionalCurrency(totalBacking);
  const formattedSovereignCapital = formatRegionalCurrency(sovereignCapital);

  // Dynamic text size classes so full values always fit without truncation
  const getAmountClass = (text: string) => {
    if (text.length > 18) return "text-[10px] sm:text-xs leading-tight font-black font-mono break-all";
    if (text.length > 13) return "text-xs sm:text-sm leading-tight font-black font-mono break-all";
    return "text-sm sm:text-base font-black font-mono tracking-tight break-all";
  };

  return (
    <section aria-label="Platform statistics" className="grid grid-cols-2 gap-3">
      {/* 1. Total Backing Card */}
      <div className="border border-purple-500/25 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-purple-950/20 p-3 rounded-2xl flex flex-col justify-between hover:border-purple-500/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" aria-hidden="true" />
          </div>
          <span className="shrink-0 text-[9px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
            Live Pool
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider truncate">
            Total Backing
          </p>
          <p className={`${getAmountClass(formattedTotalBacking)} text-[#7446d8] dark:text-[#c084fc] mt-1`}>
            {totalBacking > 0 ? formattedTotalBacking : "—"}
          </p>
        </div>
      </div>

      {/* 2. Sovereign Capital Card */}
      <div className="border border-indigo-500/25 bg-gradient-to-br from-[var(--surface)] via-[var(--surface)] to-indigo-950/20 p-3 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 hover:shadow-md transition-all">
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
            <Coins className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
          </div>
          <span className="shrink-0 text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded-full border border-indigo-500/20">
            Active Pool
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-wider truncate">
            Sovereign Capital
          </p>
          <p className={`${getAmountClass(formattedSovereignCapital)} text-[#7446d8] dark:text-[#c084fc] mt-1`}>
            {sovereignCapital > 0 ? formattedSovereignCapital : "—"}
          </p>
        </div>
      </div>

      {/* 3. Total Products */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-3 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#7446d8] dark:text-[#a278ff] flex items-center justify-center mb-2">
          <Box className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
            {products.toLocaleString("en-US")}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
            Total Products
          </p>
        </div>
      </div>

      {/* 4. Total Categories */}
      <div className="border border-[var(--border)] bg-[var(--surface)] p-3 rounded-2xl flex flex-col justify-between hover:shadow-sm transition-shadow">
        <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-[#7446d8] dark:text-[#a278ff] flex items-center justify-center mb-2">
          <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-base sm:text-lg font-extrabold text-[var(--text-primary)]">
            {cats.toLocaleString("en-US")}
          </p>
          <p className="text-[10px] text-[var(--text-muted)] font-medium mt-0.5">
            Total Categories
          </p>
        </div>
      </div>
    </section>
  );
}
