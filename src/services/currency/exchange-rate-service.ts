import {
  GLOBAL_CURRENCY_RECORDS,
  type GlobalCurrencyRecord,
  type CurrencyGroup,
} from "@/lib/currency-registry";

export type SupportedCurrency = string;

export const CANONICAL_CURRENCY = "INR";

export type CurrencyMetadata = GlobalCurrencyRecord;

export const CURRENCY_REGISTRY: Record<string, CurrencyMetadata> = GLOBAL_CURRENCY_RECORDS;

export interface ExchangeRateQuote {
  baseCurrency: "INR";
  targetCurrency: SupportedCurrency;
  rate: number; // 1 INR in target currency
  inverseRate: number; // 1 Target Currency in INR
  timestamp: string;
  source: string;
  isFallback: boolean;
}

export interface RatesSnapshot {
  base: "INR";
  rates: Record<string, number>; // 1 INR in target
  inverseRates: Record<string, number>; // 1 Target in INR
  timestamp: string;
  source: string;
  isStale: boolean;
  providerStatus: "online" | "fallback" | "cached";
}

// Complete baseline fallback rates from global currency registry (1 INR -> Target)
export const FALLBACK_INR_RATES: Record<string, number> = Object.fromEntries(
  Object.values(GLOBAL_CURRENCY_RECORDS).map((rec) => [rec.code, rec.baselineRateFromINR])
);

let cachedSnapshot: RatesSnapshot | null = null;
let lastFetchAttemptTime = 0;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const MAX_STALE_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Validate rate is sane (positive, not infinite, within 10x deviation of fallback)
 */
function isRateValid(curr: string, rate: number): boolean {
  if (typeof rate !== "number" || isNaN(rate) || !isFinite(rate) || rate <= 0) {
    return false;
  }
  const benchmark = FALLBACK_INR_RATES[curr];
  if (!benchmark) return true;
  const ratio = rate / benchmark;
  return ratio >= 0.05 && ratio <= 20.0; // Reasonable currency volatility tolerance
}

/**
 * Fetch rates from open central bank / FX provider with INR base
 */
async function fetchLiveRates(): Promise<RatesSnapshot> {
  const now = new Date();
  const rates: Record<string, number> = { ...FALLBACK_INR_RATES };
  const inverseRates: Record<string, number> = {};

  let providerStatus: "online" | "fallback" = "fallback";
  let source = "Static Central Bank Baseline";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch("https://open.er-api.com/v6/latest/INR", {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = (await res.json()) as {
        result?: string;
        rates?: Record<string, number>;
        time_last_update_utc?: string;
      };

      if (data.rates) {
        for (const curr of Object.keys(FALLBACK_INR_RATES)) {
          const remoteRate = data.rates[curr];
          if (remoteRate && isRateValid(curr, remoteRate)) {
            rates[curr] = remoteRate;
          }
        }
        providerStatus = "online";
        source = "Open Exchange Rates (ER-API Live Central Bank Feeds)";
      }
    }
  } catch (err) {
    console.warn("Live FX provider unavailable, using fallback rates:", (err as Error).message);
  }

  // Compute precise inverses (1 Target in INR)
  for (const curr of Object.keys(rates)) {
    inverseRates[curr] = rates[curr] > 0 ? 1 / rates[curr] : 1;
  }

  return {
    base: "INR",
    rates,
    inverseRates,
    timestamp: now.toISOString(),
    source,
    isStale: false,
    providerStatus,
  };
}

/**
 * Authoritative Server-side Exchange Rate Service
 */
