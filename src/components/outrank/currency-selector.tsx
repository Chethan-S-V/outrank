"use client";

import { useState, useRef, useEffect } from "react";
import { useUserCurrency, CURRENCY_CONFIGS, SupportedCurrency } from "@/lib/currency";
import { Globe, Check, ChevronDown } from "lucide-react";
import { CountryFlag } from "./country-flag";

export function CurrencySelector() {
  const { currency, setCurrency, isMounted, config } = useUserCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-xs text-[var(--text-muted)] font-mono">
        <Globe className="w-3.5 h-3.5" />
        <span>USD $</span>
      </div>
    );
  }

  const currencies = Object.keys(CURRENCY_CONFIGS) as SupportedCurrency[];

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-hover)] text-xs font-mono font-bold text-[var(--text-primary)] transition-all shadow-xs"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Change Display Currency & Region"
      >
        <CountryFlag code={config.countryCode || "IN"} size="xs" />
        <span>{config.code}</span>
        <span className="text-[var(--accent)]">{config.symbol}</span>
        <ChevronDown className={`w-3 h-3 text-[var(--text-muted)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 font-sans">
          <div className="px-3 py-1.5 border-b border-[var(--border)] text-[11px] font-mono font-bold text-[var(--text-muted)]">
            DISPLAY REGION &amp; CURRENCY
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {currencies.map((code) => {
              const meta = CURRENCY_CONFIGS[code];
              const isSelected = code === currency;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setCurrency(code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-purple-500/10 text-[var(--accent)] font-bold"
                      : "text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CountryFlag code={meta.countryCode || "IN"} size="xs" />
                    <span className="font-bold">{meta.code}</span>
                    <span className="text-slate-400 font-mono">({meta.symbol})</span>
                  </div>
                  {isSelected ? (
                    <Check className="w-3.5 h-3.5 text-[var(--accent)]" />
                  ) : (
                    <span className="text-[10px] text-slate-500 truncate max-w-[80px]">
                      {meta.name.split(" ")[0]}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
