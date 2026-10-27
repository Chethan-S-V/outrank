"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Link2, ArrowRight } from "lucide-react";
import { MAX_CONTRIBUTION_AMOUNT } from "@/lib/validations/contribution";
import { websiteUrlSchema } from "@/lib/validations/product-submission";
import type { ProductSubmissionCategory } from "@/types";
import { BidAmountControl } from "./bid-amount-control";
import { ClaimPeriodToggle, type ClaimPeriod } from "./claim-period-toggle";
import { ClaimRankVisual } from "./claim-rank-visual";
import { useUserCurrency } from "@/lib/currency";

type ClaimRankHeroProps = {
  categories: readonly ProductSubmissionCategory[];
  categoriesUnavailable: boolean;
  topSupportAmount?: number;
  period?: ClaimPeriod;
  onPeriodChange?: (period: ClaimPeriod) => void;
};

export function ClaimRankHero({
  categories,
  categoriesUnavailable,
  topSupportAmount = 0,
  period: externalPeriod,
  onPeriodChange,
}: ClaimRankHeroProps) {
  const router = useRouter();
  const {
    config,
    currency,
    convertCanonicalToDisplay,
    convertDisplayToCanonical,
  } = useUserCurrency();

  const [internalPeriod, setInternalPeriod] = useState<ClaimPeriod>("all-time");
  const effectivePeriod = externalPeriod ?? internalPeriod;
  const handlePeriodChange = (newPeriod: ClaimPeriod) => {
    if (onPeriodChange) onPeriodChange(newPeriod);
    else setInternalPeriod(newPeriod);

    if (newPeriod === "today") {
      setBidAmount(config.code === "INR" ? 500 : 10);
    } else {
      setBidAmount(initialDisplayBid);
    }
  };

  const [productUrl, setProductUrl] = useState("");

  // Calculate initial bid in user's detected regional currency from Canonical INR
  const displayTop = convertCanonicalToDisplay(topSupportAmount) || 0;
  const initialDisplayBid = displayTop > 0
    ? Math.ceil(displayTop + (config.code === "INR" ? 100 : 5))
    : (config.code === "INR" ? 500 : 10);
  const [bidAmount, setBidAmount] = useState(
    effectivePeriod === "today" ? (config.code === "INR" ? 500 : 10) : initialDisplayBid
  );

  // Recalculate bid amount ONLY when visitor's currency actually changes
  const prevCurrencyRef = useRef(config.code);
  useEffect(() => {
    if (prevCurrencyRef.current !== config.code) {
      prevCurrencyRef.current = config.code;
      const converted = convertCanonicalToDisplay(topSupportAmount);
      if (converted) {
        setBidAmount(Math.ceil(converted + (config.code === "INR" ? 1000 : 10)));
      }
    }
  }, [config.code, topSupportAmount, convertCanonicalToDisplay]);

  const [claimMessage, setClaimMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingProductData, setExistingProductData] = useState<{
    id: string;
    name: string;
    slug: string;
    totalSupportAmount: string;
  } | null>(null);

  // Auto-scraped metadata state
  const [scrapedData, setScrapedData] = useState<{
    name: string;
    description: string;
    logoUrl: string | null;
    twitterHandle?: string | null;
    suggestedCategorySlug?: string;
  } | null>(null);

  const normalizedUrl = useMemo(() => {
    let clean = productUrl.trim();
    if (clean.startsWith("@")) {
      clean = `https://twitter.com/${clean.slice(1)}`;
    } else if (clean.startsWith("instagram.com/") || clean.startsWith("www.instagram.com/")) {
      clean = `https://${clean}`;
    } else if (clean && !clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    const result = websiteUrlSchema.safeParse(clean);
    return result.success ? result.data : null;
  }, [productUrl]);

  async function triggerMetadataScrape(url: string) {
    if (!url || (!url.includes(".") && !url.startsWith("@"))) return;
    try {
      const res = await fetch("/api/metadata/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (res.ok) {
        const data = await res.json();
        setScrapedData(data);
        if (data.isExisting && data.existingProduct) {
          setExistingProductData(data.existingProduct);
        }
      }
    } catch {
      // Background scrape fails gracefully
    }
  }

  async function handleClaim() {
    setExistingProductData(null);

    if (!productUrl.trim()) {
      setClaimMessage("Please enter your website URL, Instagram user, or @profile link.");
      return;
    }

    if (!normalizedUrl) {
      setClaimMessage("Please enter a valid link (e.g. instagram.com/username or yoursite.com).");
      return;
    }

    setIsSubmitting(true);
    setClaimMessage("Verifying URL and inspecting live metadata in backend...");

    try {
      // Check real URL existence and duplicate registration
      const res = await fetch("/api/metadata/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: normalizedUrl }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        setClaimMessage(
          errData?.error || "Could not reach this URL. Please verify the URL exists and is online."
        );
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();

      // Rule: Existing URL cannot be entered again as duplicate
      if (data.isExisting && data.existingProduct) {
        setExistingProductData(data.existingProduct);
        setClaimMessage(
          `⚠️ "${data.existingProduct.name}" is already ranked on Outrank! You cannot submit a duplicate URL.`
        );
        setIsSubmitting(false);
        return;
      }

      // Success: Navigate to dedicated Preview & Customization Page
      setClaimMessage("URL verified! Opening customization preview...");

      const queryParams = new URLSearchParams({
        websiteUrl: data.normalizedUrl || normalizedUrl,
        name: data.name || "Product Showcase",
        description: data.description || "Verified showcase ranking on Outrank.",
        logoUrl: data.logoUrl || "",
        categorySlug: data.suggestedCategorySlug || "coding-dev-tools",
        twitterHandle: data.twitterHandle || "",
        amount: String(bidAmount),
      });

      router.push(`/claim/preview?${queryParams.toString()}`);
    } catch {
      setClaimMessage("Network error verifying link. Please check your connection and retry.");
      setIsSubmitting(false);
    }
  }

  return (
    <section aria-labelledby="claim-rank-title" className="outrank-claim-hero">
      <div className="outrank-claim-content">
        <ClaimPeriodToggle onChange={handlePeriodChange} period={effectivePeriod} />

        <div className="outrank-claim-title-row flex flex-col items-start gap-3 sm:gap-4 my-4 sm:my-5">
          <h1 id="claim-rank-title" className="text-slate-950 dark:text-white m-0 leading-tight">
            <span
              className="outrank-claim-title-text font-black tracking-tight select-none block text-4xl sm:text-5xl lg:text-[54px] leading-tight"
              style={{ color: "var(--claim-title-color, #0f172a)" }}
            >
              {effectivePeriod === "today" ? "Claim Today's #1 for" : "Claim #1 for"}
            </span>
          </h1>

          <div className="flex items-center">
            <BidAmountControl
              amount={bidAmount}
              max={Number(MAX_CONTRIBUTION_AMOUNT)}
              min={1}
              onChange={setBidAmount}
            />
          </div>
        </div>

        <form
          className="outrank-claim-form space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleClaim();
          }}
        >
          {/* Main URL Input Row — High-contrast dual theme styling, widened layout with crisp 'Paste URL' placeholder */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-4xl lg:max-w-5xl">
            <div className="flex-1 flex items-center px-4 py-3.5 rounded-2xl bg-white dark:bg-white/[0.08] hover:bg-slate-50/80 dark:hover:bg-white/[0.12] focus-within:bg-white dark:focus-within:bg-white/[0.14] border-2 border-purple-300 dark:border-white/20 focus-within:border-purple-600 dark:focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-500/15 shadow-md shadow-purple-500/5 transition-all">
              <Link2 className="w-5 h-5 text-purple-700 dark:text-purple-300 mr-3 shrink-0" aria-hidden="true" />
              <input
                aria-invalid={productUrl.length > 0 && !normalizedUrl}
                autoComplete="url"
                id="claim-product-url"
                name="productUrl"
                onChange={(event) => {
                  const val = event.target.value;
                  setProductUrl(val);
                  setClaimMessage("");
                  if (val.length > 7 && (val.includes(".") || val.startsWith("@"))) {
                    void triggerMetadataScrape(val);
                  }
                }}
                onPaste={(event) => {
                  const pasted = event.clipboardData.getData("text");
                  if (pasted) {
                    void triggerMetadataScrape(pasted);
                  }
                }}
                onBlur={() => {
                  if (productUrl) void triggerMetadataScrape(productUrl);
                }}
                placeholder="Paste URL"
                type="text"
                value={productUrl}
                className="outrank-clean-url-input w-full bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-sm sm:text-base text-slate-950 dark:text-white placeholder:text-slate-600 dark:placeholder:text-purple-200/70 font-medium"
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                  background: "transparent",
                }}
              />
            </div>

            <button
              className="shrink-0 flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 active:scale-95 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
              disabled={isSubmitting}
              type="submit"
            >
              <span>{isSubmitting ? "Verifying URL..." : "Claim Rank"}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {/* Duplicate Product Alert Banner */}
          {existingProductData ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-amber-400">"{existingProductData.name}"</span>
                <span>is already on the leaderboard. Existing URLs cannot be re-registered as duplicates.</span>
              </div>
              <Link
                href={`/products/${existingProductData.slug}/contribute`}
                className="shrink-0 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors shadow-sm"
              >
                Boost Rank Instead &rarr;
              </Link>
            </div>
          ) : null}

          {claimMessage && !existingProductData ? (
            <p className="text-xs text-purple-300 font-medium pt-1 animate-in fade-in">
              {claimMessage}
            </p>
          ) : null}
        </form>
      </div>

      <ClaimRankVisual />
    </section>
  );
}
