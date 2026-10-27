"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  Eye,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  MapPin,
  ExternalLink,
  Laptop,
  Coins,
  ShieldCheck,
  Check,
  ChevronRight,
  X,
  Compass,
} from "lucide-react";
import { WORLD_COUNTRIES_CATALOG, type WorldCountry } from "@/lib/data/world-countries";
import { CountryFlag } from "@/components/outrank/country-flag";
import {
  CURRENCY_CONFIGS,
  FALLBACK_INR_RATES,
  type SupportedCurrency,
  useUserCurrency,
} from "@/lib/currency";
import { GLOBAL_CURRENCY_RECORDS } from "@/lib/currency-registry";

export function AdminGlobalUserSimulator() {
  const { setCurrency, currency: platformCurrency } = useUserCurrency();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [previewCountry, setPreviewCountry] = useState<WorldCountry | null>(null);
  const [compareAmountINR, setCompareAmountINR] = useState<number>(10000);

  // Filter countries
  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return WORLD_COUNTRIES_CATALOG.filter((c) => {
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.capital.toLowerCase().includes(q);
      const matchesRegion =
        selectedRegion === "all" || c.region.toLowerCase().includes(selectedRegion.toLowerCase());
      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  // Regions list
  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const c of WORLD_COUNTRIES_CATALOG) {
      if (c.region) set.add(c.region);
    }
    return Array.from(set).sort();
  }, []);

  // Map country to its actual sovereign national currency
  const getCurrencyForCountry = (country: WorldCountry) => {
    const raw = (country.currency || "").trim();
    // Parse e.g. "DZD (د.ج)" -> code: "DZD", symbol: "د.ج"
    const match = raw.match(/^([A-Z]{3})\s*(?:\((.*?)\))?/);
    const code = match ? match[1] : (country.code === "IN" ? "INR" : country.code === "US" ? "USD" : "USD");
    const parsedSymbol = (match && match[2]) ? match[2] : "";

    const rec = GLOBAL_CURRENCY_RECORDS[code];
    if (rec) {
      return {
        code: rec.code,
        name: rec.name,
        symbol: parsedSymbol || rec.symbol,
        flag: country.flag || rec.flag,
        decimals: rec.decimals,
        rateFromINR: rec.baselineRateFromINR || 1,
      };
    }

    const cfg = CURRENCY_CONFIGS[code];
    if (cfg) {
      return {
        code: cfg.code,
        name: cfg.name,
        symbol: parsedSymbol || cfg.symbol,
        flag: country.flag || cfg.flag,
        decimals: cfg.decimals,
        rateFromINR: FALLBACK_INR_RATES[code] || 1,
      };
    }

    return {
      code,
      name: `${country.name} Currency`,
      symbol: parsedSymbol || `${code} `,
      flag: country.flag,
      decimals: 2,
      rateFromINR: 1,
    };
  };

  const previewCurrency = previewCountry ? getCurrencyForCountry(previewCountry) : null;
  const previewRate = previewCurrency ? previewCurrency.rateFromINR : 1;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0e111a] to-purple-950/30 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-2 font-mono">
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>Global Sovereign Telemetry &middot; User Interface Simulator</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <span>Country Local Network UI &amp; Currency Inspection</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Inspect exactly how Outrank renders for users connected from different countries. Click <strong>&quot;View&quot;</strong> on any country to launch its simulated citizen dashboard, local pricing view, and multi-currency comparison matrix.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-right font-mono">
              <span className="text-[10px] text-slate-400 block uppercase">Catalog Scope</span>
              <strong className="text-sm font-bold text-white">197 Nations &middot; 4,022 States</strong>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country name, ISO code (IN, US, GB), capital, or currency..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500 font-mono cursor-pointer"
          >
            <option value="all">All Regions ({WORLD_COUNTRIES_CATALOG.length})</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCountries.slice(0, 60).map((country) => {
          const curr = getCurrencyForCountry(country);
          return (
            <div
              key={country.id}
              className="p-4 rounded-2xl bg-[#11141c] border border-white/5 hover:border-purple-500/40 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CountryFlag code={country.code} name={country.name} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors truncate">
                        {country.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-400">
                        {country.code} &middot; {country.capital}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-500/10 border border-purple-500/20 text-purple-300 shrink-0">
                    {curr.symbol} {curr.code}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1 border-t border-white/5">
                  <span>Region: <strong className="text-slate-300">{country.region}</strong></span>
                  <span>{country.states.length} Subdivisions</span>
                </div>
              </div>

              {/* View Button: Opens User Interface Dashboard Simulator */}
              <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Geo-Gateway
                </span>

                <button
                  type="button"
                  onClick={() => setPreviewCountry(country)}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-[11px] font-mono bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View User Dashboard</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCountries.length > 60 && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center text-xs font-mono text-slate-400">
          Showing 60 of {filteredCountries.length} countries. Use the search bar above to inspect any specific nation.
        </div>
      )}

      {/* MODAL: USER INTERFACE DASHBOARD SIMULATOR FOR SELECTED COUNTRY */}
      {previewCountry && previewCurrency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#0c0e15] border border-purple-500/40 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shrink-0">
                  <CountryFlag code={previewCountry.code} name={previewCountry.name} size="lg" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-white">
                      {previewCountry.name} ({previewCountry.code})
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
                      Simulating Local Citizen View
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Capital: {previewCountry.capital} &middot; Region: {previewCountry.region} &middot; Subdivisions: {previewCountry.states.length} States
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setPreviewCountry(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Citizen Connection Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Local Network Currency</span>
                <strong className="text-base font-extrabold text-purple-300 block">
                  {previewCurrency.flag} {previewCurrency.code} ({previewCurrency.symbol})
                </strong>
                <span className="text-[10px] text-slate-400">{previewCurrency.name}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Exchange Rate Telemetry</span>
                <strong className="text-base font-extrabold text-cyan-400 block">
                  1 {previewCurrency.code} ≈ ₹{(1 / previewRate).toFixed(2)} INR
                </strong>
                <span className="text-[10px] text-slate-400">Canonical Base Parity</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Citizen Gateway IP</span>
                <strong className="text-base font-extrabold text-emerald-400 block">
                  {previewCountry.code}.telecom.outrank
                </strong>
                <span className="text-[10px] text-slate-400">Zero-Latency Edge Node</span>
              </div>
            </div>

            {/* LIVE PREVIEW: How Users in this country see Outrank components */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5 text-purple-400" />
                  <span>How Citizen Users See Outrank In {previewCountry.name}</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-500">Live Mock Engine</span>
              </div>

              {/* Simulated Claim Hero for this Country */}
              <div className="p-5 rounded-2xl border border-purple-500/25 bg-gradient-to-r from-purple-950/20 via-[#0f121a] to-[#0a0c12] space-y-3">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                  Citizen Hero Claim Simulation
                </span>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xl font-black text-white">
                    Claim #1 for <span className="text-purple-400 font-mono">{previewCurrency.symbol}{Math.round(200 * previewRate).toLocaleString()}</span>
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Auto-localized to {previewCurrency.code}
                  </span>
                </div>
              </div>

              {/* Simulated Product Row as seen in this country */}
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#12151f] flex items-center justify-between gap-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-amber-400 font-bold">#1</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center font-bold text-white text-xs">
                    C
                  </div>
                  <div>
                    <strong className="text-white block">ChatGPT</strong>
                    <span className="text-[10px] text-slate-400">AI &amp; Agents</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-extrabold text-purple-300 block">
                    {previewCurrency.symbol}{(48200 * previewRate).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[9px] text-slate-500">Local Citizen View</span>
                </div>
              </div>
            </div>

            {/* MULTI-CURRENCY COMPARISON MATRIX */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Global Currency Value Comparison Matrix</span>
                </h4>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">Test Amount:</span>
                  <input
                    type="number"
                    value={compareAmountINR}
                    onChange={(e) => setCompareAmountINR(Number(e.target.value) || 0)}
                    className="w-24 px-2 py-1 rounded bg-black/50 border border-white/10 text-xs font-mono text-white text-right"
                  />
                  <span className="text-[10px] font-mono text-slate-400">INR</span>
                </div>
              </div>

              {/* Comparison Grid Across Key World Currencies */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                {/* 1. Country's Dedicated Sovereign Currency */}
                <div className="p-2.5 rounded-xl border bg-purple-950/40 border-purple-500 text-purple-200">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{previewCurrency.flag} {previewCurrency.code}</span>
                    <span className="text-[9px] text-purple-400 font-bold">This Nation</span>
                  </div>
                  <strong className="text-sm font-black text-white block">
                    {previewCurrency.symbol}{(compareAmountINR * previewRate).toLocaleString(undefined, { maximumFractionDigits: previewCurrency.decimals })}
                  </strong>
                </div>

                {/* Major Global Benchmarks */}
                {["USD", "EUR", "GBP", "INR", "JPY", "AED", "CAD"]
                  .filter((k) => k !== previewCurrency.code)
                  .map((currKey: string) => {
                    const c = CURRENCY_CONFIGS[currKey] || GLOBAL_CURRENCY_RECORDS[currKey];
                    if (!c) return null;
                    const cRate =
                      FALLBACK_INR_RATES[currKey] ||
                      GLOBAL_CURRENCY_RECORDS[currKey]?.baselineRateFromINR ||
                      1;
                    const converted = compareAmountINR * cRate;
                    return (
                      <div
                        key={currKey}
                        className="p-2.5 rounded-xl border bg-white/5 border-white/5 text-slate-300"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span>{c.flag} {c.code}</span>
                          <span className="text-[9px] text-slate-500">{c.name.slice(0, 12)}</span>
                        </div>
                        <strong className="text-sm font-black text-white block">
                          {c.symbol}{converted.toLocaleString(undefined, { maximumFractionDigits: c.decimals })}
                        </strong>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between flex-wrap gap-3">
              <div className="text-[11px] font-mono text-slate-400">
                Simulating network node for <strong>{previewCountry.name}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrency(previewCurrency.code);
                    window.open(`/global/${previewCountry.code.toLowerCase()}`, "_blank");
                  }}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  <span>Open Citizen View on Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
