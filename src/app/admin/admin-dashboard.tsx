"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ExternalLink,
  LogOut,
  Clock,
  Globe,
  DollarSign,
  Layers,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Plus,
  Radio,
  Sparkles,
  ShieldAlert,
  Coins,
  Check,
  FileText,
  UserCheck,
  RefreshCw,
  TrendingUp,
  Tag,
  Building,
  Mail,
  Trash2,
  KeyRound,
} from "lucide-react";
import { AdminInvitationsTab } from "./admin-invitations-tab";
import { AdminCurrencySimulator } from "./admin-currency-simulator";
import { AdminTeamTab } from "./admin-team-tab";
import { AdminCountryBiddingTab } from "./admin-country-bidding-tab";
import { AdminGlobalUserSimulator } from "./admin-global-user-simulator";
import {
  CURRENCY_REGISTRY,
  CANONICAL_CURRENCY,
  type RatesSnapshot,
  type SupportedCurrency,
} from "@/services/currency/exchange-rate-service";

export type ProductRow = {
  id: string;
  name: string;
  slug: string;
  websiteUrl: string;
  categoryName: string;
  ownerEmail: string;
  makerName: string | null;
  twitterHandle: string | null;
  verificationStatus: string;
  moderationStatus: string;
  totalSupportAmount: string;
  supportCurrency: string;
  createdAt: Date;
};

export type EventRow = {
  id: string;
  productName: string | null;
  eventType: string;
  amount: string | null;
  createdAt: Date;
};

export type ContributionRow = {
  id: string;
  productName: string | null;
  amount: string;
  currency: string;
  canonicalAmount: string | null;
  canonicalCurrency: string | null;
  chargedAmount: string | null;
  chargedCurrency: string | null;
  exchangeRate: string | null;
  exchangeRateTimestamp: Date | null;
  status: string;
  contributorEmail: string | null;
  createdAt: Date;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  productCount: number;
};

interface AdminDashboardProps {
  products: ProductRow[];
  events: EventRow[];
  contributions: ContributionRow[];
  categories: CategoryRow[];
  ratesTelemetry: RatesSnapshot;
}