export async function getExchangeRates(forceRefresh = false): Promise<RatesSnapshot> {
  const now = Date.now();

  if (
    !forceRefresh &&
    cachedSnapshot &&
    now - lastFetchAttemptTime < CACHE_TTL_MS
  ) {
    return {
      ...cachedSnapshot,
      providerStatus: "cached",
    };
  }

  try {
    lastFetchAttemptTime = now;
    cachedSnapshot = await fetchLiveRates();
    return cachedSnapshot;
  } catch {
    if (cachedSnapshot) {
      const ageMs = now - new Date(cachedSnapshot.timestamp).getTime();
      return {
        ...cachedSnapshot,
        isStale: ageMs > MAX_STALE_MS,
        providerStatus: "fallback",
      };
    }

    // Critical Fallback
    const fallbackInverses: Record<string, number> = {};
    for (const curr of Object.keys(FALLBACK_INR_RATES)) {
      fallbackInverses[curr] = 1 / FALLBACK_INR_RATES[curr];
    }

    return {
      base: "INR",
      rates: FALLBACK_INR_RATES,
      inverseRates: fallbackInverses,
      timestamp: new Date().toISOString(),
      source: "Hardened Built-in Fallback Table",
      isStale: false,
      providerStatus: "fallback",
    };
  }
}

/**
 * Convert canonical INR amount to target currency with exact minor-unit rounding
 */
export async function convertFromCanonical(
  inrAmount: number | string,
  targetCurrency: SupportedCurrency
): Promise<{
  amount: number;
  formatted: string;
  rate: number;
  rateTimestamp: string;
  currency: SupportedCurrency;
}> {
  const numINR = typeof inrAmount === "string" ? parseFloat(inrAmount || "0") : inrAmount;
  const snapshot = await getExchangeRates();
  const rate = snapshot.rates[targetCurrency] || FALLBACK_INR_RATES[targetCurrency] || 1;
  const meta = CURRENCY_REGISTRY[targetCurrency] || CURRENCY_REGISTRY.INR;

  const rawConverted = numINR * rate;
  const decimals = meta ? meta.decimals : 2;
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(rawConverted * factor) / factor;

  let formatted = "";
  try {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: targetCurrency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatted = formatter.format(rounded);
  } catch {
    formatted = `${meta ? meta.symbol : "$"}${rounded.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })}`;
  }

  return {
    amount: rounded,
    formatted,
    rate,
    rateTimestamp: snapshot.timestamp,
    currency: targetCurrency,
  };
}

/**
 * Convert foreign currency amount to canonical INR for ranking storage
 */
export async function convertToCanonical(
  amountInCurrency: number | string,
  fromCurrency: SupportedCurrency,
  lockedRate?: number
): Promise<{
  canonicalINR: number;
  rate: number;
  rateTimestamp: string;
}> {
  const num = typeof amountInCurrency === "string" ? parseFloat(amountInCurrency || "0") : amountInCurrency;
  if (fromCurrency === "INR") {
    return {
      canonicalINR: Math.round(num * 100) / 100,
      rate: 1.0,
      rateTimestamp: new Date().toISOString(),
    };
  }

  const snapshot = await getExchangeRates();
  const rate = lockedRate && lockedRate > 0 ? lockedRate : snapshot.rates[fromCurrency] || FALLBACK_INR_RATES[fromCurrency] || 1;

  // 1 INR = rate Foreign Currency -> Foreign / rate = INR
  const inrRaw = num / rate;
  const canonicalINR = Math.round(inrRaw * 100) / 100; // 2 decimal paise rounding

  return {
    canonicalINR,
    rate,
    rateTimestamp: snapshot.timestamp,
  };
}

/**
 * Format any currency using Intl with its proper metadata
 */
export function formatCurrencyAmount(
  amount: number | string,
  currency: SupportedCurrency
): string {
  const num = typeof amount === "string" ? parseFloat(amount || "0") : amount;
  const meta = CURRENCY_REGISTRY[currency] || CURRENCY_REGISTRY.INR;
  const valid = isNaN(num) ? 0 : num;
  const decimals = meta ? meta.decimals : 2;

  try {
    const hasFractions = valid % 1 !== 0;
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: meta.code,
      minimumFractionDigits: hasFractions ? Math.min(2, decimals) : 0,
      maximumFractionDigits: hasFractions ? decimals : 0,
    }).format(valid);
    return formatted.replace(/\.00$/, "").replace(/,00$/, "");
  } catch {
    const hasFractions = valid % 1 !== 0;
    const dec = hasFractions ? decimals : 0;
    return `${meta ? meta.symbol : "$"}${valid.toLocaleString("en-US", {
      minimumFractionDigits: dec,
      maximumFractionDigits: dec,
    })}`.replace(/\.00$/, "").replace(/,00$/, "");
  }
}
