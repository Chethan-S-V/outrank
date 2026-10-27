"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Globe,
  Search,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Eye,
  Filter,
} from "lucide-react";
import {
  GLOBAL_CURRENCY_RECORDS,
  type CurrencyGroup,
  type GlobalCurrencyRecord,
} from "@/lib/currency-registry";
import { setGlobalCurrency } from "@/lib/currency";

type AdminCurrencySimulatorProps = {
  liveRates: Record<string, number>;
};

export function AdminCurrencySimulator({ liveRates }: AdminCurrencySimulatorProps) {
  const [selectedGroup, setSelectedGroup] = useState<CurrencyGroup | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [testInrAmount, setTestInrAmount] = useState<number>(1000);
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>("USD");

  const groups: Array<CurrencyGroup | "All"> = [
    "All",
    "Asia & Middle East",
    "Europe",
    "Africa",
    "Americas",
    "Oceania & Pacific",
    "Special & Accounting",
  ];

  const allRecords = Object.values(GLOBAL_CURRENCY_RECORDS);

  const filteredRecords = allRecords.filter((rec) => {
    const matchesGroup = selectedGroup === "All" || rec.group === selectedGroup;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      rec.code.toLowerCase().includes(query) ||
      rec.name.toLowerCase().includes(query) ||
      rec.countryName.toLowerCase().includes(query);
    return matchesGroup && matchesSearch;
  });

  const activeRecord = GLOBAL_CURRENCY_RECORDS[selectedCurrencyCode] || GLOBAL_CURRENCY_RECORDS.USD;
  const activeRate = liveRates[selectedCurrencyCode] || activeRecord.baselineRateFromINR;
  const convertedValue = testInrAmount * activeRate;
  const formattedConverted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: activeRecord.decimals,
    maximumFractionDigits: activeRecord.decimals,
  }).format(convertedValue);

  const [simulatedNotice, setSimulatedNotice] = useState<string | null>(null);

  const SOVEREIGN_PRESETS = [
    { country: "United States", code: "USD", flag: "🇺🇸" },
    { country: "United Kingdom", code: "GBP", flag: "🇬🇧" },
    { country: "Germany / EU", code: "EUR", flag: "🇪🇺" },
    { country: "India", code: "INR", flag: "🇮🇳" },
    { country: "Japan", code: "JPY", flag: "🇯🇵" },
    { country: "United Arab Emirates", code: "AED", flag: "🇦🇪" },
    { country: "Saudi Arabia", code: "SAR", flag: "🇸🇦" },
    { country: "Brazil", code: "BRL", flag: "🇧🇷" },
    { country: "Australia", code: "AUD", flag: "🇦🇺" },
    { country: "Canada", code: "CAD", flag: "🇨🇦" },
    { country: "South Africa", code: "ZAR", flag: "🇿🇦" },
    { country: "Singapore", code: "SGD", flag: "🇸🇬" },
  ];

  function handleSimulateVisitorExperience(code: string, countryName?: string) {
    setGlobalCurrency(code);
    setSelectedCurrencyCode(code);
    const rec = GLOBAL_CURRENCY_RECORDS[code];
    setSimulatedNotice(`Now viewing as ${countryName || rec?.countryName || code} (${code})`);
    setTimeout(() => setSimulatedNotice(null), 4000);
  }

  function handleLaunchHome(code: string) {
    setGlobalCurrency(code);
    setSelectedCurrencyCode(code);
    window.open("/", "_blank");
  }

  return (
    <div className="space-y-6">
      {/* Interactive Global Currency Inspector Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] via-[#10131b] to-purple-950/20 border border-purple-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2 font-mono">
              <Globe className="w-3.5 h-3.5" />
              <span>International Sovereign Telemetry</span>
            </div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <span>Country Permission &amp; Home Interface Simulator</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Switch Outrank to view the exact live home interface, rankings, and currency as any citizen in the world.
            </p>
          </div>

          {/* Quick Apply to Client Experience */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleSimulateVisitorExperience(activeRecord.code)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600/40 hover:bg-purple-600/60 border border-purple-400/30 text-white font-bold text-xs active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Set Active Country ({activeRecord.code})</span>
            </button>
            <button
              type="button"
              onClick={() => handleLaunchHome(activeRecord.code)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7446d8] to-[#9333ea] text-white font-bold text-xs hover:brightness-110 active:scale-95 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
            >
              <span>Launch Sovereign Home Interface ({activeRecord.code})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick Country Switcher Bar */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-purple-400" />
              Quick Sovereign Switcher (Click to inspect or launch):
            </span>
            {simulatedNotice && (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full animate-pulse">
                ✓ {simulatedNotice}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SOVEREIGN_PRESETS.map((preset) => {
              const isSelected = selectedCurrencyCode === preset.code;
              return (
                <button
                  key={preset.code}
                  type="button"
                  onClick={() => handleSimulateVisitorExperience(preset.code, preset.country)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-400"
                      : "bg-[#141824] text-slate-300 hover:text-white hover:bg-white/10 border border-white/5"
                  }`}
                >
                  <span className="text-sm">{preset.flag}</span>
                  <span>{preset.country}</span>
                  <span className="font-mono text-[10px] opacity-75 font-bold">({preset.code})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Calculation Tester */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              1. Input Canonical Ranking Amount (INR ₹)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-400 font-mono">₹</span>
              <input
                type="number"
                min={1}
                value={testInrAmount}
                onChange={(e) => setTestInrAmount(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent border-0 font-mono text-xl font-black text-white focus:outline-none"
              />
            </div>
            <span className="text-[10px] text-slate-500 block">Authoritative canonical rank benchmark</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              2. Selected Target Region Currency
            </label>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeRecord.flag}</span>
              <div>
                <span className="text-lg font-black text-white font-mono block">
                  {activeRecord.code} ({activeRecord.symbol.trim()})
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {activeRecord.countryName} · {activeRecord.name}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 block font-mono">
              1 INR = {activeRate < 0.01 ? activeRate.toExponential(4) : activeRate.toFixed(6)} {activeRecord.code}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block">
              3. Live Visitor Display &amp; Checkout Output
            </label>
            <div className="text-2xl font-black text-purple-300 font-mono">
              {activeRecord.symbol}{formattedConverted}
            </div>
            <span className="text-[10px] text-purple-200 block font-medium">
              Minor units: {activeRecord.decimals} decimals · Status: {activeRecord.paymentSupported ? "Direct Checkout Available" : "Display Equivalent"}
            </span>
          </div>
        </div>

        {/* Region Group Filter Tabs & Search */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {groups.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => setSelectedGroup(group)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedGroup === group
                      ? "bg-[#38bdf8] text-slate-950 shadow-md"
                      : "bg-[#181d28] text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search country, currency..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#141721] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#38bdf8]"
              />
            </div>
          </div>
        </div>

        {/* Global Currency Live Inspection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {filteredRecords.map((rec) => {
            const isSelected = rec.code === selectedCurrencyCode;
            const rate = liveRates[rec.code] || rec.baselineRateFromINR;
            const displayPreview = new Intl.NumberFormat("en-US", {
              minimumFractionDigits: rec.decimals,
              maximumFractionDigits: rec.decimals,
            }).format(testInrAmount * rate);

            return (
              <div
                key={rec.code}
                onClick={() => handleSimulateVisitorExperience(rec.code)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? "bg-purple-950/50 border-purple-400 shadow-md ring-1 ring-purple-400/50"
                    : "bg-[#0f121a] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{rec.flag}</span>
                    <div>
                      <span className="font-mono font-black text-sm text-white block">
                        {rec.code}
                      </span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                        {rec.countryName}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                    {rec.symbol.trim()}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate-500">₹{testInrAmount.toLocaleString()} displays:</span>
                  <span className="font-mono font-bold text-xs text-purple-300">
                    {rec.symbol}{displayPreview}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
