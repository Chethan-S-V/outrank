import { describe, expect, it } from "vitest";
import {
  CANONICAL_CURRENCY,
  CURRENCY_REGISTRY,
  convertFromCanonical,
  convertToCanonical,
  formatCurrencyAmount,
  getExchangeRates,
} from "@/services/currency/exchange-rate-service";
import {
  formatCanonicalAmount,
  convertDisplayToCanonical,
  convertCanonicalToDisplay,
} from "@/lib/currency";

describe("Authoritative Multi-Currency & Financial Engine", () => {
  it("enforces INR as the canonical ranking currency", () => {
    expect(CANONICAL_CURRENCY).toBe("INR");
  });

  it("never copies numeric values blindly across currencies", async () => {
    // ₹1,000 INR MUST NOT format as $1,000 USD!
    const inrAmount = 1000;
    const usdQuote = await convertFromCanonical(inrAmount, "USD");

    // At ~85.5 INR/USD, 1000 INR ≈ $11.70 USD
    expect(usdQuote.amount).toBeLessThan(20);
    expect(usdQuote.amount).toBeGreaterThan(10);
    expect(usdQuote.formatted).toContain("$");
    expect(usdQuote.formatted).not.toBe("$1,000.00");
    expect(usdQuote.formatted).not.toBe("$1,000");
  });

  it("correctly converts canonical INR to EUR and GBP equivalents", async () => {
    const inrAmount = 10000; // ₹10,000 INR

    const eurQuote = await convertFromCanonical(inrAmount, "EUR");
    const gbpQuote = await convertFromCanonical(inrAmount, "GBP");

    // ₹10,000 INR should be ~107 EUR and ~91 GBP
    expect(eurQuote.amount).toBeGreaterThan(90);
    expect(eurQuote.amount).toBeLessThan(130);
    expect(eurQuote.formatted).toContain("€");

    expect(gbpQuote.amount).toBeGreaterThan(75);
    expect(gbpQuote.amount).toBeLessThan(115);
    expect(gbpQuote.formatted).toContain("£");
  });

  it("handles zero-decimal currencies like Japanese Yen (JPY) with 0 decimal places", async () => {
    const inrAmount = 1000; // ₹1,000 INR ≈ ¥1,778 JPY
    const jpyQuote = await convertFromCanonical(inrAmount, "JPY");

    expect(CURRENCY_REGISTRY.JPY.decimals).toBe(0);
    expect(Number.isInteger(jpyQuote.amount)).toBe(true);
    expect(jpyQuote.amount).toBeGreaterThan(1500);
    expect(jpyQuote.amount).toBeLessThan(2000);
  });

  it("converts foreign contribution inputs to authoritative canonical INR", async () => {
    // A US contributor bids $10.00 USD
    const usdContribution = 10;
    const conversion = await convertToCanonical(usdContribution, "USD");

    // At market rate (~85-95 INR/USD), $10 USD credits between ₹800 and ₹1,100 INR
    expect(conversion.canonicalINR).toBeGreaterThan(750);
    expect(conversion.canonicalINR).toBeLessThan(1150);

    // An Indian contributor bids ₹1,000 INR
    const inrContribution = 1000;
    const inrConversion = await convertToCanonical(inrContribution, "INR");
    expect(inrConversion.canonicalINR).toBe(1000);
  });

  it("verifies client formatting utility formatCanonicalAmount", () => {
    // ₹1,000 INR in USD display
    const formattedUSD = formatCanonicalAmount(1000, "USD");
    expect(formattedUSD).toContain("$");
    expect(formattedUSD).not.toContain("1,000");

    // ₹1,000 INR in INR display
    const formattedINR = formatCanonicalAmount(1000, "INR");
    expect(formattedINR).toContain("₹");
    expect(formattedINR).toContain("1,000");
  });

  it("verifies bidirectional conversion helpers in client currency module", () => {
    // $10 USD to canonical INR
    const canonicalFromUSD = convertDisplayToCanonical(10, "USD");
    expect(canonicalFromUSD).toBeGreaterThan(750);
    expect(canonicalFromUSD).toBeLessThan(1150);

    // Convert canonical INR back to USD display
    const displayUSD = convertCanonicalToDisplay(canonicalFromUSD, "USD");
    expect(Math.round(displayUSD)).toBe(10);
  });

  it("guarantees exchange rates snapshot is valid and populated", async () => {
    const snapshot = await getExchangeRates();
    expect(snapshot.base).toBe("INR");
    expect(snapshot.rates.USD).toBeGreaterThan(0);
    expect(snapshot.rates.EUR).toBeGreaterThan(0);
    expect(snapshot.rates.GBP).toBeGreaterThan(0);
    expect(snapshot.rates.JPY).toBeGreaterThan(0);
    expect(snapshot.isStale).toBe(false);
  });
});
