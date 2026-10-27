"use client";

import { useState, useMemo } from "react";
import {
  Globe,
  Trophy,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { WORLD_COUNTRIES_CATALOG } from "@/lib/data/world-countries";
import { BidAmountControl } from "./bid-amount-control";
import { useRegionalCurrency, formatCanonicalAmount } from "@/lib/currency";

type CountryBiddingHeroProps = {
  onBiddingSubmitted?: (territoryName: string, amount: number, productUrl: string) => void;
};

const PRESET_AMOUNTS = [100, 500, 1000, 2500, 5000];

export function CountryBiddingHero({ onBiddingSubmitted }: CountryBiddingHeroProps) {
  const [selectedTerritory, setSelectedTerritory] = useState<string>("IND"); // ID of country or state
  const [productUrl, setProductUrl] = useState("");
  const [bidAmount, setBidAmount] = useState<number>(500);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const { currency } = useRegionalCurrency();

  function formatDisplayAmount(usdVal: number) {
    if (currency === "USD") return `$${usdVal.toLocaleString()}`;
    return formatCanonicalAmount(usdVal * 85, currency);
  }

  // Quick territory options list
  const territoryOptions = useMemo(() => {
    const list: { id: string; label: string; flag: string; type: "Country" | "State" }[] = [];
    for (const c of WORLD_COUNTRIES_CATALOG) {
      list.push({ id: c.id, label: `${c.name} (Nation #1)`, flag: c.flag, type: "Country" });
      for (const s of c.states) {
        list.push({ id: s.id, label: `${s.name}, ${c.code} (State #1)`, flag: s.flag || c.flag, type: "State" });
      }
    }
    return list;
  }, []);

  const activeTerritoryObj = useMemo(() => {
    return territoryOptions.find((t) => t.id === selectedTerritory) || territoryOptions[0];
  }, [territoryOptions, selectedTerritory]);

  function handleClaimTerritory(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const label = activeTerritoryObj.label.split(" (")[0];
      setSuccessToast(`Successfully contributed ${formatDisplayAmount(bidAmount)} on ${label}! Rank #1 claimed.`);
      onBiddingSubmitted?.(label, bidAmount, label);
      setTimeout(() => {
        setSuccessToast(null);
        setProductUrl("");
      }, 3500);
    }, 700);
  }

  return (
    <section className="outrank-claim-hero bg-[#12151c] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Top Eyebrow Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <Globe className="w-3.5 h-3.5" />
            <span>Sovereign Territorial Bidding</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Claim National & Provincial #1 Dominance</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            Claim #1 Global Territory — Bid on any Country or State
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Contribute to claim territorial rank dominance. Claim the authoritative #1 rank of any nation or state worldwide.
          </p>
        </div>

        {/* Claim Form */}
        <form onSubmit={handleClaimTerritory} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
            {/* Territory Selector */}
            <div className="md:col-span-8 relative">
              <label className="block text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>Target Nation or State:</span>
              </label>
              <div className="relative">
                <select
                  value={selectedTerritory}
                  onChange={(e) => setSelectedTerritory(e.target.value)}
                  className="w-full appearance-none px-3.5 py-3 rounded-2xl bg-[#191d27] border border-white/10 hover:border-emerald-500/40 text-xs sm:text-sm font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer pr-9"
                >
                  {territoryOptions.map((opt) => (
                    <option key={opt.id} value={opt.id} className="bg-[#12151c] text-white py-1">
                      {opt.flag} {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="md:col-span-4 flex flex-col justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold font-mono transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Contributing...</span>
                ) : (
                  <>
                    <span>Contribute on {activeTerritoryObj.label.split(" (")[0]} #1</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Amount Adjuster and Preset Chips */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">Bid Stake:</span>
              <BidAmountControl
                amount={bidAmount}
                onChange={(val) => setBidAmount(val)}
                min={10}
              />
            </div>

            {/* Preset Amount Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
              {PRESET_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setBidAmount(amt)}
                  className={`px-2.5 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                    bidAmount === amt
                      ? "bg-emerald-600 text-white"
                      : "bg-[#191d27] text-zinc-400 hover:text-white border border-white/5"
                  }`}
                >
                  +{formatDisplayAmount(amt)}
                </button>
              ))}
            </div>
          </div>

          {/* Success Notification */}
          {successToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
