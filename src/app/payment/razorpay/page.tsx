"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import {
  CreditCard,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Lock,
  Globe,
  Crown,
  Trophy,
  ExternalLink,
  Layers,
} from "lucide-react";
import { useUserCurrency, convertDisplayToCanonical } from "@/lib/currency";

declare global {
  interface Window {
    Razorpay: any;
  }
}

function RazorpayPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { config } = useUserCurrency();

  // Distinguish whether this checkout is for a Product Bid vs a Sovereign Territory
  const rawTargetType = searchParams.get("targetType");
  const websiteUrl = searchParams.get("websiteUrl") || "";
  const productId = searchParams.get("productId") || "";
  const productDescription = searchParams.get("description") || "";
  const productLogoUrl = searchParams.get("logoUrl") || "";
  const productCategorySlug = searchParams.get("categorySlug") || "productivity";

  const isProduct =
    rawTargetType === "product" ||
    Boolean(productId) ||
    Boolean(websiteUrl);

  const targetType = isProduct ? "product" : (rawTargetType || "country");
  const targetName =
    searchParams.get("targetName") ||
    searchParams.get("name") ||
    (isProduct ? "Verified Product" : "Global Sovereign Backing");

  const countryCode = searchParams.get("countryCode") || searchParams.get("targetCode") || "";
  const returnUrl = searchParams.get("returnUrl") || (isProduct ? "/" : (countryCode ? `/global/${countryCode.toLowerCase()}` : "/global"));

  const rawAmount = searchParams.get("amount");
  const rawCurrency = searchParams.get("currency");

  const [amount, setAmount] = useState<string>(rawAmount || (isProduct ? "500" : "1000"));
  const [selectedCurrency, setSelectedCurrency] = useState<string>(rawCurrency || config.code || "INR");
  const [isSdkLoaded, setIsSdkLoaded] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successData, setSuccessData] = useState<{
    paymentId: string;
    orderId: string;
    productSlug?: string;
  } | null>(null);

  // Sync SDK if window.Razorpay is already present
  useEffect(() => {
    if (typeof window !== "undefined" && window.Razorpay) {
      setIsSdkLoaded(true);
    }
  }, []);

  async function handlePayWithRazorpay() {
    setErrorMessage("");
    const numericAmount = parseFloat(amount);
    if (!numericAmount || numericAmount <= 0) {
      setErrorMessage("Please enter a valid positive payment amount.");
      return;
    }

    if (!isSdkLoaded || !window.Razorpay) {
      setErrorMessage("Razorpay payment gateway SDK is loading. Please wait 2 seconds and try again.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Calculate canonical INR for global platform pool consistency
      const canonicalINR = selectedCurrency === "INR"
        ? numericAmount
        : convertDisplayToCanonical(numericAmount, selectedCurrency);

      // 2. Request backend to create official Razorpay order with test keys
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          currency: selectedCurrency,
          targetType,
          targetName,
          countryCode: isProduct ? "" : countryCode,
          canonicalINR,
        }),
      });

      if (!orderRes.ok) {
        const errJson = await orderRes.json();
        throw new Error(errJson.error || "Order creation failed.");
      }

      const orderData = await orderRes.json();

      // 3. Configure Razorpay modal options
      const options = {
        key: orderData.keyId || "rzp_test_TszCIAmcV6dfeg",
        amount: orderData.amount,
        currency: orderData.currency,
        name: isProduct ? "Outrank Product Leaderboard" : "Outrank Sovereign Territory",
        description: isProduct
          ? `Product rank bid for ${targetName}`
          : `Territorial contribution for ${targetName}`,
        image: "/icon.svg",
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify payment signature on backend
            const verifyRes = await fetch("/api/payments/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                targetType,
                targetName,
                countryCode: isProduct ? "" : countryCode,
                canonicalINR,
                chargedAmount: numericAmount,
                currency: selectedCurrency,
              }),
            });

            if (!verifyRes.ok) {
              const verifyErr = await verifyRes.json();
              throw new Error(verifyErr.error || "Payment signature verification failed.");
            }

            let createdSlug: string | undefined;

            // 5A. If PRODUCT BID: Record or elevate product in Database
            if (isProduct) {
              try {
                const claimRes = await fetch("/api/products/claim-bid", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    websiteUrl,
                    name: targetName,
                    description: productDescription,
                    logoUrl: productLogoUrl,
                    categorySlug: productCategorySlug,
                    productId,
                    bidAmount: numericAmount,
                    currency: selectedCurrency,
                    canonicalINR,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                  }),
                });

                if (claimRes.ok) {
                  const claimJson = await claimRes.json();
                  if (claimJson.product?.slug) {
                    createdSlug = claimJson.product.slug;
                  }
                }
              } catch (prodErr) {
                console.error("Product registration error:", prodErr);
              }
            } else {
              // 5B. If TERRITORIAL BACKING: Record unique territory transaction
              try {
                const txRaw = localStorage.getItem("outrank_territory_txs") || "[]";
                const txs = JSON.parse(txRaw);
                txs.push({
                  id: `rzp_${response.razorpay_payment_id}`,
                  provider: "razorpay",
                  targetType,
                  targetName,
                  countryCode,
                  canonicalINR,
                  chargedAmount: numericAmount,
                  currency: selectedCurrency,
                  timestamp: Date.now(),
                });
                localStorage.setItem("outrank_territory_txs", JSON.stringify(txs));

                const contribRaw = localStorage.getItem("outrank_territory_contributions") || "{}";
                const parsed = JSON.parse(contribRaw);
                const key = targetName || countryCode;
                parsed[key] = (parsed[key] || 0) + canonicalINR;
                if (countryCode && targetName && countryCode !== targetName) {
                  parsed[countryCode] = (parsed[countryCode] || 0) + canonicalINR;
                }
                localStorage.setItem("outrank_territory_contributions", JSON.stringify(parsed));
                window.dispatchEvent(new Event("storage"));
              } catch {}
            }

            setSuccessData({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              productSlug: createdSlug,
            });
            setIsProcessing(false);
          } catch (verErr: any) {
            setErrorMessage(verErr.message || "Payment verification failed.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: isProduct ? "Product Founder / Backer" : "Outrank Territory Backer",
          email: "founder@outrank.org",
          contact: "9876543210",
        },
        theme: {
          color: isProduct ? "#eab308" : "#7446d8",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (failResponse: any) {
        setErrorMessage(failResponse.error?.description || "Payment was declined or cancelled.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (err: any) {
      setErrorMessage(err.message || "Could not launch Razorpay gateway.");
      setIsProcessing(false);
    }
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsSdkLoaded(true)}
      />

      <div className="max-w-xl mx-auto py-8 px-4 space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={returnUrl}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {isProduct ? "Leaderboard" : targetName}</span>
          </Link>

          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            Razorpay Test Sandbox
          </span>
        </div>

        {/* Payment Card Container */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 shadow-xl space-y-6">
          {/* Header - Differentiated between Product Bid vs Territory Contribution */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {isProduct ? (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-amber-900/30">
                  <Crown className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7446d8] to-[#9333ea] flex items-center justify-center text-white shadow-md shadow-purple-900/30">
                  <Globe className="w-6 h-6" />
                </div>
              )}

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                    {isProduct ? "Product Rank Bidding" : "Territory Sovereign Contribution"}
                  </h1>
                </div>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  {isProduct
                    ? "Official Razorpay Gateway · Stake #1 Leaderboard Rank"
                    : "Official Razorpay Gateway · Sovereign Territory Elevation"}
                </p>
              </div>
            </div>
          </div>

          {/* Test Credentials Alert Box */}
          <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex items-center justify-between text-purple-600 dark:text-purple-300 font-bold">
              <span>Active Razorpay Test Key:</span>
              <span className="bg-purple-500/20 px-2 py-0.5 rounded font-mono text-[11px]">
                rzp_test_TszCIAmcV6dfeg
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Test mode active. Use card <strong className="text-[var(--text-primary)]">4242 4242 4242 4242</strong> with any future expiry &amp; CVV.
            </p>
          </div>

          {/* Target Summary - Purely Product OR Purely Territory (NO MERGING) */}
          {isProduct ? (
            /* PRODUCT BID SUMMARY */
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-amber-500/10">
                <span className="text-[11px] uppercase tracking-wider text-amber-500 font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Product Bidding Target
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400">
                  #1 Rank Stake
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Product Title:</span>
                <strong className="text-sm text-[var(--text-primary)] font-bold">{targetName}</strong>
              </div>

              {websiteUrl && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Verified URL:</span>
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-400 hover:underline flex items-center gap-1 max-w-[240px] truncate"
                  >
                    <span>{websiteUrl}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
              )}

              {productCategorySlug && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Platform Category:</span>
                  <span className="text-purple-300 font-bold uppercase">{productCategorySlug}</span>
                </div>
              )}
            </div>
          ) : (
            /* TERRITORY BACKING SUMMARY */
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between pb-1.5 border-b border-purple-500/10">
                <span className="text-[11px] uppercase tracking-wider text-purple-400 font-bold flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Territory Sovereign Backing
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300">
                  {targetType.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)]">Territory Name:</span>
                <strong className="text-sm text-[var(--text-primary)] font-bold">{targetName}</strong>
              </div>

              {countryCode && (
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)]">Territory ISO Code:</span>
                  <span className="text-[var(--text-primary)] font-bold">{countryCode}</span>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {successData ? (
            <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {isProduct ? "Product Bid Verified & Live on Leaderboard!" : "Territory Contribution Verified!"}
                </h3>
                <p className="text-xs font-mono text-[var(--text-muted)]">
                  {isProduct
                    ? `"${targetName}" has been staked and is now actively ranking on Outrank.`
                    : `Successfully credited contribution to ${targetName}.`}
                </p>
                <div className="pt-2 text-[11px] font-mono text-[var(--text-muted)] space-y-0.5">
                  <p>Payment ID: <strong className="text-[var(--text-primary)]">{successData.paymentId}</strong></p>
                  <p>Order ID: <strong className="text-[var(--text-primary)]">{successData.orderId}</strong></p>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => router.push(returnUrl)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-all shadow-md shadow-emerald-900/20 cursor-pointer"
                >
                  {isProduct ? "View Live Leaderboard" : "Return to Territory"}
                </button>
                <button
                  type="button"
                  onClick={() => setSuccessData(null)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-xs font-bold font-mono hover:bg-[var(--surface-raised)] transition-all cursor-pointer"
                >
                  Make Another Bid
                </button>
              </div>
            </div>
          ) : (
            /* Payment Input & Launch Button */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase font-mono tracking-wider text-[var(--text-secondary)]">
                  {isProduct ? "Product Bid Amount" : "Territory Contribution Amount"}
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="1"
                      step="any"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter bid amount"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-base font-bold font-mono text-[var(--text-primary)] focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-3.5 py-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs font-bold font-mono text-[var(--text-primary)] focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {!["INR", "USD", "EUR", "GBP", "AED", "CAD", "SGD"].includes(selectedCurrency) && (
                      <option value={selectedCurrency}>{selectedCurrency}</option>
                    )}
                    <option value="INR">₹ INR</option>
                    <option value="USD">$ USD</option>
                    <option value="EUR">€ EUR</option>
                    <option value="GBP">£ GBP</option>
                    <option value="AED">د.إ AED</option>
                    <option value="CAD">C$ CAD</option>
                    <option value="SGD">S$ SGD</option>
                  </select>
                </div>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Launch Gateway Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePayWithRazorpay}
                className={`w-full py-3.5 px-6 rounded-2xl font-black font-mono text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] ${
                  isProduct
                    ? "bg-gradient-to-r from-amber-600 via-purple-600 to-purple-700 hover:brightness-110 shadow-purple-900/30"
                    : "bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:from-[#673bc4] hover:to-[#8224dc] shadow-purple-900/30"
                }`}
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Launching Razorpay Gateway...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>
                      {isProduct
                        ? `Pay ${selectedCurrency} ${amount} & Claim Product Rank`
                        : `Back Territory (${selectedCurrency} ${amount}) via Razorpay`}
                    </span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[10px] text-[var(--text-muted)] font-mono">
                  Encrypted 256-bit TLS connection &middot; Razorpay Test Mode
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function RazorpayPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-xl mx-auto py-16 text-center text-xs font-mono text-[var(--text-muted)]">
          Loading Razorpay Payment Gateway...
        </div>
      }
    >
      <RazorpayPaymentContent />
    </Suspense>
  );
}
