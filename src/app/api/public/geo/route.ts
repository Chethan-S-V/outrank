import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD",
  IN: "INR",
  GB: "GBP",
  CA: "CAD",
  AU: "AUD",
  DE: "EUR",
  FR: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  IE: "EUR",
  CH: "CHF",
  JP: "JPY",
  KR: "KRW",
  CN: "CNY",
  SG: "SGD",
  AE: "AED",
  SA: "SAR",
  BR: "BRL",
  MX: "MXN",
  ZA: "ZAR",
  NG: "NGN",
  NZ: "NZD",
  SE: "SEK",
  NO: "NOK",
  DK: "DKK",
  PL: "PLN",
  TR: "TRY",
  ID: "IDR",
  TH: "THB",
  MY: "MYR",
  PH: "PHP",
  VN: "VND",
  BD: "BDT",
  PK: "PKR",
  EG: "EGP",
};

export async function GET(request: Request) {
  const headers = new Headers(request.headers);
  const country = (
    headers.get("x-vercel-ip-country") ||
    headers.get("cf-ipcountry") ||
    headers.get("x-country-code") ||
    ""
  ).toUpperCase();

  const suggestedCurrency = COUNTRY_TO_CURRENCY[country] || null;

  return NextResponse.json({
    country: country || null,
    suggestedCurrency,
  });
}
