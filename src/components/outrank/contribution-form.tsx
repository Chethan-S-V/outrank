"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MAX_CONTRIBUTION_AMOUNT, MIN_CONTRIBUTION_AMOUNT } from "@/lib/validations";
import { BidAmountControl } from "./bid-amount-control";
import { useUserCurrency } from "@/lib/currency";
import { Sparkles, ArrowRight, Lock } from "lucide-react";

type ContributionFormProps = {
  productId: string;
  productName: string;
  totalSupportAmount: string;
};

const maximum = Number(MAX_CONTRIBUTION_AMOUNT);
const minimum = Number(MIN_CONTRIBUTION_AMOUNT);

export function ContributionForm({
  productId,
  productName,
  totalSupportAmount,
}: ContributionFormProps) {
  const router = useRouter();
  const { config, currency, formatAmount, convertDisplayToCanonical } = useUserCurrency();
  const [amount, setAmount] = useState(config.code === "INR" ? 1000 : 25);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Navigate directly to Official Razorpay Checkout
  function handleRazorpayPayment() {
    const canonicalINR = convertDisplayToCanonical(amount);

    const queryParams = new URLSearchParams({
      targetType: "product",
      targetName: productName,
      productId,
      name: productName,
      amount: String(amount),
      currency: config.code || "INR",
      canonicalAmountINR: String(canonicalINR),
      returnUrl: typeof window !== "undefined" ? window.location.pathname.replace("/contribute", "") : "/",
    });

    router.push(`/payment/razorpay?${queryParams.toString()}`);
  }

  return (
    <section className="outrank-contribution-form border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 rounded-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Contribute to this product</h2>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold">
          Regional Currency Active
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-[var(--text-secondary)] font-semibold block">Your Contribution:</span>
          <span className="text-[11px] font-mono text-[var(--text-muted)] block mt-0.5">
            Credits ≈ ₹{convertDisplayToCanonical(amount).toLocaleString()} INR to sovereign rank
          </span>
        </div>
        <BidAmountControl
          amount={amount}
          max={maximum}
          min={minimum}
          onChange={setAmount}
        />
      </div>

      <dl className="grid grid-cols-2 gap-4 text-xs">
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <dt className="text-[var(--text-muted)] font-medium">Product</dt>
          <dd className="font-bold text-[var(--text-primary)] mt-0.5 truncate">{productName}</dd>
        </div>
        <div className="p-3 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)]">
          <dt className="text-[var(--text-muted)] font-medium">Current Confirmed</dt>
          <dd className="font-bold text-[#7446d8] dark:text-[#c084fc] font-mono mt-0.5">
            {formatAmount(totalSupportAmount)}
          </dd>
        </div>
      </dl>

      {/* Official Razorpay Gateway Checkout */}
      <div className="space-y-3 pt-2">
        <button
          className="w-full py-3.5 px-5 rounded-2xl font-bold text-xs text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 active:scale-98 shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          onClick={handleRazorpayPayment}
          type="button"
        >
          <Lock className="w-4 h-4" />
          <span>Pay with Razorpay ({config.symbol}{amount.toLocaleString()} {config.code})</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {message ? (
        <p aria-live="polite" className="text-xs text-purple-400 font-medium text-center">
          {message}
        </p>
      ) : null}
    </section>
  );
}
