"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Crown, Medal, Award, ArrowRight, Heart, Info, Globe } from "lucide-react";
import { VerifiedBadge } from "./verified-badge";
import { CountryFlag } from "./country-flag";
import { WORLD_COUNTRIES_CATALOG, type WorldCountry } from "@/lib/data/world-countries";
import { useUserCurrency } from "@/lib/currency";

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

export function GlobalCountryList() {
  const { formatAmount } = useUserCurrency();
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [localContributions, setLocalContributions] = useState<Record<string, number>>({});

  useEffect(() => {
    function loadSaved() {
      try {
        const raw = localStorage.getItem("outrank_territory_contributions");
        if (raw) setLocalContributions(JSON.parse(raw));

        // Load real persistent country likes (strictly 0 demo numbers)
        const rawLikes: Record<string, number> = {};
        const rawUserLiked: Record<string, boolean> = {};
        for (const country of WORLD_COUNTRIES_CATALOG) {
          const storedLikes = localStorage.getItem(`outrank_country_likes_${country.id}`);
          if (storedLikes) {
            rawLikes[country.id] = Math.max(0, parseInt(storedLikes, 10) || 0);
          }
          const storedUser = localStorage.getItem(`outrank_country_liked_${country.id}`);
          if (storedUser === "true") {
            rawUserLiked[country.id] = true;
          }
        }
        setLikesMap(rawLikes);
        setUserLikes(rawUserLiked);
      } catch {}
    }
    loadSaved();
    window.addEventListener("storage", loadSaved);
    return () => window.removeEventListener("storage", loadSaved);
  }, []);

  const sortedCountries = useMemo(() => {
    return [...WORLD_COUNTRIES_CATALOG].sort((a, b) => {
      const aBonus = localContributions[a.name] || localContributions[a.code] || 0;
      const bBonus = localContributions[b.name] || localContributions[b.code] || 0;
      const aTotal = a.currentPool + aBonus;
      const bTotal = b.currentPool + bBonus;
      if (bTotal !== aTotal) return bTotal - aTotal;
      return 0;
    });
  }, [localContributions]);

  function handleToggleLike(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const hasLiked = !!userLikes[id];
    const current = likesMap[id] || 0;
    const next = hasLiked ? Math.max(0, current - 1) : current + 1;
    setUserLikes((prev) => ({ ...prev, [id]: !hasLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: next,
    }));
    try {
      localStorage.setItem(`outrank_country_likes_${id}`, String(next));
      localStorage.setItem(`outrank_country_liked_${id}`, String(!hasLiked));
    } catch {}
  }

  return (
    <section aria-label="Sovereign Countries Leaderboard" className="space-y-2">
      {sortedCountries.map((country, index) => {
        const rank = index + 1;
        const isRoyal = rank <= 3;
        const royalRank = rank === 1 ? 1 : rank === 2 ? 2 : 3;
        const countryPool =
          country.currentPool +
          (localContributions[country.name] || localContributions[country.code] || 0);

        // Real likes: starts from 0 with real user actions
        const likes = likesMap[country.id] || 0;
        const hasLiked = !!userLikes[country.id];

        return (
          <article
            key={country.id}
            className={`outrank-ranking-row flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl border transition-all duration-200 gap-3 min-h-[72px] ${
              rank === 1
                ? "border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.06)] bg-gradient-to-r from-amber-50/20 via-purple-50/10 to-[var(--surface)] dark:from-amber-950/15 dark:via-purple-950/10 dark:to-[var(--surface)]"
                : "border-[var(--border)] bg-[var(--surface)] hover:shadow-sm"
            }`}
          >
            {/* Left: Rank + Official Flag + Country Info */}
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
              <div className="w-8 sm:w-9 shrink-0 flex items-center justify-center">
                {isRoyal ? (
                  <RoyalRankBadge rank={royalRank} />
                ) : (
                  <span className="text-sm font-bold text-[var(--text-secondary)]">#{rank}</span>
                )}
              </div>

              {/* Official Graphic Country Flag */}
              <div className="shrink-0 flex items-center justify-center select-none">
                <CountryFlag code={country.code} name={country.name} size="xl" className="shadow-sm" />
              </div>

              {/* Country Details */}
              <div className="min-w-0 flex-1 overflow-hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-nowrap">
                  <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate shrink-0 max-w-[140px] sm:max-w-[220px]">
                    <Link
                      href={`/global/${country.code.toLowerCase()}`}
                      className="hover:text-[var(--accent)] transition-colors"
                    >
                      {country.name}
                    </Link>
                  </h2>
                  <VerifiedBadge size="sm" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded-md shrink-0">
                    {country.code}
                  </span>
                </div>

                <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5 leading-normal">
                  Capital: {country.capital} • Region: {country.region} • {country.states.length} Administrative Subdivisions
                </p>
              </div>
            </div>

            {/* Right: Confirmed Capital + Heart + View Button (Navigates to Next Page) */}
            <div className="flex items-center justify-end gap-2.5 sm:gap-4 shrink-0">
              <div className="text-right shrink-0">
                <div className="text-sm sm:text-base font-extrabold text-[#7446d8] dark:text-[#c084fc] tracking-tight whitespace-nowrap font-mono">
                  {formatAmount(countryPool)}
                </div>
                <div className="hidden sm:flex items-center justify-end gap-1 text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                  <span>Contribution</span>
                  <Info className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
                </div>
              </div>

              {/* Interactive Heart */}
              <button
                type="button"
                onClick={(e) => handleToggleLike(country.id, e)}
                aria-label={hasLiked ? "Unlike country" : "Like country"}
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

              {/* High-Contrast View Button: Opens next page for the country */}
              <Link
                href={`/global/${country.code.toLowerCase()}`}
                className="shrink-0 inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-black border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span className="font-extrabold text-black">View</span>
                <ArrowRight className="w-3 h-3 text-black stroke-[3]" aria-hidden="true" />
              </Link>
            </div>
          </article>
        );
      })}
    </section>
  );
}
