"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Globe,
  Search,
  X,
  Trophy,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Minus,
  Coins,
  MapPin,
  TrendingUp,
} from "lucide-react";
import {
  WORLD_COUNTRIES_CATALOG,
  type WorldCountry,
  type WorldState,
} from "@/lib/data/world-countries";
import { CountryFlag } from "./country-flag";
import { useRegionalCurrency, formatCanonicalAmount } from "@/lib/currency";

type GlobalTerritoryModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ActiveContributionTarget = {
  type: "country" | "state";
  country: WorldCountry;
  state?: WorldState;
};

export function GlobalTerritoryModal({ isOpen, onClose }: GlobalTerritoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>("IND");
  const [contributionTarget, setContributionTarget] = useState<ActiveContributionTarget | null>(null);

  // Contribution Form State
  const [productUrl, setProductUrl] = useState("");
  const [bidAmount, setBidAmount] = useState<number>(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { currency } = useRegionalCurrency();

  function formatRegionalAmount(usdAmount: number) {
    if (currency === "USD") {
      return `$${usdAmount.toLocaleString()}`;
    }
    return formatCanonicalAmount(usdAmount * 85, currency);
  }

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (contributionTarget) {
          setContributionTarget(null);
        } else {
          onClose();
        }
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, contributionTarget, onClose]);

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

  // Filtered countries
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

  // Aggregate stats
  const totalStats = useMemo(() => {
    let pool = 0;
    let statesCount = 0;
    for (const c of WORLD_COUNTRIES_CATALOG) {
      pool += c.currentPool;
      statesCount += c.states.length;
    }
    return {
      totalCountries: WORLD_COUNTRIES_CATALOG.length,
      totalStates: statesCount,
      totalPool: pool,
    };
  }, []);

  function handleOpenContribution(target: ActiveContributionTarget) {
    setContributionTarget(target);
    const min = target.state ? target.state.minBid : Math.round(target.country.currentPool * 0.05);
    setBidAmount(Math.max(100, min));
    setSuccessMessage(null);
  }

  function handleConfirmBid() {
    if (!contributionTarget) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(
        `Successfully contributed ${formatRegionalAmount(bidAmount)} on ${
          contributionTarget?.type === "state"
            ? `${contributionTarget.state?.name}, ${contributionTarget.country.name}`
            : contributionTarget?.country.name
        }! Rank #1 claimed.`
      );
      setTimeout(() => {
        setContributionTarget(null);
        setSuccessMessage(null);
        setProductUrl("");
      }, 2200);
    }, 900);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300">
      {/* Centered Modal Container with revolving 3D entrance */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#0d0f14] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-zinc-100 animate-in zoom-in-95 duration-300">
        {/* Animated revolving globe ambient light */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. MODAL HEADER */}
        <div className="relative z-10 px-6 py-5 border-b border-white/8 bg-[#12151c]/90 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Revolving Globe Icon with smooth 3D spin */}
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Globe className="w-6 h-6 text-emerald-400 animate-spin [animation-duration:16s]" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-emerald-400/30 animate-ping opacity-25" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Global Nations & Territories</span>
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Registry
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Contribute on countries and states to claim #1 territorial rank dominance.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. STATS BANNER */}
        <div className="px-6 py-2.5 bg-[#0f1218] border-b border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-4">
            <span>
              Countries: <strong className="text-white">{totalStats.totalCountries}</strong>
            </span>
            <span>•</span>
            <span>
              States & Provinces: <strong className="text-white">{totalStats.totalStates}</strong>
            </span>
            <span>•</span>
            <span>
              Contribution Amount: <strong className="text-emerald-400">{formatRegionalAmount(totalStats.totalPool)}</strong>
            </span>
          </div>

          <span className="text-[11px] text-zinc-500">
            Display Currency: <strong className="text-zinc-300">{currency}</strong>
          </span>
        </div>

        {/* 3. SEARCH & REGION FILTERS */}
        <div className="p-4 sm:px-6 bg-[#10131a] border-b border-white/5 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any country, official flag, capital, or state (e.g. California, Karnataka, England, Tokyo)..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#171b24] border border-white/10 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar text-xs">
            {regions.map((region) => {
              const isSelected = selectedRegion === region;
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => setSelectedRegion(region)}
                  className={`shrink-0 px-3 py-1 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-600 text-white font-semibold shadow-xs"
                      : "bg-[#171b24] hover:bg-[#1f2430] text-zinc-400 hover:text-zinc-200 border border-white/5"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SCROLLABLE COUNTRIES & STATES CATALOG */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => {
              const isExpanded = expandedCountryId === country.id;
              const poolPercent = Math.min(
                100,
                Math.round((country.currentPool / country.targetPool) * 100)
              );

              return (
                <div
                  key={country.id}
                  className="bg-[#13161e] border border-white/8 hover:border-emerald-500/30 rounded-2xl transition-all duration-200 overflow-hidden shadow-sm"
                >
                  {/* Country Card Row */}
                  <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Country Left: Graphic Flag + Name + Region */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      <div className="shrink-0 p-1 rounded-xl bg-purple-500/10 border border-purple-500/20 shadow-sm">
                        <CountryFlag code={country.code} name={country.name} size="xl" />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                            {country.name}
                          </h3>
                          <span className="text-[10px] font-mono font-bold text-zinc-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                            {country.code}
                          </span>
                          <span className="text-[11px] text-zinc-400">
                            Capital: <strong className="text-zinc-200">{country.capital}</strong>
                          </span>
                        </div>

                        {/* Leader & Capital Pool */}
                        <div className="flex items-center gap-3 mt-1.5 text-xs font-mono flex-wrap">
                          <div className="flex items-center gap-1.5 text-purple-400">
                            <Globe className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Subdivisions: <strong>{country.states.length} Divisions</strong>
                            </span>
                          </div>

                          <span className="text-zinc-600 hidden sm:inline">•</span>

                          <span className="text-zinc-400">
                            Pool:{" "}
                            <strong className="text-emerald-400">
                              {formatRegionalAmount(country.currentPool)}
                            </strong>{" "}
                            / {formatRegionalAmount(country.targetPool)} ({poolPercent}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Country Right: Action Buttons */}
                    <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                      {/* Contribute on Country Button */}
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenContribution({ type: "country", country })
                        }
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 cursor-pointer"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Contribute on Country</span>
                      </button>

                      {/* Expand States Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCountryId(isExpanded ? null : country.id)
                        }
                        className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isExpanded
                            ? "bg-white/10 text-white border-white/20"
                            : "bg-[#1a1e28] hover:bg-[#222836] text-zinc-300 border-white/10"
                        }`}
                      >
                        <span>{country.states.length} States</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 5. EXPANDED STATES ACCORDION */}
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t border-white/5 bg-[#0e1017]">
                      <div className="flex items-center justify-between py-2 text-xs text-zinc-400 font-mono">
                        <span className="flex items-center gap-1.5 font-bold text-zinc-300">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          States & Administrative Territories in {country.name}:
                        </span>
                        <span>Click any state to stake / outrank</span>
                      </div>

                      {/* States Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-1">
                        {country.states.map((st) => (
                          <div
                            key={st.id}
                            className="bg-[#141822] border border-white/5 hover:border-emerald-500/40 rounded-xl p-3 flex flex-col justify-between transition-all group"
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                                  {st.name}
                                </h4>
                                <span className="text-[10px] font-mono text-zinc-500 px-1.5 py-0.2 rounded bg-white/5">
                                  {st.code}
                                </span>
                              </div>

                              <div className="mt-2 space-y-1 text-[11px] font-mono">
                                <div className="text-zinc-400 flex items-center justify-between">
                                  <span>Type:</span>
                                  <strong className="text-zinc-200 truncate max-w-[130px]">
                                    {st.type || "Subdivision"}
                                  </strong>
                                </div>
                                <div className="text-zinc-400 flex items-center justify-between">
                                  <span>Current Bid:</span>
                                  <strong className="text-emerald-400">
                                    {formatRegionalAmount(st.currentBid)}
                                  </strong>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenContribution({
                                  type: "state",
                                  country,
                                  state: st,
                                })
                              }
                              className="mt-3 w-full py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 text-[11px] font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Contribute on State</span>
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
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl bg-[#13161e]">
              <Globe className="w-10 h-10 text-zinc-500 mx-auto mb-2 opacity-50" />
              <h4 className="text-sm font-bold text-white">No territories found</h4>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching for another country or clearing your filters.
              </p>
            </div>
          )}
        </div>

        {/* 6. INLINE CONTRIBUTION MODAL DRAWER */}
        {contributionTarget && (
          <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-[#13161e] border border-emerald-500/40 rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setContributionTarget(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider">
                <Coins className="w-4 h-4" />
                <span>Territorial Contribution</span>
              </div>

              <h3 className="text-lg font-black text-white mt-2">
                Contribute on{" "}
                <span className="text-emerald-400">
                  {contributionTarget.type === "state"
                    ? `${contributionTarget.state?.name}, ${contributionTarget.country.name}`
                    : contributionTarget.country.name}
                </span>{" "}
                {contributionTarget.country.flag}
              </h3>

              <p className="text-xs text-zinc-400 mt-1">
                Your contribution stakes ranking dominance for your product in this territory.
              </p>

              {successMessage ? (
                <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {/* Bid Amount with + and - */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="text-zinc-300 font-semibold">Contribution Amount:</span>
                      <span className="text-emerald-400 font-bold">
                        {formatRegionalAmount(bidAmount)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setBidAmount((prev) => Math.max(50, prev - 100))}
                        className="w-10 h-10 rounded-xl bg-[#1a1e28] hover:bg-[#222836] border border-white/10 text-white flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <input
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(Math.max(10, Number(e.target.value)))}
                        className="w-full py-2 px-3 text-center rounded-xl bg-[#1a1e28] border border-white/10 text-sm font-bold font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />

                      <button
                        type="button"
                        onClick={() => setBidAmount((prev) => prev + 100)}
                        className="w-10 h-10 rounded-xl bg-[#1a1e28] hover:bg-[#222836] border border-white/10 text-white flex items-center justify-center shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Preset buttons */}
                    <div className="flex items-center gap-1.5 mt-2">
                      {[100, 250, 500, 1000, 2500].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setBidAmount(val)}
                          className={`flex-1 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all cursor-pointer ${
                            bidAmount === val
                              ? "bg-emerald-600 text-white"
                              : "bg-[#1a1e28] text-zinc-400 hover:text-white border border-white/5"
                          }`}
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleConfirmBid}
                    className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25"
                  >
                    {isSubmitting ? (
                      <span>Confirming Contribution...</span>
                    ) : (
                      <>
                        <span>Stake {formatRegionalAmount(bidAmount)} & Claim Rank</span>
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
    </div>
  );
}
