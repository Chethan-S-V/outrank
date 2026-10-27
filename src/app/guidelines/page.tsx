import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Ban,
  CheckCircle2,
  HelpCircle,
  FileText,
  DollarSign,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Guidelines & Payment Policy — Outrank",
  description:
    "Comprehensive community guidelines, product listing standards, deterministic ranking rules, and our strict no-refund payment policy.",
};

const GUIDELINE_SECTIONS = [
  {
    icon: CheckCircle2,
    title: "1. Accurate Product Submissions",
    summary: "Authentic titles, canonical domains, and verified descriptions.",
    content:
      "All submissions must link to working canonical websites or genuine maker repositories. Product titles, descriptions, categories, and social links (X/Twitter, GitHub, Discord) must accurately represent what the product or tool delivers. Submitting fake, misleading, placeholder, or domain-parking URLs is strictly prohibited.",
  },
  {
    icon: Ban,
    title: "2. Prohibited Content & Blacklisted Categories",
    summary: "Zero tolerance for harmful, illegal, or deceptive software.",
    content:
      "We strictly prohibit listings promoting malware, ransomware, spyware, unauthorized scraping/credential harvesting tools, phishing kits, illegal weapons, unlicensed pharmaceutical or financial gambling instruments, non-consensual media, or copyright-infringing content. Violating listings will be purged immediately without notice.",
  },
  {
    icon: ShieldCheck,
    title: "3. Brand Ownership & Anti-Impersonation",
    summary: "Respect trademark rights and legitimate product ownership.",
    content:
      "Claiming a product on Outrank requires lawful affiliation with the brand or maker. Impersonating trademarks, registering another entity's tool under deceptive ownership, or redirecting brand traffic to affiliate funnels without authorization will lead to instant permanent suspension and domain blacklisting.",
  },
  {
    icon: Scale,
    title: "4. Deterministic Ranking & Anti-Manipulation",
    summary: "Mathematical integrity powered by verified transactions.",
    content:
      "Outrank rankings are strictly deterministic, based on confirmed public promotional backing. No internal curation, black-box search weightings, or hidden review bidding can manipulate position. Any attempt to exploit payment loopholes, conduct card-testing loops, or inject artificial transactions will trigger automated platform locks.",
  },
  {
    icon: CreditCard,
    title: "5. Sovereign Nation & Territory Contributions",
    summary: "Rules governing country and subdivision leaderboards.",
    content:
      "Contributions to Sovereign Nations (197 sovereign countries) and Subdivisions (4,000+ states and provinces) represent collective pride and public territory ranking. Backing a country does not confer sovereign statehood, political representation, or governmental authority. All contributions update real-time satellite night-light beacons and leaderboard totals.",
  },
  {
    icon: FileText,
    title: "6. Platform Ingestion & Duplicate Listings",
    summary: "One canonical listing per tool or service domain.",
    content:
      "Outrank maintains a unified directory of over 3,400 software products across 24 categories. To maintain catalog purity, duplicate listings for identical domains or subdomains are consolidated into a single primary record. In case of duplicate claims, verified makers retain administrative ownership.",
  },
];

export default function GuidelinesPage() {
  return (
    <main className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-12">
      {/* Page Header */}
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 dark:bg-purple-950/40 text-[#7446d8] dark:text-[#a278ff] border border-purple-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Platform Standards &amp; Policies</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] tracking-tight">
          Outrank Community Guidelines &amp; Terms
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-3xl">
          Outrank is built on transparency, deterministic leaderboards, and verified community support. Please read these guidelines and our strict payment terms carefully before submitting products or making financial contributions.
        </p>
      </div>

      {/* CRITICAL CALLOUT: STRICT NO REFUND POLICY */}
      <section className="rounded-3xl border-2 border-rose-500/40 bg-rose-500/[0.04] p-8 sm:p-10 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-700 dark:text-rose-300">
              Crucial Payment Terms &amp; Policy
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
              Strict No Refund Policy — All Payments Are Final
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Every financial contribution, backing payment, or promotional upgrade made on Outrank is <strong>strictly final, non-refundable, and non-reversible once paid</strong>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-[var(--text-secondary)] pt-2">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Instant &amp; Irreversible Visibility Delivery
            </h4>
            <p className="text-xs leading-relaxed">
              When a payment is processed, the system immediately credits the backing amount to the specified product or sovereign nation. Real-time deterministic rank elevation, satellite radar telemetry, and public index visibility are delivered instantly at the point of confirmation.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              No Chargebacks or Reversal Tolerances
            </h4>
            <p className="text-xs leading-relaxed">
              Because promotional visibility is consumed in real time, no refund requests, order cancellations, or payment reversals will be granted under any circumstances once the transaction is completed. Attempted chargebacks will result in automatic listing forfeiture and permanent payment gateway bans.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              Open Currency &amp; Contribution Spectrum
            </h4>
            <p className="text-xs leading-relaxed">
              Users can contribute anywhere from 1 unit of their local currency (e.g., ₹1 INR, $1 USD, €1 EUR, £1 GBP) up to any higher amount. Currency is dynamically matched to your local network connection.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] space-y-2">
            <h4 className="font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Not Financial or Investment Securities
            </h4>
            <p className="text-xs leading-relaxed">
              Contributions are commercial promotion fees for public discovery placement. Backing does not constitute equity, stock, dividends, revenue sharing, cryptocurrency tokens, or loans.
            </p>
          </div>
        </div>
      </section>

      {/* Community & Submission Standards */}
      <section className="space-y-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#7446d8] dark:text-[#a278ff]">
            Catalog &amp; Moderation
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-1">
            Community Guidelines &amp; Standards
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Rules ensuring fair competition and reliable discovery across our 3,400+ indexed software products and 197 sovereign countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {GUIDELINE_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-3 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-[#7446d8] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--text-primary)]">{sec.title}</h3>
                    <p className="text-[11px] text-[var(--text-muted)]">{sec.summary}</p>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed pl-12">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enforcement & Appeals */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 sm:p-10 space-y-4">
        <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#7446d8]" />
          <span>Violations, Enforcement &amp; Appeals</span>
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Outrank moderators continuously audit listings for malicious behavior, copyright infringement, or fraudulent activity. If you believe your product was incorrectly flagged or need to assert ownership over a canonical domain, please submit a claim with cryptographic or DNS proof. All decisions made under our integrity guidelines are binding.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 items-center">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 transition-all flex items-center gap-1.5"
          >
            <span>Back to Live Leaderboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/about"
            className="px-5 py-2.5 rounded-xl font-bold text-xs text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all"
          >
            <span>About Outrank Protocol</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
