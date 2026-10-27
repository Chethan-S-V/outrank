import { NextResponse } from "next/server";
import {
  getExchangeRates,
  CURRENCY_REGISTRY,
  CANONICAL_CURRENCY,
} from "@/services/currency/exchange-rate-service";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await getExchangeRates();
    return NextResponse.json({
      success: true,
      canonicalCurrency: CANONICAL_CURRENCY,
      rates: snapshot.rates,
      inverseRates: snapshot.inverseRates,
      timestamp: snapshot.timestamp,
      source: snapshot.source,
      providerStatus: snapshot.providerStatus,
      isStale: snapshot.isStale,
      registry: CURRENCY_REGISTRY,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Unable to retrieve current exchange rates.",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  // Manual refresh - protected for Admin
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const refreshed = await getExchangeRates(true);
    return NextResponse.json({
      success: true,
      refreshed: true,
      canonicalCurrency: CANONICAL_CURRENCY,
      rates: refreshed.rates,
      timestamp: refreshed.timestamp,
      source: refreshed.source,
      providerStatus: refreshed.providerStatus,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        error: "Rate refresh failed.",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
