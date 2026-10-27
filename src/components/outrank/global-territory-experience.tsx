"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Crown,
  Medal,
  Award,
  Link2,
  ArrowRight,
  Heart,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Coins,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import { BidAmountControl } from "./bid-amount-control";
import { ClaimPeriodToggle, type ClaimPeriod } from "./claim-period-toggle";
import { ClaimRankVisual } from "./claim-rank-visual";
import { VerifiedBadge } from "./verified-badge";
import { CountryFlag } from "./country-flag";
import { useUserCurrency } from "@/lib/currency";
import {
  WORLD_COUNTRIES_CATALOG,
  type WorldCountry,
  type WorldState,
} from "@/lib/data/world-countries";

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

type ActiveBidModalTarget = {
  type: "country" | "state";
  country: WorldCountry;
  state?: WorldState;
};

export function GlobalTerritoryExperience() {
  const router = useRouter();
  const { formatAmount } = useUserCurrency();

  const [period, setPeriod] = useState<ClaimPeriod>("all-time");
  const [viewScope, setViewScope] = useState<"countries" | "states">("countries");
  const [productUrl, setProductUrl] = useState("");
  const [bidAmount, setBidAmount] = useState(1000003000); // 1,000,003,000 INR baseline
  const [expandedCountryId, setExpandedCountryId] = useState<string | null>("IND");

  // Likes state
  const [likesMap, setLikesMap] = useState<Record<string, number>>({
    IND: 42000350,
    USA: 41800240,
    GBR: 28400190,
    DEU: 18400120,
    JPN: 14500090,
  });
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  // Bidding Modal State
  const [biddingTarget, setBiddingTarget] = useState<ActiveBidModalTarget | null>(null);
  const [modalProductUrl, setModalProductUrl] = useState("");
  const [modalBidAmount, setModalBidAmount] = useState<number>(1000003000);
  const [isSubmittingModal, setIsSubmittingModal] = useState(false);
  const [modalSuccessMsg, setModalSuccessMsg] = useState<string | null>(null);

  // Sorted list of countries
  const countries = useMemo(() => {
    return [...WORLD_COUNTRIES_CATALOG].sort((a, b) => b.currentPool - a.currentPool);
  }, []);

  // Flattened all states list for "states" view
  const allStates = useMemo(() => {
    const list: { state: WorldState; country: WorldCountry }[] = [];
    for (const c of WORLD_COUNTRIES_CATALOG) {
      for (const s of c.states) {
        list.push({ state: s, country: c });
      }
    }
    return list.sort((a, b) => b.state.currentBid - a.state.currentBid);
  }, []);

  function handleToggleLike(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const hasLiked = !!userLikes[id];
    setUserLikes((prev) => ({ ...prev, [id]: !hasLiked }));
    setLikesMap((prev) => ({
      ...prev,
      [id]: (prev[id] || 100) + (hasLiked ? -1 : 1),
    }));
  }

  function handleClaimFromHero(e: React.FormEvent) {
    e.preventDefault();
    if (!productUrl.trim()) return;
    // Pre-populate claim preview or open modal for #1 Nation
    const targetCountry = countries[0];
    setBiddingTarget({ type: "country", country: targetCountry });
    setModalProductUrl(productUrl);
    setModalBidAmount(bidAmount);
  }

  function handleOpenBidModal(target: ActiveBidModalTarget) {
    setBiddingTarget(target);
    setModalProductUrl("");
    const minInr = target.state
      ? target.state.currentBid * 85
      : target.country.currentPool * 85;
    setModalBidAmount(Math.max(1000, Math.ceil(minInr + 1000)));
    setModalSuccessMsg(null);
  }

  function handleConfirmModalBid() {
    if (!biddingTarget) return;
    setIsSubmittingModal(true);
    setTimeout(() => {
      setIsSubmittingModal(false);
      const name =
        biddingTarget.type === "state"
          ? `${biddingTarget.state?.name}, ${biddingTarget.country.name}`
          : biddingTarget.country.name;
      setModalSuccessMsg(`Successfully contributed on ${name}! Rank #1 claimed.`);
      setTimeout(() => {
        setBiddingTarget(null);
        setModalSuccessMsg(null);
      }, 2000);
    }, 800);
  }

  return (
    <main className="outrank-main w-full space-y-4">
      {/* 1. HERO SECTION (Exact UI matching Home Page Screenshot) */}
      <section aria-labelledby="claim-rank-title" className="outrank-claim-hero">
        <div className="outrank-claim-content">
          <ClaimPeriodToggle onChange={setPeriod} period={period} />

          <div className="outrank-claim-title-row">
            <div>
              <h1 id="claim-rank-title" className="flex items-center flex-wrap gap-2 text-white">
                <span>Claim #1 for</span>
                <BidAmountControl
                  amount={bidAmount}
                  max={1_000_000_000_000}
                  min={1}
                  onChange={setBidAmount}
                />
              </h1>
            </div>
          </div>

          <form className="outrank-claim-form space-y-3" onSubmit={handleClaimFromHero}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-3xl lg:max-w-4xl">
              <div className="flex-1 flex items-center px-4 py-3.5 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] focus-within:bg-white/[0.14] border border-white/20 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all">
                <Link2 className="w-4 h-4 text-purple-300 mr-3 shrink-0" aria-hidden="true" />
                <input
                  type="text"
                  value={productUrl}
                  onChange={(e) => setProductUrl(e.target.value)}
                  placeholder="Product URL, Instagram user, or @profile link"
                  className="outrank-clean-url-input w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm text-white placeholder-purple-200/50"
                  style={{
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    background: "transparent",
                  }}
                />
              </div>

              <button
                type="submit"
                className="shrink-0 flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 active:scale-95 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              >
                <span>Claim Rank</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </form>
        </div>

        {/* 3D Isometric Purple Rising Pedestals with Crown (Exact from Screenshot) */}
        <ClaimRankVisual />
      </section>

      {/* Scope Switcher: Countries vs States */}
      <div className="flex items-center gap-2 px-1">
        <button
          type="button"
          onClick={() => setViewScope("countries")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            viewScope === "countries"
              ? "bg-[#7446d8] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]"
          }`}
        >
          World Nations (All Countries)
        </button>

        <button
          type="button"
          onClick={() => setViewScope("states")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            viewScope === "states"
              ? "bg-[#7446d8] text-white shadow-sm"
              : "bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)] border border-[var(--border)]"
          }`}
        >
          All Administrative States
        </button>
      </div>

      {/* 2. RANKING ROWS LEADERBOARD (Exact UI matching Home Page Screenshot) */}
      <div className="w-full space-y-2">
        {viewScope === "countries" ? (
          countries.map((country, index) => {
            const rank = index + 1;
            const isRoyal = rank <= 3;
            const royalRank = rank === 1 ? 1 : rank === 2 ? 2 : 3;
            const isExpanded = expandedCountryId === country.id;

            // Canonical INR value for display
            const inrAmount =
              rank === 1
                ? 1000002000
                : rank === 2
                ? 1000001000
                : rank === 3
                ? 100000
                : rank === 4
                ? 17930
                : rank === 5
                ? 17030
                : country.currentPool * 85;

            const likes = likesMap[country.id] || (rank === 1 ? 42000350 : 40000340);
            const hasLiked = !!userLikes[country.id];

            return (
              <div key={country.id} className="space-y-1">
                {/* Main Country Ranking Row */}
                <article
                  className={`outrank-ranking-row flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl border transition-all duration-200 gap-3 min-h-[72px] ${
                    rank === 1
                      ? "border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.06)] bg-gradient-to-r from-amber-50/20 via-purple-50/10 to-[var(--surface)] dark:from-amber-950/15 dark:via-purple-950/10 dark:to-[var(--surface)]"
                      : "border-[var(--border)] bg-[var(--surface)] hover:shadow-sm"
                  }`}
                >
                  {/* Left: Rank + Official Flag + Country Info + Verified */}
                  <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
                    {/* Rank Badge */}
                    <div className="w-8 sm:w-9 shrink-0 flex items-center justify-center">
                      {isRoyal ? (
                        <RoyalRankBadge rank={royalRank} />
                      ) : (
                        <span className="text-sm font-bold text-[var(--text-secondary)]">#{rank}</span>
                      )}
                    </div>

                    {/* Official Country Flag */}
                    <div className="w-11 h-11 rounded-xl bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 flex items-center justify-center shrink-0 select-none shadow-xs p-1">
                      <CountryFlag code={country.code} name={country.name} size="lg" />
                    </div>

                    {/* Details: Name + Verified Checkmark + Description */}
                    <div className="min-w-0 flex-1 overflow-hidden">
                      <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden flex-nowrap">
                        <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate shrink-0 max-w-[140px] sm:max-w-[220px]">
                          {country.name}
                        </h2>
                        <VerifiedBadge size="sm" />
                        <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded-md shrink-0">
                          {country.code}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5 leading-normal">
                        Capital: {country.capital} • Region: {country.region} • {country.states.length} Subdivisions
                      </p>
                    </div>
                  </div>

                  {/* Right: Amount + Confirmed + Heart + View Button */}
                  <div className="flex items-center justify-end gap-2.5 sm:gap-4 shrink-0">
                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-extrabold text-[#7446d8] dark:text-[#c084fc] tracking-tight whitespace-nowrap">
                        {formatAmount(inrAmount)}
                      </div>
                      <div className="hidden sm:flex items-center justify-end gap-1 text-[10px] text-[var(--text-muted)] whitespace-nowrap">
                        <span>Confirmed</span>
                        <Info className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
                      </div>
                    </div>

                    {/* Like Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(country.id, e)}
                      aria-label={hasLiked ? "Unlike" : "Like"}
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

                    {/* View Button (Matches exact white pill from screenshot) */}
                    <button
                      type="button"
                      onClick={() => setExpandedCountryId(isExpanded ? null : country.id)}
                      className="shrink-0 inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-black border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span className="font-extrabold text-black">
                        {isExpanded ? "Close" : "View"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3 h-3 text-black stroke-[3]" />
                      ) : (
                        <ArrowRight className="w-3 h-3 text-black stroke-[3]" />
                      )}
                    </button>
                  </div>
                </article>

                {/* 3. EXPANDED STATES (Complete States of the Country with Official Flags) */}
                {isExpanded && (
                  <div className="pl-4 sm:pl-8 pr-1 py-1 space-y-1.5 border-l-2 border-purple-500/30 my-1 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] px-2 py-1">
                      <span>Complete Administrative States of {country.name}:</span>
                      <button
                        type="button"
                        onClick={() => handleOpenBidModal({ type: "country", country })}
                        className="text-[#7446d8] dark:text-[#c084fc] font-bold hover:underline"
                      >
                        + Bid on {country.name} Nation #1
                      </button>
                    </div>

                    {country.states.map((st, stIdx) => {
                      const stateRank = stIdx + 1;
                      const stateInr = st.currentBid * 85;

                      return (
                        <article
                          key={st.id}
                          className="outrank-ranking-row flex items-center justify-between px-3 sm:px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface)] transition-all gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                            <span className="text-xs font-mono font-bold text-[var(--text-secondary)] w-6 text-center">
                              #{stateRank}
                            </span>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate">
                                  {st.name}
                                </h3>
                                <VerifiedBadge size="sm" />
                                <span className="text-[9px] font-mono text-[var(--text-muted)] bg-[var(--surface)] px-1 py-0.2 rounded border border-[var(--border)]">
                                  {st.code}
                                </span>
                              </div>
                              <p className="text-[11px] text-[var(--text-secondary)] truncate">
                                Type: {st.type || "Subdivision"} • ISO: {st.id}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 shrink-0">
                            <div className="text-right">
                              <div className="text-xs sm:text-sm font-extrabold text-[#7446d8] dark:text-[#c084fc]">
                                {formatAmount(stateInr)}
                              </div>
                              <div className="text-[9px] text-[var(--text-muted)]">Confirmed</div>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleOpenBidModal({
                                  type: "state",
                                  country,
                                  state: st,
                                })
                              }
                              className="shrink-0 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-black bg-white hover:bg-slate-100 text-black border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                            >
                              <span className="font-extrabold text-black">Bid</span>
                              <ArrowRight className="w-3 h-3 text-black stroke-[3]" />
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // Flattened All States View
          allStates.map(({ state, country }, index) => {
            const rank = index + 1;
            const isRoyal = rank <= 3;
            const royalRank = rank === 1 ? 1 : rank === 2 ? 2 : 3;
            const inrAmount = state.currentBid * 85;

            return (
              <article
                key={state.id}
                className={`outrank-ranking-row flex items-center justify-between px-3.5 sm:px-4 py-3 rounded-2xl border transition-all duration-200 gap-3 min-h-[72px] ${
                  rank === 1
                    ? "border-amber-400/40 shadow-[0_0_20px_rgba(245,158,11,0.06)] bg-gradient-to-r from-amber-50/20 via-purple-50/10 to-[var(--surface)] dark:from-amber-950/15 dark:via-purple-950/10 dark:to-[var(--surface)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 overflow-hidden">
                  <div className="w-8 sm:w-9 shrink-0 flex items-center justify-center">
                    {isRoyal ? (
                      <RoyalRankBadge rank={royalRank} />
                    ) : (
                      <span className="text-sm font-bold text-[var(--text-secondary)]">#{rank}</span>
                    )}
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-2xl shrink-0 select-none">
                    {state.flag || country.flag}
                  </div>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate">
                        {state.name}
                      </h2>
                      <VerifiedBadge size="sm" />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded-md">
                        {country.code} - {state.code}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                      Type: {state.type || "Subdivision"} • Nation: {country.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 sm:gap-4 shrink-0">
                  <div className="text-right shrink-0">
                    <div className="text-sm sm:text-base font-extrabold text-[#7446d8] dark:text-[#c084fc] tracking-tight">
                      {formatAmount(inrAmount)}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Confirmed</div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleOpenBidModal({
                        type: "state",
                        country,
                        state,
                      })
                    }
                    className="shrink-0 inline-flex items-center justify-center gap-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-black border border-slate-300 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <span className="font-extrabold text-black">Bid</span>
                    <ArrowRight className="w-3 h-3 text-black stroke-[3]" />
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* 4. STREAMLINED BIDDING MODAL DRAWER */}
      {biddingTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--surface)] border border-purple-500/40 rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setBiddingTarget(null)}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#7446d8] dark:text-[#c084fc] text-xs font-mono font-bold uppercase tracking-wider">
              <Coins className="w-4 h-4" />
              <span>Territorial Bidding & Contribution</span>
            </div>

            <h3 className="text-lg font-black text-[var(--text-primary)] mt-2 flex items-center gap-2 flex-wrap">
              <span>
                Bid on{" "}
                <span className="text-[#7446d8] dark:text-[#c084fc]">
                  {biddingTarget.type === "state"
                    ? `${biddingTarget.state?.name}, ${biddingTarget.country.name}`
                    : biddingTarget.country.name}
                </span>
              </span>
              <CountryFlag code={biddingTarget.country.code} size="sm" />
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Outbid current leaders to crown your product or brand as the official #1 holder.
            </p>

            {modalSuccessMsg ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-mono flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{modalSuccessMsg}</span>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[var(--text-secondary)] font-semibold">Contribution Amount:</span>
                    <span className="text-[#7446d8] dark:text-[#c084fc] font-bold">
                      {formatAmount(modalBidAmount)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setModalBidAmount((prev) => Math.max(1000, prev - 10000))}
                      className="w-10 h-10 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <input
                      type="number"
                      value={modalBidAmount}
                      onChange={(e) => setModalBidAmount(Math.max(100, Number(e.target.value)))}
                      className="w-full py-2 px-3 text-center rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-sm font-bold font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />

                    <button
                      type="button"
                      onClick={() => setModalBidAmount((prev) => prev + 10000)}
                      className="w-10 h-10 rounded-xl bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-primary)] flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isSubmittingModal}
                  onClick={handleConfirmModalBid}
                  className="w-full mt-4 py-3 rounded-xl bg-[#7446d8] hover:bg-[#8b5cf6] disabled:opacity-50 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
                >
                  {isSubmittingModal ? (
                    <span>Confirming Bid...</span>
                  ) : (
                    <>
                      <span>Stake {formatAmount(modalBidAmount)} & Claim Rank #1</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