export function AdminDashboard({
  products: initialProducts,
  events,
  contributions: initialContributions,
  categories: initialCategories,
  ratesTelemetry: initialRates,
}: AdminDashboardProps) {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "products" | "bin" | "countries" | "invitations" | "categories" | "financials" | "rates" | "admins" | "users" | "security"
  >("overview");

  // Products state
  const [products, setProducts] = useState<ProductRow[]>(initialProducts);
  const [productSearch, setProductSearch] = useState("");
  const [productFilter, setProductFilter] = useState<
    "all" | "pending" | "approved" | "rejected" | "suspended"
  >("all");
  const [loadingProductId, setLoadingProductId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");

  // Categories state
  const [categoriesList, setCategoriesList] = useState<CategoryRow[]>(initialCategories);
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isCatSubmitting, setIsCatSubmitting] = useState(false);

  // Exchange rates telemetry state
  const [ratesData, setRatesData] = useState<RatesSnapshot>(initialRates);
  const [isRefreshingRates, setIsRefreshingRates] = useState(false);

  // Emergency Breakers
  const [isClaimFreezeActive, setIsClaimFreezeActive] = useState(false);
  const [isMaintenanceActive, setIsMaintenanceActive] = useState(false);

  // Executive Stats Calculation (All in Canonical INR)
  const pendingCount = products.filter(
    (p) => p.moderationStatus === "pending" || p.verificationStatus === "pending"
  ).length;
  const approvedCount = products.filter((p) => p.moderationStatus === "approved").length;
  const rejectedCount = products.filter(
    (p) => p.moderationStatus === "rejected"
  ).length;
  const suspendedCount = products.filter(
    (p) => p.moderationStatus === "suspended"
  ).length;

  const totalCanonicalINR = products.reduce(
    (acc, p) => acc + (parseFloat(p.totalSupportAmount) || 0),
    0
  );

  // Category-wise Supported Amount Breakdown
  const categorySupportBreakdown = categoriesList.map((cat) => {
    const catProducts = products.filter(
      (p) => p.categoryName.toLowerCase() === cat.name.toLowerCase() && p.moderationStatus === "approved"
    );
    const catTotalSupport = catProducts.reduce(
      (acc, p) => acc + (parseFloat(p.totalSupportAmount || "0") || 0),
      0
    );
    const percentOfPool = totalCanonicalINR > 0 ? (catTotalSupport / totalCanonicalINR) * 100 : 0;
    return {
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      productCount: catProducts.length,
      totalSupportINR: catTotalSupport,
      percentOfPool: percentOfPool.toFixed(1),
    };
  }).sort((a, b) => b.totalSupportINR - a.totalSupportINR);

  const totalUsdEquivalent = (totalCanonicalINR * (ratesData.rates.USD || 0.011696)).toFixed(2);
  const totalEurEquivalent = (totalCanonicalINR * (ratesData.rates.EUR || 0.010764)).toFixed(2);

  // Handle Logout
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // Handle Product Moderation
  async function handleModerate(
    id: string,
    verificationStatus: "verified" | "rejected",
    moderationStatus: "approved" | "rejected" | "suspended"
  ) {
    setLoadingProductId(id);
    setStatusMessage("");

    try {
      const res = await fetch(`/api/admin/products/${id}/moderation`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verificationStatus,
          moderationStatus,
          reason: `Admin manual action: ${moderationStatus}`,
        }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, verificationStatus, moderationStatus } : p
          )
        );
        setStatusMessage(`Product updated to ${moderationStatus}.`);
      } else {
        const err = await res.json();
        setStatusMessage(`Error: ${err.error || "Update failed."}`);
      }
    } catch {
      setStatusMessage("Network error during moderation.");
    } finally {
      setLoadingProductId(null);
    }
  }

  // Handle Category Creation
  async function handleCreateCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setIsCatSubmitting(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCategoriesList((prev) => [
          ...prev,
          {
            id: data.category.id,
            name: data.category.name,
            slug: data.category.slug,
            description: data.category.description,
            isActive: data.category.isActive,
            productCount: 0,
          },
        ]);
        setIsAddCatOpen(false);
        setNewCatName("");
        setNewCatDesc("");
        setStatusMessage(`Category '${data.category.name}' created successfully.`);
      } else {
        const err = await res.json();
        setStatusMessage(`Error: ${err.error || "Failed to create category."}`);
      }
    } catch {
      setStatusMessage("Network error creating category.");
    } finally {
      setIsCatSubmitting(false);
    }
  }

  // Handle Category Toggle Active
  async function handleToggleCategory(id: string, currentActive: boolean) {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentActive }),
      });

      if (res.ok) {
        setCategoriesList((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentActive } : c))
        );
        setStatusMessage(`Category status toggled to ${!currentActive ? "Active" : "Inactive"}.`);
      }
    } catch {
      setStatusMessage("Failed to toggle category status.");
    }
  }

  // Handle Manual Force Refresh of Exchange Rates
  async function handleRefreshExchangeRates() {
    setIsRefreshingRates(true);
    setStatusMessage("Fetching live exchange rates from central bank feeds...");

    try {
      const res = await fetch("/api/public/exchange-rates", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setRatesData((prev) => ({
          ...prev,
          rates: data.rates,
          timestamp: data.timestamp,
          source: data.source,
          providerStatus: data.providerStatus,
        }));
        setStatusMessage("Live exchange rates successfully synchronized!");
      } else {
        setStatusMessage("Failed to synchronize exchange rates.");
      }
    } catch {
      setStatusMessage("Network error refreshing rates.");
    } finally {
      setIsRefreshingRates(false);
    }
  }

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.ownerEmail.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.makerName && p.makerName.toLowerCase().includes(productSearch.toLowerCase()));

    if (!matchesSearch) return false;
    if (productFilter === "pending") {
      return p.moderationStatus === "pending" || p.verificationStatus === "pending";
    }
    if (productFilter === "approved") return p.moderationStatus === "approved";
    if (productFilter === "rejected") return p.moderationStatus === "rejected";
    if (productFilter === "suspended") return p.moderationStatus === "suspended";
    return true;
  });

  // Unique Makers / Users
  const makersMap = new Map<string, { email: string; name: string; count: number; twitter: string; support: number }>();
  for (const p of products) {
    const key = p.ownerEmail.toLowerCase();
    const existing = makersMap.get(key);
    const pSupport = parseFloat(p.totalSupportAmount || "0");
    if (existing) {
      existing.count += 1;
      existing.support += pSupport;
      if (!existing.name && p.makerName) existing.name = p.makerName;
      if (!existing.twitter && p.twitterHandle) existing.twitter = p.twitterHandle;
    } else {
      makersMap.set(key, {
        email: p.ownerEmail,
        name: p.makerName || p.name,
        count: 1,
        twitter: p.twitterHandle || "—",
        support: pSupport,
      });
    }
  }
  const makersList = Array.from(makersMap.values());

  return (
    <div className="min-h-screen bg-[#0b0d11] text-slate-100 flex flex-col font-sans pb-16">
      {/* ========================================================= */}
      {/* COMMAND STATION HEADER */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-[#12151d]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500/20 to-purple-500/20 border border-[#38bdf8]/40 flex items-center justify-center text-[#38bdf8] shadow-md shadow-sky-500/10">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-white tracking-tight">
                Outrank Master Command Station
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CANONICAL INR ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Base: <span className="text-[#38bdf8] font-bold">INR (₹)</span> · Multi-Currency Production Gateway
            </p>
          </div>
        </div>

        {/* Global Action Bar */}
        <div className="flex items-center gap-3">
          {/* Version Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
            <span className="px-3 py-1.5 rounded-lg bg-purple-600 text-white font-bold flex items-center gap-1.5 shadow-sm">
              <span>v1 (Moderation)</span>
            </span>
            <Link
              href="/admin/v2"
              className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white transition-all flex items-center gap-1.5"
              title="Switch to Admin v2 (Global UI Simulator)"
            >
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span>v2 (Global UI)</span>
            </Link>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-400 font-medium transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Status banner */}
      {statusMessage && (
        <div className="bg-[#38bdf8]/10 border-b border-[#38bdf8]/30 px-6 py-2.5 text-xs text-[#38bdf8] font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{statusMessage}</span>
          </div>
          <button
            onClick={() => setStatusMessage("")}
            className="text-slate-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* NAVIGATION TABS */}
      {/* ========================================================= */}
      <div className="bg-[#101218] border-b border-white/5 px-4 sm:px-8">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Layers },
            { id: "products", label: `Products (${products.filter((p) => p.moderationStatus !== "suspended").length})`, icon: ShieldCheck },
            { id: "bin", label: `Recycle Bin (${suspendedCount})`, icon: Trash2 },
            { id: "countries", label: "Country Bidding", icon: Globe },
            { id: "invitations", label: "Outreach & Invites", icon: Mail },
            { id: "categories", label: `Categories (${categoriesList.length})`, icon: Tag },
            { id: "financials", label: `Ledger (${initialContributions.length})`, icon: DollarSign },
            { id: "rates", label: "Exchange Rates", icon: Coins },
            { id: "admins", label: "Admin Credentials", icon: KeyRound },
            { id: "users", label: `Makers (${makersList.length})`, icon: UserCheck },
            { id: "security", label: "Security & Audits", icon: ShieldAlert },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#38bdf8] text-slate-950 shadow-md shadow-sky-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.id === "products" && pendingCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                ) : null}
                {tab.id === "bin" && suspendedCount > 0 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* ===================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* ===================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stat 1: Total Canonical Volume */}
              <div className="p-5 rounded-3xl bg-[#14171f] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                  <span>CANONICAL BACKING</span>
                  <Coins className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  ₹{Math.round(totalCanonicalINR).toLocaleString("en-IN")} INR
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  ≈ ${parseFloat(totalUsdEquivalent).toLocaleString()} USD · €{parseFloat(totalEurEquivalent).toLocaleString()} EUR
                </div>
              </div>

              {/* Stat 2: Products Count */}
              <div className="p-5 rounded-3xl bg-[#14171f] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                  <span>TOTAL PRODUCTS</span>
                  <ShieldCheck className="w-4 h-4 text-[#38bdf8]" />
                </div>
                <div className="text-2xl font-black text-white font-mono">
                  {products.length}
                </div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  {approvedCount} active &amp; approved
                </div>
              </div>

              {/* Stat 3: Pending Moderation */}
              <div className="p-5 rounded-3xl bg-[#14171f] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                  <span>PENDING MODERATION</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono">
                  {pendingCount}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  {rejectedCount} rejected / suspended
                </div>
              </div>

              {/* Stat 4: FX Provider Status */}
              <div className="p-5 rounded-3xl bg-[#14171f] border border-white/10 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
                  <span>FX FEED STATUS</span>
                  <Globe className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-xl font-black text-emerald-400 font-mono uppercase flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  {ratesData.providerStatus}
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Base: 1 INR = ${(ratesData.rates.USD || 0.011696).toFixed(5)} USD
                </div>
              </div>
            </div>

            {/* Quick Action Station */}
            <div className="p-6 rounded-3xl bg-[#14171f] border border-white/10 space-y-4 shadow-xl">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#38bdf8]" />
                <span>Executive Command Shortcuts</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setProductFilter("pending");
                  }}
                  className="p-4 rounded-2xl bg-[#191d26] hover:bg-[#202532] border border-white/5 text-left transition-colors group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] flex items-center gap-1.5">
                    Moderate Pending ({pendingCount})
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Review and approve submitted entities for public ranking.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("categories")}
                  className="p-4 rounded-2xl bg-[#191d26] hover:bg-[#202532] border border-white/5 text-left transition-colors group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] flex items-center gap-1.5">
                    Manage Categories ({categoriesList.length})
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Add categories, edit slugs, and organize directory structure.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab("rates")}
                  className="p-4 rounded-2xl bg-[#191d26] hover:bg-[#202532] border border-white/5 text-left transition-colors group"
                >
                  <span className="text-xs font-bold text-white group-hover:text-[#38bdf8] flex items-center gap-1.5">
                    Currency &amp; FX Monitor
                  </span>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Inspect live exchange rates and trigger manual rate refresh.
                  </p>
                </button>
              </div>
            </div>

            {/* Category-Wise Supported Amount Breakdown */}
            <div className="p-6 rounded-3xl bg-[#14171f] border border-white/10 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-4">
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-400" />
                    <span>Category-Wise Supported Capital Breakdown</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live distribution of confirmed platform backing and capital pool across all sovereign categories.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-xl self-start sm:self-auto">
                  {categoriesList.length} Categories Tracked
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 text-[10px] uppercase border-b border-white/5">
                    <tr>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Approved Products</th>
                      <th className="py-3 px-4">Total Supported Amount (INR)</th>
                      <th className="py-3 px-4">Foreign Equiv (USD)</th>
                      <th className="py-3 px-4 text-right">Pool Share (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categorySupportBreakdown.map((cat) => {
                      const usdEquiv = (cat.totalSupportINR * (ratesData.rates.USD || 0.011696)).toFixed(0);
                      return (
                        <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-bold text-white font-sans">
                            {cat.name}
                          </td>
                          <td className="py-3 px-4 text-slate-300">
                            {cat.productCount} {cat.productCount === 1 ? "product" : "products"}
                          </td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            ₹{Math.round(cat.totalSupportINR).toLocaleString("en-IN")} INR
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            ≈ ${parseInt(usdEquiv, 10).toLocaleString()} USD
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                              {cat.percentOfPool}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 2: PRODUCT MANAGEMENT & MODERATION */}
        {/* ===================================================== */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#38bdf8]" />
                  <span>Product &amp; Creator Management</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify authenticity, inspect website URLs, approve rank claims, and audit backing.
                </p>
              </div>

              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search product, maker, email..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#191d26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>

                <div className="flex items-center gap-1 p-1 rounded-xl bg-[#191d26] border border-white/10 text-xs">
                  {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setProductFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg font-bold capitalize transition-all ${
                        productFilter === filter
                          ? "bg-[#38bdf8] text-slate-950 shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#101218] text-slate-400 font-mono uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Website / Profile</th>
                      <th className="py-3 px-4">Owner / Maker</th>
                      <th className="py-3 px-4">Canonical Support (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono">
                    {filteredProducts.map((p) => {
                      const isLoading = loadingProductId === p.id;
                      const inrVal = parseFloat(p.totalSupportAmount || "0");
                      const usdEquiv = (inrVal * (ratesData.rates.USD || 0.011696)).toFixed(2);

                      return (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white">
                            <div className="flex items-center gap-2">
                              <span>{p.name}</span>
                              {p.verificationStatus === "verified" ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                              ) : null}
                            </div>
                            <span className="text-[10px] text-slate-500 font-normal">
                              /{p.slug}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">{p.categoryName}</td>
                          <td className="py-3.5 px-4">
                            <a
                              href={p.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#38bdf8] hover:underline flex items-center gap-1 max-w-[180px] truncate"
                            >
                              <span className="truncate">{p.websiteUrl}</span>
                              <ExternalLink className="w-3 h-3 shrink-0 opacity-70" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            <div>{p.ownerEmail}</div>
                            {p.twitterHandle && (
                              <span className="text-[10px] text-sky-400">{p.twitterHandle}</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">
                            <div>₹{Math.round(inrVal).toLocaleString("en-IN")} INR</div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              ≈ ${parseFloat(usdEquiv).toLocaleString()} USD
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                p.moderationStatus === "approved"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                  : p.moderationStatus === "pending"
                                  ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              }`}
                            >
                              {p.moderationStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 font-sans">
                              {p.moderationStatus !== "approved" && (
                                <button
                                  onClick={() => handleModerate(p.id, "verified", "approved")}
                                  disabled={isLoading}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold"
                                >
                                  Approve
                                </button>
                              )}

                              {p.moderationStatus !== "rejected" && (
                                <button
                                  onClick={() => handleModerate(p.id, "rejected", "rejected")}
                                  disabled={isLoading}
                                  className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-bold"
                                >
                                  Reject
                                </button>
                              )}

                              {p.moderationStatus !== "suspended" && (
                                <button
                                  onClick={() => handleModerate(p.id, "rejected", "suspended")}
                                  disabled={isLoading}
                                  className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold"
                                >
                                  Suspend
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB: RECYCLE BIN (SUSPENDED ENTITIES QUARANTINE) */}
        {/* ===================================================== */}
        {activeTab === "bin" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-amber-400" />
                  <span>Recycle Bin (Suspended Products)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Suspended products are quarantined from public ranking. You can restore and approve them back to the active leaderboard at any time.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 font-mono">
                <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
                <span>🛡️ Sovereign Data Protocol: Permanent deletion is permanently restricted. All records are safely preserved in the bin.</span>
              </div>
            </div>

            {/* Suspended Products Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Entity</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Owner / Contact</th>
                      <th className="py-3 px-4">Canonical Support</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.filter((p) => p.moderationStatus === "suspended").length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-slate-400 font-sans">
                          <Trash2 className="w-10 h-10 text-slate-600 mx-auto mb-2 opacity-50" />
                          <p className="font-bold text-white text-base">Recycle Bin is empty.</p>
                          <p className="text-xs text-slate-500 mt-0.5">No products currently suspended or quarantined.</p>
                        </td>
                      </tr>
                    ) : (
                      products
                        .filter((p) => p.moderationStatus === "suspended")
                        .map((p) => {
                          const isLoading = loadingProductId === p.id;
                          return (
                            <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3.5 px-4 font-bold text-white font-sans">
                                <div className="text-sm">{p.name}</div>
                                <span className="text-[10px] text-slate-500 font-mono font-normal">/{p.slug}</span>
                              </td>
                              <td className="py-3.5 px-4 text-slate-300 font-sans">{p.categoryName}</td>
                              <td className="py-3.5 px-4 text-slate-400">{p.ownerEmail}</td>
                              <td className="py-3.5 px-4 text-emerald-400 font-bold">
                                ₹{Math.round(parseFloat(p.totalSupportAmount || "0")).toLocaleString("en-IN")} INR
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  Suspended
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => handleModerate(p.id, "verified", "approved")}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
                                >
                                  Approve &amp; Restore
                                </button>
                              </td>
                            </tr>
                          );
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB: COUNTRY SOVEREIGN BIDDING & GLOBAL CITIZEN UI */}
        {/* ===================================================== */}
        {activeTab === "countries" && (
          <AdminGlobalUserSimulator />
        )}

        {/* ===================================================== */}
        {/* TAB: OUTREACH & INVITATIONS */}
        {/* ===================================================== */}
        {activeTab === "invitations" && <AdminInvitationsTab />}

        {/* ===================================================== */}
        {/* TAB: ADMINISTRATOR CREDENTIALS PORTAL */}
        {/* ===================================================== */}
        {activeTab === "admins" && <AdminTeamTab />}

        {/* ===================================================== */}
        {/* TAB 3: CATEGORY MANAGEMENT */}
        {/* ===================================================== */}
        {activeTab === "categories" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Tag className="w-5 h-5 text-[#38bdf8]" />
                  <span>Category Directory &amp; Taxonomy</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage categories, add new taxonomies, and view live product allocations.
                </p>
              </div>

              <button
                onClick={() => setIsAddCatOpen(!isAddCatOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#38bdf8] text-slate-950 font-bold text-xs hover:brightness-110 shadow-md"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Add Category Modal / Form */}
            {isAddCatOpen && (
              <form
                onSubmit={handleCreateCategory}
                className="p-5 rounded-2xl bg-[#14171f] border border-[#38bdf8]/40 space-y-4 shadow-xl"
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Register New Taxonomy Category
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Category Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Developer Tools"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#191d26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="e.g. Developer IDEs, CLI tools, and libraries"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#191d26] border border-white/10 text-xs text-white focus:outline-none focus:border-[#38bdf8]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddCatOpen(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCatSubmitting}
                    className="px-4 py-1.5 rounded-xl bg-[#38bdf8] text-slate-950 text-xs font-bold"
                  >
                    {isCatSubmitting ? "Creating..." : "Save Category"}
                  </button>
                </div>
              </form>
            )}

            {/* Categories Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Slug</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Products</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Toggle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {categoriesList.map((cat) => (
                      <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{cat.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{cat.slug}</td>
                        <td className="py-3.5 px-4 text-slate-400 truncate max-w-[200px]">
                          {cat.description || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-[#38bdf8] font-bold">
                          {cat.productCount} products
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              cat.isActive
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                                : "bg-slate-700/20 text-slate-500 border border-slate-700/30"
                            }`}
                          >
                            {cat.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans">
                          <button
                            onClick={() => handleToggleCategory(cat.id, cat.isActive)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                              cat.isActive
                                ? "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30"
                                : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30"
                            }`}
                          >
                            {cat.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 4: MULTI-CURRENCY FINANCIAL LEDGER */}
        {/* ===================================================== */}
        {activeTab === "financials" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Authoritative Multi-Currency Financial Ledger</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Transactions with locked exchange rates and canonical INR rank reconciliation.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-[#14171f] border border-white/10 text-xs font-mono">
                <span className="text-slate-400">Total Canonical Volume: </span>
                <span className="text-emerald-400 font-bold">
                  ₹{Math.round(totalCanonicalINR).toLocaleString("en-IN")} INR
                </span>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">TX ID</th>
                      <th className="py-3 px-4">Target Product</th>
                      <th className="py-3 px-4">Contributor</th>
                      <th className="py-3 px-4">Charged Amount</th>
                      <th className="py-3 px-4">Locked FX Rate</th>
                      <th className="py-3 px-4">Canonical Credited (INR)</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {initialContributions.length > 0 ? (
                      initialContributions.map((c) => {
                        const inrAmount = c.canonicalAmount || c.amount;
                        const charged = c.chargedAmount || c.amount;
                        const curr = c.chargedCurrency || c.currency || "INR";
                        const rate = c.exchangeRate ? parseFloat(c.exchangeRate) : 1;

                        return (
                          <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                            <td className="py-3.5 px-4 font-bold text-slate-300">
                              {c.id.slice(0, 8)}...{c.id.slice(-4)}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-white">
                              {c.productName || "Direct Sovereign Claim"}
                            </td>
                            <td className="py-3.5 px-4 text-slate-400">
                              {c.contributorEmail || "Verified Gateway"}
                            </td>
                            <td className="py-3.5 px-4 text-emerald-400 font-bold">
                              {parseFloat(charged).toLocaleString()} {curr}
                            </td>
                            <td className="py-3.5 px-4 text-slate-300 text-[11px]">
                              {curr === "INR" ? "1.0000 (Base)" : `1 INR = ${rate.toFixed(5)} ${curr}`}
                            </td>
                            <td className="py-3.5 px-4 text-[#38bdf8] font-bold">
                              ₹{parseFloat(inrAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })} INR
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                {c.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right text-slate-500 text-[11px]">
                              {new Date(c.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-500">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 5: EXCHANGE RATE & CURRENCY TELEMETRY */}
        {/* ===================================================== */}
        {activeTab === "rates" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-amber-400" />
                  <span>Exchange Rate &amp; Currency Telemetry</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Canonical Base Currency: <strong>INR (₹)</strong> · Server-side rate quotes &amp; cache monitoring.
                </p>
              </div>

              <button
                onClick={handleRefreshExchangeRates}
                disabled={isRefreshingRates}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#38bdf8] text-slate-950 font-bold text-xs hover:brightness-110 shadow-md disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingRates ? "animate-spin" : ""}`} />
                <span>{isRefreshingRates ? "Updating Live Rates..." : "Refresh Live Rates"}</span>
              </button>
            </div>

            <AdminCurrencySimulator liveRates={ratesData.rates} />

            {/* Provider Status Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#14171f] border border-white/10">
                <span className="text-[11px] text-slate-400 font-mono block">PROVIDER STATUS</span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-1 block uppercase">
                  ● {ratesData.providerStatus}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block truncate">
                  {ratesData.source}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14171f] border border-white/10">
                <span className="text-[11px] text-slate-400 font-mono block">CANONICAL CURRENCY</span>
                <span className="text-sm font-bold text-white font-mono mt-1 block">
                  INR (₹) — Indian Rupee
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  100% of sovereign rankings calculate in INR
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14171f] border border-white/10">
                <span className="text-[11px] text-slate-400 font-mono block">LAST RATE SYNC</span>
                <span className="text-sm font-bold text-slate-300 font-mono mt-1 block">
                  {new Date(ratesData.timestamp).toLocaleTimeString()}
                </span>
                <span className="text-[10px] text-emerald-400 mt-0.5 block">
                  Cache TTL: 60 minutes
                </span>
              </div>
            </div>

            {/* Supported Currencies & Live Rates Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Currency</th>
                      <th className="py-3 px-4">Symbol</th>
                      <th className="py-3 px-4">Rate (1 INR = )</th>
                      <th className="py-3 px-4">Inverse Rate (1 Unit = INR)</th>
                      <th className="py-3 px-4">Example: ₹1,000 INR Displays As</th>
                      <th className="py-3 px-4 text-right">Decimals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {(Object.keys(CURRENCY_REGISTRY) as SupportedCurrency[]).map((code) => {
                      const meta = CURRENCY_REGISTRY[code];
                      const rate = ratesData.rates[code] || 1;
                      const inv = rate > 0 ? (1 / rate).toFixed(2) : "—";
                      const convertedExample = (1000 * rate).toLocaleString(undefined, {
                        minimumFractionDigits: meta.decimals,
                        maximumFractionDigits: meta.decimals,
                      });

                      return (
                        <tr key={code} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                            <span>{meta.flag}</span>
                            <span>{meta.code}</span>
                            <span className="text-slate-400 font-normal">({meta.name})</span>
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400 font-bold">{meta.symbol}</td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {code === "INR" ? "1.00000" : rate.toFixed(6)}
                          </td>
                          <td className="py-3.5 px-4 text-sky-400 font-bold">
                            {code === "INR" ? "₹1.00 INR" : `₹${inv} INR`}
                          </td>
                          <td className="py-3.5 px-4 text-purple-300 font-bold">
                            {meta.symbol}{convertedExample} {code}
                          </td>
                          <td className="py-3.5 px-4 text-right text-slate-400">
                            {meta.decimals}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 6: MAKERS & OWNERS DIRECTORY */}
        {/* ===================================================== */}
        {activeTab === "users" && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>Verified Makers &amp; Sovereign Owners</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Directory of verified product creators and promotional space holders.
              </p>
            </div>

            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Maker / Creator</th>
                      <th className="py-3 px-4">Owner Email</th>
                      <th className="py-3 px-4">Twitter / X Handle</th>
                      <th className="py-3 px-4">Entities Owned</th>
                      <th className="py-3 px-4 text-right">Total Backing Attracted (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {makersList.map((m, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{m.name}</td>
                        <td className="py-3.5 px-4 text-slate-400">{m.email}</td>
                        <td className="py-3.5 px-4 text-sky-400">{m.twitter}</td>
                        <td className="py-3.5 px-4 text-purple-300 font-bold">{m.count} products</td>
                        <td className="py-3.5 px-4 text-right text-emerald-400 font-bold">
                          ₹{Math.round(m.support).toLocaleString("en-IN")} INR
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================== */}
        {/* TAB 7: SECURITY & AUDIT TRAIL */}
        {/* ===================================================== */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <span>Emergency Circuit Breakers &amp; Audit Logs</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Platform killswitches and cryptographic product events log.
              </p>
            </div>

            {/* Circuit Breakers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#14171f] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Global Rank Claim Freeze
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Pauses all new ranking contributions across all currencies.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsClaimFreezeActive(!isClaimFreezeActive);
                    setStatusMessage(!isClaimFreezeActive ? "Rank claims frozen." : "Rank claims active.");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    isClaimFreezeActive ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isClaimFreezeActive ? "FROZEN" : "ACTIVE"}
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-[#14171f] border border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white text-xs block">
                    Maintenance Mode Override
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Temporarily redirects visitors to maintenance state.
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsMaintenanceActive(!isMaintenanceActive);
                    setStatusMessage(!isMaintenanceActive ? "Maintenance enabled." : "Maintenance disabled.");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                    isMaintenanceActive ? "bg-rose-500 text-white" : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {isMaintenanceActive ? "ENABLED" : "DISABLED"}
                </button>
              </div>
            </div>

            {/* Audit Logs Table */}
            <div className="rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-[#101218]">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Immutable Product &amp; Financial Events Log
                </h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#101218] text-slate-400 uppercase text-[10px] border-b border-white/10 sticky top-0">
                    <tr>
                      <th className="py-3 px-4">Event ID</th>
                      <th className="py-3 px-4">Event Type</th>
                      <th className="py-3 px-4">Product Name</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4 text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev) => (
                      <tr key={ev.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {ev.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#38bdf8]/10 text-[#38bdf8] border border-[#38bdf8]/30">
                            {ev.eventType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-bold">
                          {ev.productName || "Direct Platform"}
                        </td>
                        <td className="py-3 px-4 text-emerald-400">
                          {ev.amount ? `₹${parseFloat(ev.amount).toLocaleString()} INR` : "—"}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-500 text-[11px]">
                          {new Date(ev.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
