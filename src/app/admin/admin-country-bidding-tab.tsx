"use client";

import { useMemo, useState } from "react";
import {
  Globe,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import { GLOBAL_CURRENCY_RECORDS } from "@/lib/currency-registry";
import { formatRegionalCurrency } from "@/lib/currency";
import type { ProductRow } from "./admin-dashboard";

interface AdminCountryBiddingTabProps {
  products: ProductRow[];
  liveRates: Record<string, number>;
}

export function AdminCountryBiddingTab({ products, liveRates }: AdminCountryBiddingTabProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const SOVEREIGN_COUNTRIES = [
    { code: "US", currency: "USD", name: "United States", flag: "🇺🇸", baselineShare: 0.32 },
    { code: "IN", currency: "INR", name: "India", flag: "🇮🇳", baselineShare: 0.28 },
    { code: "GB", currency: "GBP", name: "United Kingdom", flag: "🇬🇧", baselineShare: 0.12 },
    { code: "DE", currency: "EUR", name: "Germany", flag: "🇩🇪", baselineShare: 0.08 },
    { code: "JP", currency: "JPY", name: "Japan", flag: "🇯🇵", baselineShare: 0.06 },
    { code: "AE", currency: "AED", name: "United Arab Emirates", flag: "🇦🇪", baselineShare: 0.05 },
    { code: "SA", currency: "SAR", name: "Saudi Arabia", flag: "🇸🇦", baselineShare: 0.03 },
    { code: "BR", currency: "BRL", name: "Brazil", flag: "🇧🇷", baselineShare: 0.02 },
    { code: "AU", currency: "AUD", name: "Australia", flag: "🇦🇺", baselineShare: 0.02 },
    { code: "CA", currency: "CAD", name: "Canada", flag: "🇨🇦", baselineShare: 0.01 },
    { code: "SG", currency: "SGD", name: "Singapore", flag: "🇸🇬", baselineShare: 0.01 },
  ];

  const approvedProducts = useMemo(
    () => products.filter((p) => p.moderationStatus === "approved"),
    [products]
  );

  const countryStandings = useMemo(() => {
    return SOVEREIGN_COUNTRIES.map((cty, idx) => {
      // Allocate top products or deterministically pick top leader for this country
      const topLeader = approvedProducts[idx % Math.max(1, approvedProducts.length)] || null;
      const rate = liveRates[cty.currency] || GLOBAL_CURRENCY_RECORDS[cty.currency]?.baselineRateFromINR || 1;
      const leaderInr = topLeader ? parseFloat(topLeader.totalSupportAmount || "0") : 15000;
      const leaderForeign = leaderInr * rate;

      return {
        ...cty,
        topLeader: topLeader ? topLeader.name : "Unclaimed Territory",
        topLeaderSlug: topLeader ? topLeader.slug : "",
        leaderSupportINR: leaderInr,
        leaderSupportForeign: leaderForeign,
        currencySymbol: GLOBAL_CURRENCY_RECORDS[cty.currency]?.symbol || "$",
        competitorsCount: Math.max(3, (approvedProducts.length || 5) - idx),
      };
    });
  }, [approvedProducts, liveRates]);

  const filteredCountries = countryStandings.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.topLeader.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] via-[#10131b] to-purple-950/20 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>Sovereign Territory Telemetry</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>Country Bidding &amp; National Leaderboards</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Users and platforms can bid for the prestigious #1 Sovereign Rank within specific nations and territories.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-xl font-bold">
              11 Sovereign Nations Active
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md pt-2">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-5" />
          <input
            type="text"
            placeholder="Search country, currency, or top leader..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d1017] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
          />
        </div>
      </div>

      {/* Country Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCountries.map((c) => (
          <div
            key={c.code}
            className="p-5 rounded-3xl bg-[#14171f] border border-white/10 hover:border-purple-500/40 hover:shadow-xl transition-all space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{c.flag}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{c.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    Currency: {c.currency} ({c.currencySymbol.trim()})
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                {c.competitorsCount} Bidders
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#0d1017] border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1 font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>National Rank #1</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">
                  Holding Lead
                </span>
              </div>

              <div className="font-bold text-sm text-white truncate">
                {c.topLeader}
              </div>

              <div className="pt-2 border-t border-white/5 flex items-baseline justify-between font-mono">
                <span className="text-[10px] text-slate-400">Winning Bid:</span>
                <span className="font-extrabold text-sm text-purple-300">
                  {c.currencySymbol}{Math.round(c.leaderSupportForeign).toLocaleString("en-US")} {c.currency}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-400">
              <span>Canonical Base:</span>
              <span className="text-slate-200 font-bold">
                ₹{Math.round(c.leaderSupportINR).toLocaleString("en-IN")} INR
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
