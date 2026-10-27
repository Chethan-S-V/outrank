"use client";

import { useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { GLOBAL_CURRENCY_RECORDS, type GlobalCurrencyRecord } from "./currency-registry";

export type SupportedCurrency = string;

export const CANONICAL_CURRENCY: SupportedCurrency = "INR";

export interface CurrencyConfig {
  code: SupportedCurrency;
  symbol: string;
  name: string;
  decimals: number;
  countryCode: string;
  flag: string;
}

export const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = Object.fromEntries(
  Object.values(GLOBAL_CURRENCY_RECORDS).map((rec) => [
    rec.code,
    {
      code: rec.code,
      symbol: rec.symbol,
      name: rec.name,
      decimals: rec.decimals,
      countryCode: rec.countryCode,
      flag: rec.flag,
    },
  ])
);

// Fallback rates from 1 INR to Target Currency (1 INR = baseline foreign units)
export const FALLBACK_INR_RATES: Record<string, number> = Object.fromEntries(
  Object.values(GLOBAL_CURRENCY_RECORDS).map((rec) => [rec.code, rec.baselineRateFromINR])
);

// Global in-memory cache for live exchange rates
let activeRates: Record<string, number> = { ...FALLBACK_INR_RATES };
let ratesTimestamp: string = new Date().toISOString();
let isFetchingRates = false;

async function syncLiveExchangeRates() {
  if (isFetchingRates) return;
  isFetchingRates = true;

  try {
    const res = await fetch("/api/public/exchange-rates");
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        activeRates = { ...activeRates, ...data.rates };
        ratesTimestamp = data.timestamp || new Date().toISOString();
        notifyCurrencyListeners();
      }
    }
  } catch {
    // Keep fallback rates
  } finally {
    isFetchingRates = false;
  }
}

/**
 * Detect user's region currency based on browser timezone and locale
 */
