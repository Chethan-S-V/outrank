"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Search,
  Sparkles,
  Flame,
  ListOrdered,
  Layers,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { CategoryIcon } from "./category-icon";
import { CATEGORY_SECTORS } from "@/lib/constants/category-catalog";
import { useRegionalCurrency, formatCanonicalAmount } from "@/lib/currency";
import type { PublicCategory, PublicProduct } from "@/services/products";

type CategoryDiscoveryProps = {
  categories: readonly PublicCategory[];
  products?: readonly PublicProduct[];
};

type SeedProduct = {
  name: string;
  amount: number;
  logoBg: string;
  logoLetter: string;
  logoUrl?: string;
  slug?: string;
  url?: string;
};

// Curated reference leaders matching top active categories
const CATEGORY_LEADERS: Record<string, SeedProduct[]> = {
  "cars-automobiles": [
    { name: "Tesla Model S Plaid & Cyber", amount: 48500, logoBg: "bg-red-600/20 text-red-400 border-red-500/30", logoLetter: "⚡" },
    { name: "Porsche 911 GT3 RS", amount: 39200, logoBg: "bg-amber-600/20 text-amber-400 border-amber-500/30", logoLetter: "🏎" },
    { name: "BMW M5 Competition", amount: 28400, logoBg: "bg-blue-600/20 text-blue-400 border-blue-500/30", logoLetter: "🏁" },
  ],
  "cameras-photography": [
    { name: "Sony A1 & Alpha Lenses", amount: 32000, logoBg: "bg-orange-600/20 text-orange-400 border-orange-500/30", logoLetter: "📷" },
    { name: "Canon EOS R5 Mark II", amount: 27500, logoBg: "bg-red-600/20 text-red-400 border-red-500/30", logoLetter: "📸" },
    { name: "Leica M11 Rangefinder", amount: 24000, logoBg: "bg-zinc-800 text-rose-400 border-rose-500/30", logoLetter: "🔴" },
  ],
  "trucks-commercial-vehicles": [
    { name: "Scania V8 Heavy Hauler", amount: 45000, logoBg: "bg-blue-700/20 text-blue-400 border-blue-600/30", logoLetter: "🚛" },
    { name: "Volvo FH Electric Semi", amount: 41000, logoBg: "bg-cyan-600/20 text-cyan-400 border-cyan-500/30", logoLetter: "🚚" },
    { name: "Freightliner Cascadia Fleet", amount: 31000, logoBg: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30", logoLetter: "📦" },
  ],
  "tractors-farm-machinery": [
    { name: "John Deere 9RX 830 Power", amount: 52000, logoBg: "bg-green-600/20 text-green-400 border-green-500/30", logoLetter: "🚜" },
    { name: "Case IH Quadtrac Series", amount: 38000, logoBg: "bg-red-700/20 text-red-400 border-red-600/30", logoLetter: "🌾" },
    { name: "New Holland T9 SmartTrax", amount: 29500, logoBg: "bg-blue-600/20 text-blue-400 border-blue-500/30", logoLetter: "🌱" },
  ],
  "coding-dev-tools": [
    { name: "Modulate | Frontier Audio & Voice AI", amount: 3560, logoBg: "bg-purple-600/20 text-purple-400 border-purple-500/30", logoLetter: "☼" },
    { name: "Context.dev: Web Architecture", amount: 3555, logoBg: "bg-blue-600/20 text-blue-400 border-blue-500/30", logoLetter: "♫" },
    { name: "GitFast Terminal & Core", amount: 1337, logoBg: "bg-zinc-800 text-zinc-200 border-zinc-700", logoLetter: "◉" },
  ],
  "ai-agents": [
    { name: "see.io · see identity & agents", amount: 17001, logoBg: "bg-blue-600/20 text-blue-400 border-blue-500/30", logoLetter: "••" },
    { name: "JONI | Personal AI Assistant", amount: 14028, logoBg: "bg-violet-600/20 text-violet-400 border-violet-500/30", logoLetter: "∞" },
    { name: "Pecan AI - Predictive Core", amount: 3750, logoBg: "bg-emerald-600/20 text-emerald-400 border-emerald-500/30", logoLetter: "⚑" },
  ],
};

export function CategoryDiscovery({
  categories = [],
  products = [],
}: CategoryDiscoveryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");

  const { formatAmount } = useRegionalCurrency();

  const formatDisplayPrice = (inrVal: number) => {
    return formatAmount(inrVal);
  };

  const sectorNames = useMemo(() => {
    return ["All", ...Object.keys(CATEGORY_SECTORS)];
  }, []);

  const categorySectorMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const [sector, items] of Object.entries(CATEGORY_SECTORS)) {
      for (const item of items) {
        map.set(item.toLowerCase(), sector);
      }
    }
    return map;
  }, []);

  const productsByCategory = useMemo(() => {
    const map = new Map<string, PublicProduct[]>();
    for (const prod of products) {
      const list = map.get(prod.categorySlug) || [];
      list.push(prod);
      map.set(prod.categorySlug, list);
    }
    for (const [slug, list] of map.entries()) {
      list.sort(
        (a, b) =>
          parseFloat(b.totalSupportAmount || "0") -
          parseFloat(a.totalSupportAmount || "0")
      );
    }
    return map;
  }, [products]);

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = cat.name.toLowerCase().includes(q);
        const matchesSlug = cat.slug.toLowerCase().includes(q);
        const matchesDesc = (cat.description || "").toLowerCase().includes(q);
        if (!matchesName && !matchesSlug && !matchesDesc) return false;
      }

      if (selectedSector !== "All") {
        const sector = categorySectorMap.get(cat.name.toLowerCase());
        if (sector !== selectedSector) {
          const sectorItems = CATEGORY_SECTORS[selectedSector] || [];
          const isInSector = sectorItems.some(
            (s) =>
              s.toLowerCase() === cat.name.toLowerCase() ||
              cat.name.toLowerCase().includes(s.toLowerCase())
          );
          if (!isInSector) return false;
        }
      }

      return true;
    });
  }, [categories, searchQuery, selectedSector, categorySectorMap]);

  // Top Most Active Categories for Showcase
  const mostActiveShowcase = useMemo(() => {
    return [
      {
        rankTag: "#1 DOMINANT",
        name: "Cars & Automobiles",
        slug: "cars-automobiles",
        icon: <Flame className="w-3.5 h-3.5 text-amber-500" />,
        claims: "Active Ranks",
        timeAgo: "Live",
        leadingName: "Tesla Model S Plaid",
        leadingAmount: 48500,
        leadingIconBg: "bg-red-500/20 text-red-400 border border-red-500/30",
        leadingSymbol: "⚡",
      },
      {
        rankTag: "#2 RISING",
        name: "Cameras & Photography",
        slug: "cameras-photography",
        icon: <ListOrdered className="w-3.5 h-3.5 text-purple-400" />,
        claims: "Active Ranks",
        timeAgo: "Live",
        leadingName: "Sony A1 & Alpha",
        leadingAmount: 32000,
        leadingIconBg: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
        leadingSymbol: "📷",
      },
      {
        rankTag: "#3 EXPANDING",
        name: "Coding & Developer Tools",
        slug: "coding-dev-tools",
        icon: <Compass className="w-3.5 h-3.5 text-indigo-400" />,
        claims: "Active Ranks",
        timeAgo: "Live",
        leadingName: "Modulate Audio AI",
        leadingAmount: 3560,
        leadingIconBg: "bg-purple-600/20 text-purple-300 border border-purple-500/30",
        leadingSymbol: "☼",
      },
    ];
  }, []);

  function getCategoryTopProducts(categorySlug: string, categoryName: string) {
    const dbItems = productsByCategory.get(categorySlug) || [];
    if (dbItems.length > 0) {
      return dbItems.slice(0, 3).map((item) => ({
        name: item.name,
        amount: Math.round(Number(item.totalSupportAmount || "0")),
        logoLetter: item.name.slice(0, 2).toUpperCase(),
        logoBg: "bg-purple-600/20 text-purple-300 border-purple-500/30",
        logoUrl: item.logoUrl || undefined,
        slug: item.slug,
      }));
    }

    const fallbackKey = Object.keys(CATEGORY_LEADERS).find(
      (k) =>
        k === categorySlug ||
        categoryName.toLowerCase().includes(k.replace(/-/g, " ")) ||
        k.includes(categorySlug)
    );

    if (fallbackKey && CATEGORY_LEADERS[fallbackKey]) {
      return CATEGORY_LEADERS[fallbackKey];
    }

    return [
      {
        name: `${categoryName.split(" ")[0]} Leader`,
        amount: 1250,
        logoBg: "bg-purple-600/20 text-purple-300 border-purple-500/30",
        logoLetter: "✦",
      },
    ];
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 1. TOP SHOWCASE: Most active categories Card — Matches Outrank Hero Theme */}
      <section className="relative overflow-hidden rounded-3xl border border-purple-200 dark:border-purple-900/40 bg-white dark:bg-[#120f24] p-5 sm:p-7 shadow-xl shadow-purple-500/5">
        {/* Subtle Violet Aurora Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-36 bg-purple-600/10 dark:bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-72 h-28 bg-indigo-600/10 dark:bg-indigo-600/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7446d8] dark:bg-[#c084fc] animate-pulse shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-slate-950 dark:text-white tracking-tight">
              Most Active Categories
            </h2>
            <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
              <Sparkles className="w-3 h-3 text-[#7446d8] dark:text-[#c084fc]" />
              Live Leaderboard
            </span>
          </div>
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-zinc-400 mt-1">
            Where ranks are getting claimed right now across all commercial sectors.
          </p>

          {/* 3 Active Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-5">
            {mostActiveShowcase.map((card) => (
              <Link
                key={card.name}
                href={`/categories/${card.slug}`}
                className="group relative bg-slate-50 dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.08] border border-purple-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-400/50 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-[#7446d8] dark:text-[#c084fc] text-[11px] font-mono font-bold tracking-wider uppercase">
                    {card.icon}
                    <span>{card.rankTag}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mt-1.5 group-hover:text-[#7446d8] dark:group-hover:text-[#c084fc] transition-colors line-clamp-1">
                    {card.name}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-1">
                    <span>{card.claims}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{card.timeAgo}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${card.leadingIconBg}`}
                    >
                      {card.leadingSymbol}
                    </div>
                    <span className="text-slate-600 dark:text-zinc-400 truncate text-[11px]">
                      Top <strong className="text-slate-900 dark:text-zinc-200 font-semibold">{card.leadingName}</strong>
                    </span>
                  </div>
                  <span className="text-[#7446d8] dark:text-[#c084fc] font-black shrink-0 text-xs">
                    {formatDisplayPrice(card.leadingAmount)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. SEARCH & SECTOR CONTROLS */}
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-[#120f24] border border-purple-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all categories, industries & platforms..."
              className="w-full pl-10 pr-16 py-2.5 rounded-xl border border-purple-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.05] text-xs sm:text-sm text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white px-2 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs font-mono">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold border border-purple-500/20">
              <Sparkles className="w-3.5 h-3.5 text-[#7446d8] dark:text-[#c084fc]" />
              {filteredCategories.length} Categories
            </span>
          </div>
        </div>

        {/* Sector Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar text-xs">
          {sectorNames.map((sector) => {
            const isSelected = selectedSector === sector;
            return (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`shrink-0 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gradient-to-r from-[#7446d8] to-[#9333ea] text-white shadow-md shadow-purple-900/30"
                    : "bg-white dark:bg-[#120f24] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 border border-purple-200 dark:border-white/10"
                }`}
              >
                {sector === "All" ? "All Categories" : sector.split(",")[0].trim()}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CATEGORIES GRID (3 Columns with Top 3 Ranked Products) */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredCategories.map((category) => {
            const topProducts = getCategoryTopProducts(category.slug, category.name);

            return (
              <div
                key={category.slug}
                className="group relative flex flex-col justify-between bg-white dark:bg-[#120f24] hover:bg-slate-50 dark:hover:bg-white/[0.05] border border-purple-200 dark:border-white/10 hover:border-purple-500/50 dark:hover:border-purple-400/50 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div>
                  {/* Header: Outlined Violet Icon + Category Title */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <Link
                      href={`/categories/${category.slug}`}
                      className="flex items-center gap-3 min-w-0 flex-1"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/25 text-[#7446d8] dark:text-[#c084fc] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-purple-500/20 transition-all shadow-xs">
                        <CategoryIcon
                          category={category.name}
                          slug={category.slug}
                          className="w-5 h-5 text-[#7446d8] dark:text-[#c084fc]"
                        />
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white group-hover:text-[#7446d8] dark:group-hover:text-[#c084fc] transition-colors truncate">
                        {category.name}
                      </h3>
                    </Link>

                    <Link
                      href={`/categories/${category.slug}`}
                      className="text-slate-400 dark:text-zinc-500 hover:text-[#7446d8] dark:hover:text-[#c084fc] transition-colors shrink-0 p-1"
                      title="View all rankings in category"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                  {/* Top 3 Products List */}
                  <div className="space-y-2">
                    {topProducts.map((prod, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs font-mono py-1.5 border-b border-slate-100 dark:border-white/5 last:border-b-0"
                      >
                        {/* Left: #Rank + Logo + Product Title */}
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <span className="text-slate-400 dark:text-zinc-500 font-bold text-[11px] w-4 shrink-0">
                            #{idx + 1}
                          </span>

                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 border border-purple-500/20 ${
                              prod.logoBg || "bg-purple-600/20 text-purple-300"
                            }`}
                          >
                            {prod.logoLetter || "✦"}
                          </div>

                          <span className="text-slate-700 dark:text-zinc-300 font-sans font-semibold truncate text-xs">
                            {prod.name}
                          </span>
                        </div>

                        {/* Right: Violet Amount */}
                        <span className="text-[#7446d8] dark:text-[#c084fc] font-black font-mono text-xs shrink-0">
                          {formatDisplayPrice(prod.amount)}
                        </span>
                      </div>
                    ))}

                    {/* Fill remaining slots if fewer than 3 */}
                    {topProducts.length < 3 &&
                      Array.from({ length: 3 - topProducts.length }).map((_, emptyIdx) => {
                        const rankNumber = topProducts.length + emptyIdx + 1;
                        return (
                          <Link
                            key={`empty-${emptyIdx}`}
                            href={`/claim/preview?category=${category.slug}`}
                            className="flex items-center justify-between text-xs font-mono py-1.5 text-slate-400 dark:text-zinc-600 hover:text-[#7446d8] dark:hover:text-[#c084fc] transition-colors border-b border-slate-100 dark:border-white/5 last:border-b-0"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-slate-400 dark:text-zinc-600 font-bold text-[11px] w-4 shrink-0">
                                #{rankNumber}
                              </span>
                              <span className="italic text-[11px] font-sans text-slate-400 dark:text-zinc-500 hover:text-[#7446d8]">
                                Claim Rank #{rankNumber}
                              </span>
                            </div>
                            <span className="text-slate-400 dark:text-zinc-500 text-[11px]">Open</span>
                          </Link>
                        );
                      })}
                  </div>
                </div>

                {/* Footer Link */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                  <span>
                    {category.productCount || topProducts.length}{" "}
                    {(category.productCount || topProducts.length) === 1
                      ? "product"
                      : "products"}
                  </span>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-[#7446d8] dark:text-[#c084fc] hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Leaderboard</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-4 border border-dashed border-purple-300 dark:border-white/10 rounded-3xl bg-white dark:bg-[#120f24]">
          <Compass className="w-10 h-10 text-slate-400 dark:text-zinc-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No categories found</h3>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or sector pill to discover categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("All");
            }}
            className="mt-4 px-5 py-2 rounded-xl bg-gradient-to-r from-[#7446d8] to-[#9333ea] text-white text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow-md shadow-purple-900/30"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
