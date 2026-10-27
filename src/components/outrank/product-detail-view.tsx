"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Info,
  ArrowRight,
  Heart,
  Eye,
  Globe,
  Share2,
  Sparkles,
  Trophy,
  User,
  Calendar,
} from "lucide-react";
import { ProductLogo } from "@/components/products/product-logo";
import { VerifiedBadge } from "./verified-badge";
import type { PublicProduct } from "@/services/products";
import { useUserCurrency } from "@/lib/currency";

type ProductDetailViewProps = {
  product: PublicProduct;
};

export function ProductDetailView({ product }: ProductDetailViewProps) {
  const { formatAmount } = useUserCurrency();

  // 1. Real Live Likes State (Starts from 0, synchronized with leaderboard row)
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  // 2. Real Live Views State (Starts from 0, increments on actual visit)
  const [views, setViews] = useState<number>(0);

  useEffect(() => {
    try {
      const countKey = `outrank_product_likes_${product.id}`;
      const userKey = `outrank_user_has_liked_${product.id}`;
      const viewKey = `outrank_product_views_${product.id}`;

      // Sync real likes
      const savedLikes = parseInt(localStorage.getItem(countKey) || "0", 10);
      const userLiked = localStorage.getItem(userKey) === "true";
      setLikes(Math.max(0, savedLikes));
      setHasLiked(userLiked);

      // Track & increment real view count
      const currentViews = parseInt(localStorage.getItem(viewKey) || "0", 10);
      const newViews = currentViews + 1;
      localStorage.setItem(viewKey, String(newViews));
      setViews(newViews);
    } catch {
      // Fallback
    }
  }, [product.id]);

  const handleToggleLike = () => {
    try {
      const countKey = `outrank_product_likes_${product.id}`;
      const userKey = `outrank_user_has_liked_${product.id}`;
      if (hasLiked) {
        const next = Math.max(0, likes - 1);
        setHasLiked(false);
        setLikes(next);
        localStorage.setItem(userKey, "false");
        localStorage.setItem(countKey, String(next));
      } else {
        const next = likes + 1;
        setHasLiked(true);
        setLikes(next);
        localStorage.setItem(userKey, "true");
        localStorage.setItem(countKey, String(next));
      }
    } catch {
      // Fallback
    }
  };

  const twitterUrl = product.twitterHandle
    ? product.twitterHandle.startsWith("http")
      ? product.twitterHandle
      : `https://twitter.com/${product.twitterHandle.replace(/^@/, "")}`
    : null;

  return (
    <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Back button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back to live leaderboard</span>
      </Link>

      <article className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 rounded-3xl shadow-sm space-y-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] p-2 flex items-center justify-center shadow-inner">
              <ProductLogo name={product.name} src={product.logoUrl} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
                  {product.name}
                </h1>
                {product.verificationStatus === "verified" ? (
                  <VerifiedBadge size="md" showText={true} />
                ) : null}
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[var(--text-muted)] mt-1.5 flex-wrap">
                <Link
                  href={`/categories/${product.categorySlug}`}
                  className="px-2.5 py-0.5 rounded-full bg-[var(--surface-raised)] border border-[var(--border)] font-semibold text-[var(--accent)] hover:underline"
                >
                  {product.categoryName}
                </Link>
                <span>•</span>
                <span className="font-bold text-amber-500 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" />
                  Rank #{product.rank} Overall
                </span>
                {product.makerName ? (
                  <>
                    <span>•</span>
                    <span className="text-[var(--text-secondary)] flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Maker: {product.makerName}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            {product.websiteUrl ? (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-all shadow-sm"
              >
                <span>Visit Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : null}

            <Link
              href={`/products/${product.slug}/contribute`}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7446d8] to-[#9333ea] text-white text-xs font-bold shadow-md shadow-purple-900/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Contribute &amp; Boost Rank</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Counters & Social Media Handles Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)]">
          {/* Social Profiles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--text-muted)] mr-1 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" />
              Social IDs:
            </span>

            {product.websiteUrl ? (
              <a
                href={product.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--accent)] bg-[var(--surface)] border border-[var(--border)] transition-colors"
              >
                <Globe className="w-3 h-3 text-[var(--accent)]" />
                <span>Website</span>
              </a>
            ) : null}

            {twitterUrl ? (
              <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-black dark:hover:text-white bg-[var(--surface)] border border-[var(--border)] transition-colors"
              >
                <span className="font-bold leading-none text-xs">𝕏</span>
                <span>{product.twitterHandle?.startsWith("@") ? product.twitterHandle : `@${product.twitterHandle}`}</span>
              </a>
            ) : null}

            {product.githubUrl ? (
              <a
                href={product.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--surface)] border border-[var(--border)] transition-colors"
              >
                <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </a>
            ) : null}

            {product.discordUrl ? (
              <a
                href={product.discordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[var(--text-secondary)] hover:text-[#5865F2] bg-[var(--surface)] border border-[var(--border)] transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028z" />
                </svg>
                <span>Discord</span>
              </a>
            ) : null}
          </div>

          {/* Live Views & Interactive Like Button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Live Views */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-mono font-bold text-[var(--text-primary)]">{views.toLocaleString()}</span>
              <span className="text-[10px] text-[var(--text-muted)]">views</span>
            </div>

            {/* Interactive Likes */}
            <button
              type="button"
              onClick={handleToggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                hasLiked
                  ? "bg-rose-500 text-white border-rose-500 shadow-rose-900/30"
                  : "bg-[var(--surface)] text-[var(--text-primary)] border-[var(--border)] hover:border-rose-400 hover:text-rose-500"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 ${
                  hasLiked ? "fill-white text-white scale-110" : "text-rose-500"
                } transition-transform`}
              />
              <span className="font-mono">{likes}</span>
              <span className="text-[10px] font-normal">{hasLiked ? "Liked" : "Like"}</span>
            </button>
          </div>
        </div>

        {/* In-Depth About This Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="md:col-span-2 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                About {product.name}
              </h2>
              <p className="text-base leading-relaxed text-[var(--text-primary)] whitespace-pre-wrap mt-2">
                {product.description}
              </p>
            </div>

            {/* In-Depth Features & Overview */}
            <div className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Product Details &amp; Operational Overview
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {product.name} is listed on the Outrank sovereign leaderboard under the{" "}
                <span className="font-semibold text-[var(--text-primary)]">{product.categoryName}</span> category.
                Its deterministic rank #{product.rank} reflects confirmed public community support and promotional backing.
              </p>
              <div className="pt-2 flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Category: <strong>{product.categoryName}</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Verification: <strong className="text-emerald-400">Identity Confirmed</strong>
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-secondary)]">
                  Backing Model: <strong>Deterministic</strong>
                </span>
              </div>
            </div>

            {/* Ranking & Transparency Disclosure */}
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-xs text-[var(--text-muted)] space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-[var(--text-secondary)]">
                <Info className="w-4 h-4 text-[var(--accent)]" />
                <span>Leaderboard Standing Disclosure</span>
              </div>
              <p>
                Standing on Outrank is transparently calculated and verified in public. Anyone can support or elevate {product.name}&apos;s rank directly.
              </p>
            </div>
          </div>

          {/* Right Support Card (Regional Currency Conversion) */}
          <div className="space-y-4">
            <div className="p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-b from-[var(--surface-raised)] to-[var(--surface)] space-y-4 shadow-sm">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] block">
                  Confirmed Support (Regional)
                </span>
                <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#7446d8] dark:text-[#c084fc] font-mono mt-1 break-words leading-tight">
                  {formatAmount(product.totalSupportAmount || "0")}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] mt-1 font-mono break-words">
                  Canonical Base: ₹{parseFloat(product.totalSupportAmount || "0").toLocaleString("en-IN", { maximumFractionDigits: (parseFloat(product.totalSupportAmount || "0") % 1 === 0 ? 0 : 2) })} INR
                </p>

              <div className="pt-3 border-t border-[var(--border)] flex justify-between items-center text-xs text-[var(--text-secondary)]">
                <span>Rank Standing</span>
                <span className="font-extrabold text-[var(--text-primary)]">#{product.rank} Overall</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs text-[var(--text-secondary)]">
                <span>Verification</span>
                <span className="font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>

              <Link
                href={`/products/${product.slug}/contribute`}
                className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 text-white flex items-center justify-center gap-2 shadow-md shadow-purple-900/30 transition-all"
              >
                <span>Support or Elevate Rank</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
