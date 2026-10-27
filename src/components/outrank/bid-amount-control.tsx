"use client";

import { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import { useUserCurrency } from "@/lib/currency";

type BidAmountControlProps = {
  amount: number;
  max?: number;
  min?: number;
  onChange: (amount: number) => void;
};

const ONE_TRILLION = 1_000_000_000_000;

function getIncrement(amount: number) {
  if (amount >= 100_000_000_000) return 5_000_000_000;
  if (amount >= 10_000_000_000) return 500_000_000;
  if (amount >= 1_000_000_000) return 50_000_000;
  if (amount >= 100_000_000) return 5_000_000;
  if (amount >= 10_000_000) return 500_000;
  if (amount >= 1_000_000) return 50_000;
  if (amount >= 100_000) return 10_000;
  if (amount >= 10_000) return 1_000;
  if (amount >= 1_000) return 100;
  return 10;
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(amount);
}

export function BidAmountControl({
  amount,
  max = ONE_TRILLION,
  min = 1,
  onChange,
}: BidAmountControlProps) {
  const { config, isMounted } = useUserCurrency();
  const [isFocused, setIsFocused] = useState(false);
  const [rawText, setRawText] = useState(formatAmount(amount));

  const effectiveMax = Math.min(max, ONE_TRILLION);

  useEffect(() => {
    if (!isFocused) {
      setRawText(formatAmount(amount));
    }
  }, [amount, isFocused]);

  function commitValue(valStr: string) {
    // Only numbers allowed
    const digitsOnly = valStr.replace(/[^0-9]/g, "");
    if (!digitsOnly) {
      onChange(min);
      setRawText(formatAmount(min));
      return;
    }
    const parsed = parseInt(digitsOnly, 10);
    const valid = Number.isFinite(parsed)
      ? Math.min(effectiveMax, Math.max(min, parsed))
      : min;
    onChange(valid);
    setRawText(formatAmount(valid));
  }

  const increment = getIncrement(amount);
  const displayLength = Math.max(1, (rawText || "0").length);
  const symbol = isMounted ? config.symbol : "₹";

  // Font sizing when placed down on its own row below "Claim #1 for" — scaled smaller than heading
  const getFontSizeClass = () => {
    if (displayLength > 11) return "text-lg sm:text-xl md:text-2xl";
    if (displayLength > 8) return "text-xl sm:text-2xl md:text-[28px]";
    return "text-2xl sm:text-3xl";
  };

  return (
    <div className="outrank-bid-control inline-flex items-center gap-1.5 sm:gap-2 bg-transparent border-0 p-0 m-0 shadow-none align-middle select-none">
      {/* Minus Button — Clean unboxed glyph */}
      <button
        aria-label="Decrease bid"
        disabled={amount <= min}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const next = Math.max(min, amount - increment);
          onChange(next);
          setRawText(formatAmount(next));
        }}
        type="button"
        className="text-purple-600 hover:text-purple-700 dark:text-[#c084fc] dark:hover:text-purple-200 active:scale-90 disabled:opacity-20 transition-all flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0 outline-none shadow-none shrink-0"
      >
        <Minus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" aria-hidden="true" />
      </button>

      {/* Proportional Number Input with Balanced Currency Symbol — Auto-sized with 0 empty distance */}
      <div
        className={`inline-flex items-center font-black text-[#7e22ce] dark:text-[#c084fc] ${getFontSizeClass()} tracking-tight bg-transparent border-0 p-0 m-0 select-none shrink-0`}
      >
        <span aria-hidden="true" className="mr-0.5 select-none font-bold text-[0.85em] opacity-90 leading-none">
          {symbol}
        </span>

        {/* Ghost-span container: auto-fits the exact pixel width of the text so '+' is never distanced */}
        <span className="inline-grid [grid-template-columns:min-content] items-center">
          <span
            className={`invisible row-start-1 col-start-1 p-0 m-0 font-mono font-black select-none pointer-events-none whitespace-pre ${getFontSizeClass()}`}
            aria-hidden="true"
          >
            {rawText || "0"}
          </span>
          <input
            aria-label="Bid amount in regional currency"
            inputMode="numeric"
            pattern="[0-9,]*"
            onFocus={() => {
              setIsFocused(true);
              setRawText(formatAmount(amount));
            }}
            onBlur={() => {
              setIsFocused(false);
              commitValue(rawText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
              }
            }}
            onChange={(e) => {
              // Strictly allow only numeric digits 0-9 up to 13 digits (1 trillion)
              const clean = e.target.value.replace(/[^0-9]/g, "");
              if (!clean) {
                setRawText("");
                onChange(min);
                return;
              }
              if (clean.length <= 13) {
                const num = Math.min(effectiveMax, parseInt(clean, 10));
                if (Number.isFinite(num)) {
                  setRawText(formatAmount(num));
                  onChange(Math.max(min, num));
                }
              }
            }}
            style={{
              fieldSizing: "content" as React.CSSProperties["fieldSizing"],
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              padding: 0,
              margin: 0,
            }}
            type="text"
            value={rawText}
            className={`row-start-1 col-start-1 w-full bg-transparent text-left border-0 outline-none focus:outline-none focus:ring-0 text-[#7e22ce] dark:text-[#c084fc] font-black font-mono p-0 m-0 ${getFontSizeClass()}`}
          />
        </span>
      </div>

      {/* Plus Button — Placed right next to the value without distance */}
      <button
        aria-label="Increase bid"
        disabled={amount >= effectiveMax}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          const next = Math.min(effectiveMax, amount + increment);
          onChange(next);
          setRawText(formatAmount(next));
        }}
        type="button"
        className="text-purple-600 hover:text-purple-700 dark:text-[#c084fc] dark:hover:text-purple-200 active:scale-90 disabled:opacity-20 transition-all flex items-center justify-center cursor-pointer bg-transparent border-0 p-0 m-0 outline-none shadow-none shrink-0"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" aria-hidden="true" />
      </button>
    </div>
  );
}
