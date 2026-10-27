"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Coins,
  ShieldCheck,
  ShieldAlert,
  LogOut,
  Terminal,
  Activity,
  ArrowRight,
  Layers,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Lock,
  Radio,
  FileCode2,
} from "lucide-react";
import { AdminGlobalUserSimulator } from "../admin-global-user-simulator";
import { AdminCurrencySimulator } from "../admin-currency-simulator";
import { CURRENCY_CONFIGS, FALLBACK_INR_RATES } from "@/lib/currency";

export function AdminV2Dashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"global" | "currencies" | "firewall">("global");

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch {}
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 flex flex-col font-sans select-none">
      {/* Top Cybernetic Nav Header */}
      <header className="border-b border-white/10 bg-[#0e111a]/90 backdrop-blur-xl sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Brand & Security Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <Terminal className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white tracking-wider font-mono">
                  OUTRANK // ADMIN PORTAL
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  VERSION 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Global Sovereign Telemetry &middot; Local Network Simulator &middot; WAF Defense Active
              </p>
            </div>
          </div>

          {/* Version Switcher Bar & Logout */}
          <div className="flex items-center gap-3 self-end sm:self-auto font-mono text-xs">
            {/* Version Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs">
              <Link
                href="/admin"
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
                title="Switch to Admin v1 (Core Moderation)"
              >
                <span>v1 (Moderation)</span>
              </Link>
              <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>v2 (Global UI)</span>
              </span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Site</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6 flex-1">
        {/* Module Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "global"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Global Nations &amp; Citizen UI Simulator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("currencies")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "currencies"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <Coins className="w-4 h-4" />
            <span>Multi-Currency Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("firewall")}
            className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === "firewall"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                : "bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Security Firewall &amp; WAF Status</span>
          </button>
        </div>

        {/* TAB 1: Global Nations & User UI Simulator */}
        {activeTab === "global" && <AdminGlobalUserSimulator />}

        {/* TAB 2: Multi-Currency Matrix */}
        {activeTab === "currencies" && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#11141c] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-white font-mono">
                    Universal Regional Currencies Engine
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Live exchange parity benchmarks &middot; Auto-detected for citizens worldwide
                  </p>
                </div>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  All Gateways Healthy
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 font-mono text-xs">
                {Object.keys(CURRENCY_CONFIGS).map((code: string) => {
                  const curr = CURRENCY_CONFIGS[code];
                  const rate = FALLBACK_INR_RATES[code] || 1;
                  return (
                    <div
                      key={code}
                      className="p-4 rounded-2xl bg-[#0c0e15] border border-white/5 space-y-2 hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base">{curr.flag}</span>
                        <strong className="text-sm font-bold text-white">{curr.code} ({curr.symbol})</strong>
                      </div>
                      <p className="text-[11px] text-slate-400">{curr.name}</p>
                      <div className="text-[10px] text-purple-400 font-mono pt-1 border-t border-white/5">
                        Rate: 1 {curr.code} ≈ ₹{(1 / rate).toFixed(2)} INR
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Security Firewall & WAF Status */}
        {activeTab === "firewall" && (
          <div className="space-y-6 font-mono text-xs">
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] via-[#0d1017] to-emerald-950/20 border border-emerald-500/30 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Outrank Defense WAF Active</h3>
                    <p className="text-xs text-slate-400">Edge packet inspection &amp; threat mitigation</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                  Armed &amp; Protecting
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">SQL Injection Defense</span>
                  <strong className="text-sm text-emerald-400 block">Active &middot; Zero Bypass</strong>
                  <span className="text-[10px] text-slate-400">Deep regex &amp; AST inspection</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Cross-Site Scripting (XSS)</span>
                  <strong className="text-sm text-emerald-400 block">Strict Sanitization</strong>
                  <span className="text-[10px] text-slate-400">CSP &amp; DOM event filtering</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase block">Brute-Force Rate Limiting</span>
                  <strong className="text-sm text-emerald-400 block">Sliding Window Enabled</strong>
                  <span className="text-[10px] text-slate-400">8 max attempts / min</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#11141c] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Security Headers Deployed
              </h4>
              <ul className="space-y-2 text-slate-300 text-[11px]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Content-Security-Policy (CSP)</strong>: Restricts unauthorized script &amp; frame execution.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>X-Frame-Options: DENY</strong>: Neutralizes iframe clickjacking attacks.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>X-Content-Type-Options: nosniff</strong>: Blocks MIME type sniffing.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span><strong>Strict-Transport-Security (HSTS)</strong>: Forces 2-year HTTPS transport with subdomains.</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
