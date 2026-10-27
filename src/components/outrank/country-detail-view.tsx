"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Coins,
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  Plus,
  Minus,
  X,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Crown,
  Lock,
} from "lucide-react";
import { VerifiedBadge } from "./verified-badge";
import { CountryFlag } from "./country-flag";
import { type WorldCountry, type WorldState } from "@/lib/data/world-countries";
import {
  useUserCurrency,
  CURRENCY_CONFIGS,
  formatCanonicalAmount,
  convertDisplayToCanonical,
} from "@/lib/currency";

type CountryDetailViewProps = {
  country: WorldCountry;
};

type PaymentTarget = {
  type: "country" | "state";
  name: string;
  code: string;
  flag: string;
  minBid: number;
};

export function CountryDetailView({ country }: CountryDetailViewProps) {
  const router = useRouter();
  const { setCurrency } = useUserCurrency();

  // Extract sovereign national currency for this country (e.g. "DZD (د.ج)" -> "DZD")
  const countryCurrencyCode = useMemo(() => {
    const raw = (country.currency || "").trim();
    const match = raw.match(/^([A-Z]{3})/);
    return match ? match[1] : country.code === "IN" ? "INR" : "USD";
  }, [country.currency, country.code]);

  const countryCurrency = useMemo(() => {
    const raw = (country.currency || "").trim();
    const match = raw.match(/^([A-Z]{3})\s*(?:\((.*?)\))?/);
    const parsedSymbol = match && match[2] ? match[2] : "";
    const cfg = CURRENCY_CONFIGS[countryCurrencyCode];
    return {
      code: countryCurrencyCode,
      symbol: parsedSymbol || (cfg ? cfg.symbol : `${countryCurrencyCode} `),
      name: cfg ? cfg.name : `${country.name} Currency`,
    };
  }, [country.currency, country.name, countryCurrencyCode]);

  // Format any canonical amount into this specific country's local currency
  const formatLocalAmount = (inr: number | string) => {
    return formatCanonicalAmount(inr, countryCurrencyCode);
  };

  // Payment Drawer / Section State
  const [paymentTarget, setPaymentTarget] = useState<PaymentTarget | null>(null);
  const [contributeAmount, setContributeAmount] = useState<number>(1000);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [localContributions, setLocalContributions] = useState<Record<string, number>>({});

  useEffect(() => {
    // Optionally synchronize user currency with country view
    try {
      if (countryCurrencyCode && CURRENCY_CONFIGS[countryCurrencyCode]) {
        setCurrency(countryCurrencyCode);
      }
    } catch {}
  }, [countryCurrencyCode, setCurrency]);

  useEffect(() => {
    function loadSavedContributions() {
      try {
        const raw = localStorage.getItem("outrank_territory_contributions");
        if (raw) {
          setLocalContributions(JSON.parse(raw));
        }
      } catch {}
    }
    loadSavedContributions();
    window.addEventListener("storage", loadSavedContributions);
    return () => window.removeEventListener("storage", loadSavedContributions);
  }, []);

  const countryPool =
    country.currentPool +
    (localContributions[country.name] || localContributions[country.code] || 0);

  const sortedStates = useMemo(() => {
    return [...country.states].sort((a, b) => {
      const aBonus =
        localContributions[`${a.name}, ${country.name}`] ||
        localContributions[a.name] ||
        0;
      const bBonus =
        localContributions[`${b.name}, ${country.name}`] ||
        localContributions[b.name] ||
        0;
      const aBid = a.currentBid + aBonus;
      const bBid = b.currentBid + bBonus;
      return bBid - aBid;
    });
  }, [country.states, country.name, localContributions]);

  function handleOpenPayment(target: PaymentTarget) {
    setPaymentTarget(target);
    const initialAmt = countryCurrencyCode === "INR" ? 1000 : 25;
    setContributeAmount(initialAmt);
    setPaymentCompleted(false);
  }

  function handleDirectContribute() {
    if (!paymentTarget) return;
    setIsProcessing(true);

    const canonicalINR = convertDisplayToCanonical(contributeAmount, countryCurrencyCode);

    setTimeout(() => {
      try {
        const raw = localStorage.getItem("outrank_territory_contributions") || "{}";
        const parsed = JSON.parse(raw);
        const key = paymentTarget.name;
        parsed[key] = (parsed[key] || 0) + canonicalINR;
        // Also credit country pool
        parsed[country.name] = (parsed[country.name] || 0) + canonicalINR;
        parsed[country.code] = (parsed[country.code] || 0) + canonicalINR;
        localStorage.setItem("outrank_territory_contributions", JSON.stringify(parsed));
        setLocalContributions(parsed);
        window.dispatchEvent(new Event("storage"));
      } catch {}

      setIsProcessing(false);
      setPaymentCompleted(true);

      setTimeout(() => {
        setPaymentTarget(null);
        setPaymentCompleted(false);
      }, 1600);
    }, 600);
  }

  function handleProceedToPaymentGateway() {
    if (!paymentTarget) return;
    const canonicalINR = convertDisplayToCanonical(contributeAmount, countryCurrencyCode);
    const query = new URLSearchParams({
      amount: String(contributeAmount),
      currency: countryCurrencyCode,
      canonicalAmountINR: String(canonicalINR),
      targetType: paymentTarget.type,
      targetName: paymentTarget.name,
      targetCode: paymentTarget.code,
      countryCode: country.code,
      returnUrl: `/global/${country.code.toLowerCase()}`,
      description: `Contribution for ${paymentTarget.name} #1 Rank`,
    });
    router.push(`/payment/razorpay?${query.toString()}`);
  }

  return (
    <main className="outrank-main w-full space-y-6">
      {/* 1. Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
        <Link
          href="/global"
          className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Global Sovereign Nations</span>
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-bold">{country.name}</span>
      </div>

      {/* 2. Country Hero & About Card */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="shrink-0 p-1.5 rounded-2xl bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 shadow-md">
              <CountryFlag code={country.code} name={country.name} size="2xl" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                  {country.name}
                </h1>
                <VerifiedBadge size="md" />
                <span className="text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--surface-raised)] px-2 py-0.5 rounded-lg border border-[var(--border)]">
                  {country.code}
                </span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-xs font-mono text-[var(--text-secondary)] flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  Capital: <strong className="text-[var(--text-primary)]">{country.capital}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Region: <strong className="text-[var(--text-primary)]">{country.region}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Primary Contribute Button on Country */}
          <button
            type="button"
            onClick={() =>
              handleOpenPayment({
                type: "country",
                name: country.name,
                code: country.code,
                flag: country.flag,
                minBid: country.currentPool,
              })
            }
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 active:scale-95 text-white font-bold text-sm font-mono shadow-lg shadow-purple-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Coins className="w-4 h-4" />
            <span>Contribute on {country.name} #1</span>
          </button>
        </div>

        {/* Country Metrics Row (Starts from 0) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
              Contribution Amount
            </span>
            <strong className="text-base sm:text-lg font-black text-[#7446d8] dark:text-[#c084fc] font-mono">
              {formatLocalAmount(countryPool)}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
              Subdivisions
            </span>
            <strong className="text-xs sm:text-sm font-bold text-[var(--text-primary)] truncate block">
              {country.states.length} Divisions
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
              Population
            </span>
            <strong className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              {country.population}
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
              Currency
            </span>
            <strong className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
              {country.currency}
            </strong>
          </div>
        </div>

        {/* About the Country Section */}
        <div className="pt-2 border-t border-[var(--border)]">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-[#7446d8]" />
            <span>About {country.name}</span>
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {country.about}
          </p>
        </div>
      </section>

      {/* 3. States of the Country Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] tracking-tight flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#7446d8]" />
              <span>Administrative States & Territories in {country.name}</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              All complete administrative subdivisions. Click contribute to claim state rank dominance.
            </p>
          </div>

          <span className="text-xs font-mono font-bold text-[var(--text-muted)] bg-[var(--surface)] px-2.5 py-1 rounded-xl border border-[var(--border)]">
            {country.states.length} States
          </span>
        </div>

        {/* States List — Sorted dynamically with user contributions */}
        <div className="space-y-2">
          {sortedStates.map((st, idx) => {
            const stateRank = idx + 1;
            const stateBonus =
              localContributions[`${st.name}, ${country.name}`] ||
              localContributions[st.name] ||
              0;
            const stateBid = st.currentBid + stateBonus;
            const hasBonus = stateBonus > 0;

            return (
              <article
                key={st.id}
                className={`outrank-ranking-row flex items-center justify-between px-4 py-3 rounded-2xl border transition-all gap-3 ${
                  hasBonus && stateRank === 1
                    ? "border-amber-400/50 bg-gradient-to-r from-amber-50/20 via-purple-50/10 to-[var(--surface)] dark:from-amber-950/20 dark:via-purple-950/10 dark:to-[var(--surface)] shadow-md"
                    : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 overflow-hidden">
                  <span className="text-xs font-mono font-bold text-[var(--text-muted)] w-6 text-center shrink-0 flex items-center justify-center gap-1">
                    {hasBonus && stateRank === 1 ? (
                      <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    ) : (
                      `#${stateRank}`
                    )}
                  </span>

                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-[var(--text-primary)] truncate">
                        {st.name}
                      </h3>
                      <VerifiedBadge size="sm" />
                      <span className="text-[10px] font-mono text-[var(--text-muted)] bg-[var(--surface-raised)] px-1.5 py-0.2 rounded border border-[var(--border)]">
                        {st.code}
                      </span>
                      {hasBonus && (
                        <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                          Claimed #1
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                      Type: {st.type || "Subdivision"} • ISO: {st.id} • Min Bid: {formatLocalAmount(st.minBid || 100)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 shrink-0">
                  <div className="text-right shrink-0">
                    <div className="text-xs sm:text-sm font-extrabold text-[#7446d8] dark:text-[#c084fc] font-mono">
                      {formatLocalAmount(stateBid)}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">Contribution</div>
                  </div>

                  {/* Contribute Button on State */}
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenPayment({
                        type: "state",
                        name: `${st.name}, ${country.name}`,
                        code: `${country.code}-${st.code}`,
                        flag: country.flag,
                        minBid: stateBid,
                      })
                    }
                    className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold font-mono bg-[#7446d8] hover:bg-[#8b5cf6] text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Contribute</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Next Payments Section Modal Drawer */}
      {paymentTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[var(--surface)] border border-purple-500/40 rounded-3xl p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setPaymentTarget(null)}
              className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-[#7446d8] dark:text-[#c084fc] text-xs font-mono font-bold uppercase tracking-wider">
              <CreditCard className="w-4 h-4" />
              <span>Sovereign Territorial Payment</span>
            </div>

            <h3 className="text-lg font-black text-[var(--text-primary)] mt-2 flex items-center gap-2 flex-wrap">
              <span>
                Contribute on <span className="text-[#7446d8] dark:text-[#c084fc]">{paymentTarget.name}</span>
              </span>
              <CountryFlag code={country.code} name={paymentTarget.name} size="sm" />
            </h3>

            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Your contribution directly elevates {paymentTarget.name} to claim the #1 rank spot.
            </p>

            {paymentCompleted ? (
              <div className="my-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-3 animate-in zoom-in-95">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  Payment Confirmed! Successfully credited {formatLocalAmount(contributeAmount)} to {paymentTarget.name}. Rank #1 is now live!
                </span>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1">
                    <span className="text-[var(--text-secondary)] font-semibold">Contribution Amount:</span>
                    <span className="text-[#7446d8] dark:text-[#c084fc] font-bold">
                      {countryCurrency.symbol}{contributeAmount.toLocaleString()} {countryCurrency.code}
                    </span>
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-base font-bold font-mono text-[#7446d8] dark:text-[#c084fc] select-none">
                      {countryCurrency.symbol}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={1000000000000}
                      value={contributeAmount || ""}
                      onChange={(e) => {
                        const val = e.target.value === "" ? 0 : Number(e.target.value);
                        setContributeAmount(Math.max(1, Math.min(1000000000000, val)));
                      }}
                      className="w-full py-3 pl-8 pr-16 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-base font-bold font-mono text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-purple-500"
                      placeholder="Enter amount"
                    />
                    <span className="absolute right-3.5 text-xs font-bold font-mono text-[var(--text-muted)] select-none">
                      {countryCurrency.code}
                    </span>
                  </div>
                </div>

                {/* Official Razorpay Payment Gateway Button */}
                <button
                  type="button"
                  disabled={isProcessing || !contributeAmount || contributeAmount < 1}
                  onClick={handleProceedToPaymentGateway}
                  className="w-full mt-4 py-3.5 rounded-2xl bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 disabled:opacity-50 text-white text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-900/30"
                >
                  <Lock className="w-4 h-4" />
                  <span>Pay with Razorpay ({countryCurrency.symbol}{contributeAmount.toLocaleString()} {countryCurrency.code})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
