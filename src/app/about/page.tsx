import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Award,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Users,
  Sparkles,
  Coins,
  CheckCircle2,
  Layers,
  MapPin,
  Flame,
  Search,
  Lock,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Outrank — The Sovereign Global Discovery & Deterministic Ranking Engine",
  description:
    "Explore how Outrank is reshaping global product discovery with 3,400+ products across 24 categories, 197 sovereign nations, NASA night-satellite telemetry, and deterministic ranking backed by community support.",
};

const STATS = [
  { label: "Indexed Products", value: "3,400+", icon: Layers, desc: "Across 24 commercial tech categories" },
  { label: "Sovereign Nations", value: "197", icon: Globe, desc: "Global sovereign leaderboard" },
  { label: "Administrative States", value: "4,000+", icon: MapPin, desc: "First-level territorial subdivisions" },
  { label: "Currency Support", value: "Global", icon: Coins, desc: "Auto-detected INR, USD, EUR, GBP & more" },
];

const FEATURES = [
  {
    icon: Award,
    title: "Deterministic Ranking Engine",
    desc: "Rankings are strictly calculated from confirmed promotional support. No secret algorithmic suppression, opaque ad auctions, or pay-to-play bias. Ties are settled deterministically by confirmed timestamp.",
    badge: "Core Protocol",
  },
  {
    icon: Globe,
    title: "197 Sovereign Nations & 4,000+ States",
    desc: "A worldwide geographical index representing every UN-recognized sovereign nation and over 4,000 state, province, and regional subdivisions with dedicated backer telemetry and regional standing.",
    badge: "Global Atlas",
  },
  {
    icon: Sparkles,
    title: "NASA Satellite Night-Light Telemetry",
    desc: "High-resolution 1024x512 Plate Carrée night-map rendering ground-truth population and economic centroids from North America, Europe, and Asia-Pacific to Eurasia and Siberia.",
    badge: "Spatial Engine",
  },
  {
    icon: Coins,
    title: "Universal Local Currency Ingestion",
    desc: "Automatic network detection converts contributions into native currencies (₹ INR, $ USD, € EUR, £ GBP, ¥ JPY). Back products or nations with any amount from 1 unit up to trillions.",
    badge: "Payments",
  },
  {
    icon: Zap,
    title: "Direct Metadata Scraping & Onboarding",
    desc: "Paste any product link or social profile. Outrank automatically fetches high-res logos, titles, descriptions, and verified social media handles (Twitter/X, GitHub, Discord) with zero queue delays.",
    badge: "Automation",
  },
  {
    icon: Flame,
    title: "Discover What's Rising & Top Categories",
    desc: "24 finely categorized directories — AI Agents, Developer Tools, Analytics, FinTech, Web3, Design, and more — with real-time trending velocity meters tracking emerging market leaders.",
    badge: "Discovery",
  },
];

export default function AboutPage() {
  return (
    <main className="max-w-6xl mx-auto py-10 px-4 sm:px-6 space-y-16">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-14 shadow-sm space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-[#7446d8] dark:text-[#a278ff] border border-purple-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Global Open Discovery Protocol</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.12]">
          Deterministic visibility for products, makers, and sovereign territories.
        </h1>

        <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          Outrank replaces opaque ad networks, manipulated review algorithms, and walled-garden platforms with a transparent, public leaderboard. Backed by verified community contributions, Outrank indexes over 3,400 tools across 24 categories and charts 197 sovereign countries on a live satellite night map.
        </p>

        {/* Action CTAs */}
        <div className="pt-2 flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 shadow-md shadow-purple-900/20 transition-all flex items-center gap-2"
          >
            <span>Explore Products Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/global"
            className="px-6 py-3 rounded-xl font-bold text-xs text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all flex items-center gap-2"
          >
            <Globe className="w-4 h-4 text-[#7446d8]" />
            <span>Sovereign Nations Map</span>
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 rounded-xl font-bold text-xs text-[var(--text-secondary)] border border-[var(--border)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-purple-500" />
            <span>24 Product Categories</span>
          </Link>
        </div>
      </div>

      {/* Numerical Stats Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-2 hover:border-[#7446d8]/40 transition-colors"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#7446d8] flex items-center justify-center mb-2">
                <Icon className="w-4 h-4" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wide">
                {stat.label}
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] leading-normal">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </section>

      {/* Core Outrank Features */}
      <section className="space-y-8">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7446d8] dark:text-[#a278ff]">
            Full Architecture & Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[var(--text-primary)] mt-1">
            Everything inside the Outrank ecosystem.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Outrank combines open market financial consensus with modern satellite telemetry to create an immutable index of the web&apos;s greatest software and global communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3.5 hover:border-[#7446d8]/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-[#7446d8] dark:text-[#a278ff] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-secondary)]">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Deep Dive: How Ranking and Map Telemetry Function */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-12 space-y-10">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7446d8] dark:text-[#a278ff]">
            Mechanics &amp; Integrity
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            How Outrank Operates in Real Time
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 border-l-2 border-purple-500 pl-4">
            <span className="text-xs font-extrabold uppercase text-purple-500">Step 01</span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Instant Link Ingestion</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Anyone can submit or claim a product by simply pasting its web address. Outrank instantly resolves Open Graph metadata, social avatars, and categorical classification without bureaucratic gates.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-purple-500 pl-4">
            <span className="text-xs font-extrabold uppercase text-purple-500">Step 02</span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Mathematical Leaderboards</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every promotional contribution directly increments the product or nation’s sovereign backing balance. Ranks update deterministically, placing the most supported projects at the very top.
            </p>
          </div>

          <div className="space-y-3 border-l-2 border-purple-500 pl-4">
            <span className="text-xs font-extrabold uppercase text-purple-500">Step 03</span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">Geospatial Night Map</h4>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Nations compete on the Global Atlas. The #1 ranked nation is highlighted live with pulsing radar beacons calibrated to true geographical coordinates across 197 countries and territories.
            </p>
          </div>
        </div>
      </section>

      {/* Disclosures and Policy Summary */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-[#7446d8]" />
          <span>Operational Principles &amp; Legal Disclosures</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-[var(--text-primary)] space-y-2">
            <strong className="text-amber-600 dark:text-amber-400 block font-bold text-sm">
              Promotional Visibility Notice
            </strong>
            <p className="text-xs leading-relaxed">
              Contributions made on Outrank represent commercial visibility and promotional backing to elevate rank on the public leaderboard. Backing does not confer company shares, dividends, intellectual property, equity, or securities.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-[var(--text-primary)] space-y-2">
            <strong className="text-rose-600 dark:text-rose-400 block font-bold text-sm">
              Strict No Refund Policy
            </strong>
            <p className="text-xs leading-relaxed">
              All contributions and payments made on Outrank are strictly final and non-refundable once processed. Visibility, leaderboard position, and ledger transactions are permanently registered upon payment completion.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href="/guidelines"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#7446d8] hover:bg-[#6236c5] transition-all flex items-center gap-2"
            >
              <span>Read Full Guidelines &amp; Policies</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/categories"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all"
            >
              <span>Explore All Categories</span>
            </Link>
          </div>

          <span className="text-xs text-[var(--text-muted)]">
            Outrank &copy; {new Date().getFullYear()} &middot; The Global Open Discovery Network
          </span>
        </div>
      </section>
    </main>
  );
}