export function detectUserCurrency(): SupportedCurrency {
  if (typeof window === "undefined") return "INR";

  try {
    const stored = localStorage.getItem("outrank_preferred_currency");
    if (stored && CURRENCY_CONFIGS[stored]) {
      return stored;
    }

    // Exact India Timezone Offset (+05:30 is -330 mins in JS Date)
    const offset = new Date().getTimezoneOffset();
    if (offset === -330) {
      return "INR";
    }

    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "").toLowerCase();
    const locale = (navigator.language || "").toLowerCase();

    // India region detection
    if (
      tz.includes("kolkata") ||
      tz.includes("calcutta") ||
      tz.includes("delhi") ||
      tz.includes("mumbai") ||
      tz.includes("chennai") ||
      tz.includes("india") ||
      tz.includes("ist") ||
      locale.includes("-in") ||
      locale.includes("hi") ||
      locale.includes("kn") ||
      locale.includes("ta") ||
      locale.includes("te") ||
      locale.includes("mr") ||
      locale.includes("gu") ||
      locale.includes("bn")
    ) {
      return "INR";
    }

    // United Kingdom
    if (tz.includes("london") || locale.includes("-gb") || locale.includes("en-gb")) {
      return "GBP";
    }

    // Europe (Eurozone)
    if (
      tz.startsWith("europe/") &&
      (tz.includes("berlin") ||
        tz.includes("paris") ||
        tz.includes("rome") ||
        tz.includes("madrid") ||
        tz.includes("amsterdam") ||
        tz.includes("brussels") ||
        tz.includes("vienna") ||
        tz.includes("dublin") ||
        tz.includes("lisbon") ||
        tz.includes("helsinki") ||
        tz.includes("athens"))
    ) {
      return "EUR";
    }

    // Switzerland
    if (tz.includes("zurich") || locale.includes("de-ch")) {
      return "CHF";
    }

    // UAE / Middle East
    if (tz.includes("dubai") || locale.includes("ar-ae")) {
      return "AED";
    }
    if (tz.includes("riyadh") || locale.includes("ar-sa")) {
      return "SAR";
    }
    if (tz.includes("qatar") || locale.includes("ar-qa")) {
      return "QAR";
    }
    if (tz.includes("kuwait") || locale.includes("ar-kw")) {
      return "KWD";
    }
    if (tz.includes("bahrain") || locale.includes("ar-bh")) {
      return "BHD";
    }
    if (tz.includes("muscat") || locale.includes("ar-om")) {
      return "OMR";
    }

    // East & Southeast Asia
    if (tz.includes("singapore") || locale.includes("en-sg")) {
      return "SGD";
    }
    if (tz.includes("tokyo") || locale.includes("ja")) {
      return "JPY";
    }
    if (tz.includes("seoul") || locale.includes("ko")) {
      return "KRW";
    }
    if (tz.includes("shanghai") || tz.includes("beijing") || locale.includes("zh-cn")) {
      return "CNY";
    }
    if (tz.includes("hong_kong") || locale.includes("zh-hk")) {
      return "HKD";
    }
    if (tz.includes("taipei") || locale.includes("zh-tw")) {
      return "TWD";
    }
    if (tz.includes("bangkok") || locale.includes("th")) {
      return "THB";
    }
    if (tz.includes("kuala_lumpur") || locale.includes("ms-my")) {
      return "MYR";
    }
    if (tz.includes("jakarta") || locale.includes("id")) {
      return "IDR";
    }
    if (tz.includes("manila") || locale.includes("fil") || locale.includes("en-ph")) {
      return "PHP";
    }
    if (tz.includes("ho_chi_minh") || locale.includes("vi")) {
      return "VND";
    }

    // South Asia
    if (tz.includes("dhaka") || locale.includes("bn-bd")) {
      return "BDT";
    }
    if (tz.includes("karachi") || locale.includes("ur-pk")) {
      return "PKR";
    }
    if (tz.includes("colombo") || locale.includes("si-lk")) {
      return "LKR";
    }
    if (tz.includes("kathmandu") || locale.includes("ne-np")) {
      return "NPR";
    }

    // Australia & Oceania
    if (tz.includes("sydney") || tz.includes("melbourne") || tz.includes("brisbane") || tz.includes("perth") || locale.includes("en-au")) {
      return "AUD";
    }
    if (tz.includes("auckland") || locale.includes("en-nz")) {
      return "NZD";
    }

    // Canada
    if (tz.includes("toronto") || tz.includes("vancouver") || tz.includes("montreal") || locale.includes("en-ca")) {
      return "CAD";
    }

    // Latin America
    if (tz.includes("sao_paulo") || locale.includes("pt-br")) {
      return "BRL";
    }
    if (tz.includes("mexico_city") || locale.includes("es-mx")) {
      return "MXN";
    }
    if (tz.includes("buenos_aires") || locale.includes("es-ar")) {
      return "ARS";
    }
    if (tz.includes("bogota") || locale.includes("es-co")) {
      return "COP";
    }
    if (tz.includes("santiago") || locale.includes("es-cl")) {
      return "CLP";
    }

    // Africa
    if (tz.includes("johannesburg") || locale.includes("en-za")) {
      return "ZAR";
    }
    if (tz.includes("lagos") || locale.includes("en-ng")) {
      return "NGN";
    }
    if (tz.includes("nairobi") || locale.includes("sw-ke") || locale.includes("en-ke")) {
      return "KES";
    }
    if (tz.includes("cairo") || locale.includes("ar-eg")) {
      return "EGP";
    }

    // United States (comprehensive America/ & US/ coverage)
    const isUSZone =
      tz.startsWith("us/") ||
      (tz.startsWith("america/") &&
        !tz.includes("toronto") &&
        !tz.includes("vancouver") &&
        !tz.includes("montreal") &&
        !tz.includes("edmonton") &&
        !tz.includes("winnipeg") &&
        !tz.includes("halifax") &&
        !tz.includes("sao_paulo") &&
        !tz.includes("mexico") &&
        !tz.includes("buenos_aires") &&
        !tz.includes("bogota") &&
        !tz.includes("santiago") &&
        !tz.includes("lima") &&
        !tz.includes("caracas"));

    if (
      isUSZone ||
      tz === "est" ||
      tz === "cst" ||
      tz === "mst" ||
      tz === "pst" ||
      locale.includes("en-us") ||
      locale.includes("es-us") ||
      (locale.startsWith("en") && offset >= 240 && offset <= 600) // UTC-4 to UTC-10
    ) {
      return "USD";
    }

    // Default to canonical currency
    return "INR";
  } catch {
    return "INR";
  }
}

let currentCurrency: SupportedCurrency = typeof window !== "undefined" ? detectUserCurrency() : "INR";
const listeners = new Set<() => void>();

function notifyCurrencyListeners() {
  listeners.forEach((listener) => listener());
}

