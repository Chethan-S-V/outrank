"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Trophy,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  ArrowRight,
  Plus,
  Minus,
  Coins,
  MapPin,
  CheckCircle2,
  X,
  Crown,
} from "lucide-react";
import {
  WORLD_COUNTRIES_CATALOG,
  type WorldCountry,
  type WorldState,
} from "@/lib/data/world-countries";
import { CountryFlag } from "./country-flag";
import { useRegionalCurrency, formatCanonicalAmount } from "@/lib/currency";

type ActiveBidTarget = {
  type: "country" | "state";
  country: WorldCountry;
  state?: WorldState;
};

export function CountryBiddingList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>("IND");

  // Modal Bid state
  const [activeBidTarget, setActiveBidTarget] = useState<ActiveBidTarget | null>(null);
  const [productUrl, setProductUrl] = useState("");
  const [bidAmount, setBidAmount] = useState<number>(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { currency } = useRegionalCurrency();

  function formatDisplayAmount(usdVal: number) {
    if (currency === "USD") return `$${usdVal.toLocaleString()}`;
    return formatCanonicalAmount(usdVal * 85, currency);
  }

  const regions = useMemo(() => {
    return [
      "All",
      "North America",
      "South Asia",
      "Europe",
      "East Asia",
      "Middle East",
      "South America",
      "Africa",
      "Oceania",
    ];
  }, []);

  // Filter countries by search query & continent
  const filteredCountries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return WORLD_COUNTRIES_CATALOG.filter((c) => {
      if (selectedRegion !== "All" && c.region !== selectedRegion) {
        return false;
      }
      if (!q) return true;
      const matchCountry =
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q);
      const matchState = c.states.some(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      );
      return matchCountry || matchState;
    });
  }, [searchQuery, selectedRegion]);

  function handleOpenBid(target: ActiveBidTarget) {
    setActiveBidTarget(target);
    const min = target.state ? target.state.minBid : Math.round(target.country.currentPool * 0.05);
    setBidAmount(Math.max(100, min));
    setProductUrl("");
    setSuccessMessage(null);
  }

  function handleConfirmBid() {
    if (!activeBidTarget) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const targetName =
        activeBidTarget.type === "state"
          ? `${activeBidTarget.state?.name}, ${activeBidTarget.country.name}`
          : activeBidTarget.country.name;
      setSuccessMessage(
        `Successfully contributed ${formatDisplayAmount(bidAmount)} on ${targetName}! Rank #1 claimed.`
      );
      setTimeout(() => {
        setActiveBidTarget(null);
        setSuccessMessage(null);
      }, 2400);
    }, 800);
  }

  return (
    <div className="space-y-4">
      {/* Search & Region Filter Bar (styled like home search) */}
      <div className="flex flex-col gap-3">
        <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#12151c] border border-white/10 rounded-2xl p-3 sm:p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search world nation, official flag, capital, or state (e.g. California, Karnataka, England, Tokyo)..."
              className="w-full pl-10 pr-16 py-2 rounded-xl bg-[#191d27] border border-white/10 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-zinc-400 hover:text-white px-2 py-0.5 rounded bg-zinc-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              <Globe className="w-3.5 h-3.5" />
              {filteredCountries.length} Sovereign Nations
            </span>
          </div>
        </div>

        {/* Continent Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar text-xs">
          {regions.map((region) => {
            const isSelected = selectedRegion === region;
            return (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`shrink-0 px-3 py-1 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "bg-[#12151c] hover:bg-[#1a1e28] text-zinc-400 hover:text-zinc-200 border border-white/5"
                }`}
              >
                {region === "All" ? "All Continents" : region}
              </button>
            );
          })}
        </div>
      </div>

      {/* Royal Countries Leaderboard Rows (Styled like RankingRows) */}
      <div className="space-y-3">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country, index) => {
            const rank = index + 1;
            const isExpanded = expandedCountryId === country.id;
            const isTop3 = rank <= 3;

            return (
              <div
                key={country.id}
                className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden ${
                  rank === 1
                    ? "bg-gradient-to-r from-amber-950/20 via-[#13161f] to-[#13161f] border-amber-500/30 hover:border-amber-500/50 shadow-md"
                    : rank === 2
                    ? "bg-gradient-to-r from-slate-900/30 via-[#13161f] to-[#13161f] border-slate-400/30 hover:border-slate-400/50"
                    : rank === 3
                    ? "bg-gradient-to-r from-orange-950/20 via-[#13161f] to-[#13161f] border-orange-600/30 hover:border-orange-600/50"
                    : "bg-[#12151c] border-white/8 hover:border-white/20"
                }`}
              >
                {/* Main Country Row */}
                <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Rank + Official Flag + Country Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Rank Badge */}
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-black text-sm shrink-0 border ${
                        rank === 1
                          ? "bg-amber-500/20 text-amber-400 border-amber-500/40 shadow-sm shadow-amber-500/20"
                          : rank === 2
                          ? "bg-slate-300/20 text-slate-200 border-slate-300/40"
                          : rank === 3
                          ? "bg-orange-600/20 text-orange-400 border-orange-600/40"
                          : "bg-white/5 text-zinc-400 border-white/10"
                      }`}
                    >
                      {rank === 1 ? <Crown className="w-4 h-4 text-amber-400" /> : `#${rank}`}
                    </div>

                    {/* Official Graphic Country Flag */}
                    <div className="shrink-0 p-1 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-sm">
                      <CountryFlag code={country.code} name={country.name} size="xl" />
                    </div>

                    {/* Country Names & Dominant Leader */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                          {country.name}
                        </h3>
                        <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          {country.code}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          Capital: <strong className="text-zinc-200">{country.capital}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mt-1 text-xs font-mono flex-wrap">
                        <div className="flex items-center gap-1 text-purple-400">
                          <Globe className="w-3 h-3 shrink-0" />
                          <span>
                            Subdivisions: <strong>{country.states.length} Divisions</strong>
                          </span>
                        </div>

                        <span className="text-zinc-600 hidden sm:inline">•</span>

                        <span className="text-zinc-400">
                          Bidded Pool:{" "}
                          <strong className="text-emerald-400">
                            {formatDisplayAmount(country.currentPool)}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions: Bid on Country + Explore States */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                    {/* Bid on Country Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenBid({ type: "country", country })}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/25 cursor-pointer"
                    >
                      <Coins className="w-3.5 h-3.5" />
                      <span>Bid on Country #1</span>
                    </button>

                    {/* Expand States */}
                    <button
                      type="button"
                      onClick={() => setExpandedCountryId(isExpanded ? null : country.id)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                        isExpanded
                          ? "bg-white/10 text-white border-white/20"
                          : "bg-[#191d27] hover:bg-[#222836] text-zinc-300 border-white/10"
                      }`}
                    >
                      <span>{country.states.length} States</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded All Complete States of that Country with Official Flags */}
                {isExpanded && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-white/5 bg-[#0e1017]">
                    <div className="flex items-center justify-between py-2 text-xs font-mono text-zinc-400">
                      <span className="flex items-center gap-1.5 font-bold text-zinc-200">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        Complete States & Territories of {country.name}:
                      </span>
                      <span className="text-[11px] text-zinc-500">
                        Bid to claim the #1 Sovereign Spot for each state
                      </span>
                    </div>

                    {/* States Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                      {country.states.map((st) => (
                        <div
                          key={st.id}
                          className="bg-[#141822] border border-white/5 hover:border-emerald-500/40 rounded-xl p-3.5 flex flex-col justify-between transition-all group"
                        >
                          <div>
                            {/* State Header: Official Flag + Name */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                  {st.name}
                                </h4>
                              </div>
                              <span className="text-[10px] font-mono font-bold text-zinc-400 px-1.5 py-0.5 rounded bg-white/5">
                                {st.code}
                              </span>
                            </div>

                            {/* State Stats */}
                            <div className="mt-2.5 space-y-1 text-[11px] font-mono">
                              <div className="text-zinc-400 flex items-center justify-between">
                                <span>Type:</span>
                                <strong className="text-zinc-200 truncate max-w-[130px]">
                                  {st.type || "Subdivision"}
                                </strong>
                              </div>
                              <div className="text-zinc-400 flex items-center justify-between">
                                <span>Current Bid:</span>
                                <strong className="text-emerald-400">
                                  {formatDisplayAmount(st.currentBid)}
                                </strong>
                              </div>
                            </div>
                          </div>

                          {/* Bid on State Button */}
                          <button
                            type="button"
                            onClick={() =>
                              handleOpenBid({
                                type: "state",
                                country,
                                state: st,
                              })
                            }
                            className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Bid on State #1</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-[#12151c]">
            <Globe className="w-10 h-10 text-zinc-500 mx-auto mb-2 opacity-50" />
            <h4 className="text-sm font-bold text-white">No territories found</h4>
            <p className="text-xs text-zinc-400 mt-1">Try searching for another country or clearing your filters.</p>
          </div>
        )}
      </div>

      {/* Modal Bidding Drawer */}
      {activeBidTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#12151c] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setActiveBidTarget(null)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Coins className="w-4 h-4" />
              <span>Sovereign Territorial Bidding</span>
            </div>

            <h3 className="text-lg font-black text-white mt-2 flex items-center gap-2 flex-wrap">
              <span>
                Bid on{" "}
                <span className="text-emerald-400">
                  {activeBidTarget.type === "state"
                    ? `${activeBidTarget.state?.name}, ${activeBidTarget.country.name}`
                    : activeBidTarget.country.name}
                </span>
              </span>
              <CountryFlag code={activeBidTarget.country.code} size="sm" />
            </h3>

            <p className="text-xs text-zinc-400 mt-1">
              Outbid current leaders to crown your product or brand as the official #1 holder.
            </p>

            {successMessage ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-zinc-300 font-semibold">Contribution Amount:</span>
                    <span className="text-emerald-400 font-bold">
                      {formatDisplayAmount(bidAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBidAmount((prev) => Math.max(50, prev - 100))}
                      className="w-10 h-10 rounded-xl bg-[#191d27] hover:bg-[#222836] border border-white/10 text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Math.max(10, Number(e.target.value)))}
                      className="w-full py-2 px-3 text-center rounded-xl bg-[#191d27] border border-white/10 text-sm font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />

                    <button
                      type="button"
                      onClick={() => setBidAmount((prev) => prev + 100)}
                      className="w-10 h-10 rounded-xl bg-[#191d27] hover:bg-[#222836] border border-white/10 text-white flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2">
                    {[100, 250, 500, 1000, 2500].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setBidAmount(val)}
                        className={`flex-1 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                          bidAmount === val
                            ? "bg-emerald-600 text-white"
                            : "bg-[#191d27] text-zinc-400 hover:text-white border border-white/5"
                        }`}
                      >
                        +{val}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting || !productUrl.trim()}
                  onClick={handleConfirmBid}
                  className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25"
                >
                  {isSubmitting ? (
                    <span>Confirming Bid...</span>
                  ) : (
                    <>
                      <span>Stake {formatDisplayAmount(bidAmount)} & Claim Rank #1</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
