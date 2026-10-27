"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Crown,
  Layers,
  Image as ImageIcon,
  Edit3,
  Heart,
  ShieldCheck,
  Plus,
  Minus,
  Globe,
} from "lucide-react";
import { useUserCurrency } from "@/lib/currency";
import { ProductLogo } from "@/components/products/product-logo";
import { CategoryIcon } from "@/components/outrank/category-icon";
import { VerifiedBadge } from "@/components/outrank/verified-badge";

const ALL_PLATFORM_CATEGORIES = [
  { id: "coding-dev-tools", name: "Coding & Developer Tools", description: "IDEs, GitHub repos, compilers, APIs" },
  { id: "ott-streaming", name: "OTT & Streaming Platforms", description: "Netflix, Prime, Spotify, Twitch, OTT media" },
  { id: "social-media", name: "Social Media & Creators", description: "Instagram, Twitter/X, TikTok, YouTubers" },
  { id: "ai-agents", name: "AI & Autonomous Agents", description: "LLMs, autonomous agents, neural engines" },
  { id: "productivity", name: "Productivity & SaaS", description: "Project management, Notion, Slack, Linear" },
  { id: "gaming-esports", name: "Gaming & Esports", description: "Game studios, Steam, Discord bots, esports" },
  { id: "fintech-banking", name: "Fintech & Banking", description: "Payment gateways, Stripe, banks, investing" },
  { id: "ecommerce-retail", name: "E-Commerce & Retail", description: "Online stores, Shopify, Amazon, brands" },
  { id: "education-edtech", name: "Education & EdTech", description: "LeetCode, coding academies, bootcamps" },
  { id: "design", name: "Design & Creative", description: "Figma, 3D tools, generative art, UI kits" },
  { id: "crypto-web3", name: "Crypto, DeFi & Web3", description: "Blockchains, protocols, wallets, tokens" },
  { id: "cybersecurity", name: "Cybersecurity & Privacy", description: "VPNs, auth, password vaults, encryption" },
  { id: "news-media", name: "News, Media & Podcasts", description: "Publications, newsletters, podcast hubs" },
  { id: "health-fitness", name: "Health & Fitness", description: "Workout trackers, biohacking, sports apps" },
  { id: "mobile-apps", name: "Mobile & Desktop Apps", description: "iOS, Android, macOS, Windows apps" },
  { id: "hardware-iot", name: "Hardware & IoT", description: "Connected devices, smart home, wearables" },
  { id: "marketing", name: "Marketing & Growth", description: "Ad tools, SEO intelligence, viral outreach" },
  { id: "other", name: "Other Platforms", description: "Original web utilities and emerging creations" },
];

function ClaimPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { config, isMounted, convertDisplayToCanonical, convertCanonicalToDisplay } = useUserCurrency();

  // Initial params
  const initialUrl = searchParams.get("websiteUrl") || searchParams.get("url") || "";
  const initialName = searchParams.get("name") || "";
  const initialDesc = searchParams.get("description") || "";
  const initialLogo = searchParams.get("logoUrl") || "";
  const initialCategory = searchParams.get("categorySlug") || "coding-dev-tools";
  const initialAmount = Number(searchParams.get("amount")) || 1000;

  // Customizer state
  const [websiteUrl] = useState(initialUrl);
  const [name, setName] = useState(initialName || "My Project");
  const [description, setDescription] = useState(
    initialDesc || "Verified showcase ranking on Outrank."
  );
  const [logoUrl, setLogoUrl] = useState(initialLogo);
  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [bidAmount, setBidAmount] = useState(initialAmount);
  const [rawBidText, setRawBidText] = useState(String(initialAmount));
  const [isEditingBid, setIsEditingBid] = useState(false);

  // Sync bid text when amount changes outside manual typing
  useEffect(() => {
    if (!isEditingBid) {
      setRawBidText(bidAmount.toLocaleString("en-US"));
    }
  }, [bidAmount, isEditingBid]);

  const symbol = isMounted ? config.symbol : "$";
  const selectedCategory =
    ALL_PLATFORM_CATEGORIES.find((c) => c.id === categorySlug) || ALL_PLATFORM_CATEGORIES[0];

  const ONE_TRILLION = 1_000_000_000_000;

  function handleBidChange(newVal: number) {
    const valid = Math.min(ONE_TRILLION, Math.max(1, Math.round(newVal)));
    setBidAmount(valid);
    setRawBidText(valid.toLocaleString("en-US"));
  }

  function handleContinueToPayment() {
    const canonicalINR = convertDisplayToCanonical(bidAmount);

    const query = new URLSearchParams({
      targetType: "product",
      targetName: name.trim() || "Verified Product",
      websiteUrl: websiteUrl,
      name: name.trim() || "Verified Product",
      description: description.trim() || "Verified showcase on Outrank.",
      logoUrl: logoUrl.trim(),
      categorySlug: categorySlug,
      amount: String(bidAmount),
      currency: config.code,
      canonicalAmountINR: String(canonicalINR),
      returnUrl: "/",
    });

    router.push(`/payment/razorpay?${query.toString()}`);
  }

  return (
    <main className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-8 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Outrank</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/10 text-[#a855f7] border border-purple-500/20">
            Step 1 of 2: Preview &amp; Customize
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Leaderboard Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-purple-500/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                Live Leaderboard Preview
              </span>
              <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Targeting #1 Rank
              </span>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              This is the exact high-visibility card that visitors and investors worldwide will see on the Outrank leaderboard:
            </p>

            {/* Exact Leaderboard Row Simulation */}
            <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-purple-900/10 to-[var(--surface)] p-4 shadow-lg space-y-3">
              <div className="flex items-start gap-3.5">
                {/* Crown / Rank Badge */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-black text-sm flex items-center justify-center shadow-md">
                    #1
                  </div>
                  <Crown className="w-4 h-4 text-amber-400 mt-1 animate-pulse" />
                </div>

                {/* Logo / Avatar — reactive live update */}
                <div className="w-12 h-12 rounded-xl border border-white/20 overflow-hidden bg-black/40 shrink-0 shadow-inner flex items-center justify-center">
                  <ProductLogo
                    key={`${logoUrl}_${name}`}
                    name={name}
                    src={logoUrl || null}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-bold text-base text-[var(--text-primary)] truncate">
                      {name || "Untitled Product"}
                    </h3>
                    <VerifiedBadge size="sm" />
                  </div>

                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-relaxed">
                    {description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-[10px] font-semibold text-purple-300">
                      <CategoryIcon category={selectedCategory.name} className="w-3 h-3" />
                      <span>{selectedCategory.name}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Backing Summary inside Preview */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[var(--text-muted)] font-medium">Claiming Backing Pool:</span>
                <span className="font-mono font-extrabold text-base text-amber-400">
                  {symbol} {bidAmount.toLocaleString("en-US")}
                </span>
              </div>
            </div>

            {/* Live Verification Notice */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-200">
              <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Includes Instant Verified Badge &amp; Global Outrank Indexing.</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-400" />
              <span>Customize Platform Details</span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Verify the automatically extracted information or tailor your title, bio, and platform category before continuing.
            </p>
          </div>

          <div className="space-y-4">
            {/* Website URL (Read-only verified) */}
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                Target URL / Handle (Verified)
              </label>
              <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-primary)] font-mono">
                <Globe className="w-4 h-4 text-purple-400 mr-2 shrink-0" />
                <span className="truncate">{websiteUrl}</span>
              </div>
            </div>

            {/* Product / Creator Title */}
            <div>
              <label htmlFor="product-name" className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                Title / Brand / Creator Name *
              </label>
              <input
                id="product-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Linear, Netflix, or @username"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-[var(--text-primary)] focus:outline-none transition-all font-medium"
              />
            </div>

            {/* Bio / Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="product-desc" className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  Bio / Tagline / Description *
                </label>
                <span className="text-[11px] text-[var(--text-muted)]">
                  {description.length}/180
                </span>
              </div>
              <textarea
                id="product-desc"
                rows={2}
                maxLength={180}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short bio or product pitch (e.g. Next-generation autonomous AI developer)"
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-[var(--text-primary)] focus:outline-none transition-all font-medium resize-none"
              />
            </div>

            {/* Platform Category Selector (Comprehensive 18 platforms) */}
            <div>
              <label htmlFor="category-select" className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider">
                Platform Category * (All Modern Sectors)
              </label>
              <select
                id="category-select"
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-sm text-[var(--text-primary)] focus:outline-none transition-all font-semibold cursor-pointer"
              >
                {ALL_PLATFORM_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-[#1a1d24] text-white py-1">
                    {cat.name} — {cat.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Avatar / Logo URL */}
            <div>
              <label htmlFor="logo-url" className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5 uppercase tracking-wider flex items-center justify-between">
                <span>Avatar / Logo Image URL (Optional)</span>
                <span className="text-[10px] text-purple-400 font-normal">Auto-detected from metadata</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="logo-url"
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://... image link"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-xs text-[var(--text-primary)] focus:outline-none transition-all font-mono"
                />
              </div>
            </div>

            {/* Bid / Backing Value Adjustment */}
            <div className="pt-2 border-t border-[var(--border)] space-y-3">
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Choose Bid Amount to Claim Rank (Regional Currency: {config.code})
              </label>

              <div className="flex items-center gap-2">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => handleBidChange(bidAmount - 100)}
                  disabled={bidAmount <= 10}
                  className="w-10 h-10 rounded-xl bg-transparent hover:bg-white/5 active:scale-90 text-purple-400 flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer shrink-0"
                >
                  <Minus className="w-5 h-5 stroke-[2.5]" />
                </button>

                {/* Amount Input — single clean element, no nested dark box */}
                <div className="flex-1 flex items-center px-4 py-2.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/20 transition-all">
                  <span className="text-xl font-black text-purple-400 mr-2 select-none shrink-0">{symbol}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={rawBidText}
                    onFocus={() => {
                      setIsEditingBid(true);
                      setRawBidText(rawBidText.replace(/,/g, ""));
                    }}
                    onBlur={() => {
                      setIsEditingBid(false);
                      const parsed = parseInt(rawBidText.replace(/[^0-9]/g, ""), 10);
                      handleBidChange(Number.isFinite(parsed) ? parsed : 100);
                    }}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^0-9]/g, "");
                      if (clean.length <= 13) {
                        const parsed = parseInt(clean, 10);
                        if (Number.isFinite(parsed)) {
                          const capped = Math.min(ONE_TRILLION, parsed);
                          setRawBidText(capped.toLocaleString("en-US"));
                          setBidAmount(capped);
                        } else {
                          setRawBidText("");
                        }
                      }
                    }}
                    style={{ background: "transparent", border: "none", outline: "none", boxShadow: "none", padding: 0, margin: 0 }}
                    className="w-full bg-transparent border-0 font-mono font-extrabold text-lg text-[var(--text-primary)] focus:outline-none focus:ring-0 p-0 m-0"
                  />
                  <span className="text-xs font-bold text-[var(--text-muted)] uppercase shrink-0 select-none ml-2">
                    {config.code}
                  </span>
                </div>

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => handleBidChange(bidAmount + 100)}
                  disabled={bidAmount >= ONE_TRILLION}
                  className="w-10 h-10 rounded-xl bg-transparent hover:bg-white/5 active:scale-90 text-purple-400 flex items-center justify-center transition-all disabled:opacity-30 cursor-pointer shrink-0"
                >
                  <Plus className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3">
              <Link
                href="/"
                className="px-5 py-3 rounded-2xl text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={handleContinueToPayment}
                className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7446d8] via-purple-600 to-[#9333ea] hover:brightness-110 active:scale-95 shadow-xl shadow-purple-900/30 transition-all cursor-pointer"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ClaimPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <ClaimPreviewContent />
    </Suspense>
  );
}