export function setGlobalCurrency(curr: SupportedCurrency) {
  if (!CURRENCY_CONFIGS[curr]) return;
  currentCurrency = curr;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("outrank_preferred_currency", curr);
      document.cookie = `outrank_country_override=${curr}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  }
  notifyCurrencyListeners();
}

/**
 * Format a canonical INR amount into the target display currency.
 * NEVER copy numeric amounts without exchange-rate conversion!
 */
export function formatCanonicalAmount(
  canonicalINR: number | string,
  targetCurrency?: SupportedCurrency
): string {
  const numINR = typeof canonicalINR === "string" ? parseFloat(canonicalINR || "0") : canonicalINR;
  if (isNaN(numINR) || numINR < 0) return "₹0";

  const target = targetCurrency || currentCurrency || "USD";
  const config = CURRENCY_CONFIGS[target] || CURRENCY_CONFIGS.INR;
  const rate = activeRates[target] || FALLBACK_INR_RATES[target] || 1;

  const converted = numINR * rate;

  try {
    const hasFractions = converted % 1 !== 0;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: config.code,
      minimumFractionDigits: hasFractions ? Math.min(2, config.decimals) : 0,
      maximumFractionDigits: hasFractions ? config.decimals : 0,
    }).format(converted);
    return formatted.replace(/\.00$/, "").replace(/,00$/, "");
  } catch {
    const hasFractions = converted % 1 !== 0;
    const decimals = hasFractions ? config.decimals : 0;
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(converted * factor) / factor;
    return `${config.symbol}${rounded.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`.replace(/\.00$/, "").replace(/,00$/, "");
  }
}

/**
 * Convert user's entered display amount into canonical INR.
 */
export function convertDisplayToCanonical(
  displayAmount: number | string,
  displayCurrency?: SupportedCurrency
): number {
  const num = typeof displayAmount === "string" ? parseFloat(displayAmount || "0") : displayAmount;
  if (isNaN(num) || num <= 0) return 0;

  const curr = displayCurrency || currentCurrency || "USD";
  if (curr === "INR") {
    return Math.round(num * 100) / 100;
  }

  const rate = activeRates[curr] || FALLBACK_INR_RATES[curr] || 1;
  const canonicalINR = num / rate;
  return Math.round(canonicalINR * 100) / 100;
}

/**
 * Convert canonical INR into the numeric value in the target currency
 */
export function convertCanonicalToDisplay(
  canonicalINR: number | string,
  targetCurrency?: SupportedCurrency
): number {
  const numINR = typeof canonicalINR === "string" ? parseFloat(canonicalINR || "0") : canonicalINR;
  if (isNaN(numINR) || numINR <= 0) return 0;

  const target = targetCurrency || currentCurrency || "USD";
  const config = CURRENCY_CONFIGS[target] || CURRENCY_CONFIGS.INR;
  const rate = activeRates[target] || FALLBACK_INR_RATES[target] || 1;

  const converted = numINR * rate;
  const factor = Math.pow(10, config.decimals);
  return Math.round(converted * factor) / factor;
}

/**
 * React hook to observe and format currency with real exchange rates
 */
export function useUserCurrency() {
  const [isMounted, setIsMounted] = useState(false);

  const subscribe = (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  };

  const getSnapshot = () => currentCurrency;
  const getServerSnapshot = () => "INR";

  const currency = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    setIsMounted(true);
    void syncLiveExchangeRates();

    // Network & geo auto-detection for user's local currency
    try {
      if (!localStorage.getItem("outrank_preferred_currency")) {
        fetch("/api/public/geo")
          .then((r) => r.json())
          .then((data) => {
            if (data?.suggestedCurrency && CURRENCY_CONFIGS[data.suggestedCurrency]) {
              setGlobalCurrency(data.suggestedCurrency);
            }
          })
          .catch(() => {});
      }
    } catch {}
  }, []);

  const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.INR;
  const rateFromINR = activeRates[currency] || FALLBACK_INR_RATES[currency] || 1;

  const convertCanonicalToDisplayCb = useCallback(
    (inr: number | string) => convertCanonicalToDisplay(inr, currency),
    [currency]
  );

  const convertDisplayToCanonicalCb = useCallback(
    (amt: number | string) => convertDisplayToCanonical(amt, currency),
    [currency]
  );

  const formatAmountCb = useCallback(
    (inr: number | string) => formatCanonicalAmount(inr, currency),
    [currency]
  );

  return {
    currency,
    config,
    rateFromINR,
    ratesTimestamp,
    isMounted,
    setCurrency: setGlobalCurrency,
    formatAmount: formatAmountCb,
    convertCanonicalToDisplay: convertCanonicalToDisplayCb,
    convertDisplayToCanonical: convertDisplayToCanonicalCb,
  };
}

export function formatRegionalCurrency(
  canonicalINR: number | string,
  targetCurrency?: SupportedCurrency
): string {
  return formatCanonicalAmount(canonicalINR, targetCurrency);
}

/**
 * Convenient alias and helper for regional currency formatting
 */
export function useRegionalCurrency() {
  const userCurr = useUserCurrency();
  return {
    ...userCurr,
    formatRegionalAmount: (canonicalOrDisplayAmount: number | string) => {
      // In Outrank, prices are stored canonically in INR. If number is passed, format via canonical amount.
      return userCurr.formatAmount(canonicalOrDisplayAmount);
    },
  };
}
