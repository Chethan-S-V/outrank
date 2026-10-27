import { NextResponse } from "next/server";
import { razorpayClient } from "@/services/payments/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      amount, // Charged amount in main units (e.g. 100 INR, 10 USD)
      currency = "INR",
      targetType = "territory",
      targetName = "Global Sovereign Backing",
      countryCode = "IN",
      canonicalINR = 0,
    } = body;

    const numAmount = parseFloat(amount);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) {
      return NextResponse.json({ error: "Invalid payment amount" }, { status: 400 });
    }

    // Razorpay requires amount in subunits (paise for INR, cents for USD/EUR, etc.)
    // For zero-decimal currencies (JPY), subunits are 1:1
    const isZeroDecimal = ["JPY"].includes(currency.toUpperCase());
    const subunitAmount = isZeroDecimal ? Math.round(numAmount) : Math.round(numAmount * 100);

    // Create Razorpay Order with automatic fallback for exotic currencies
    let order;
    try {
      order = await razorpayClient.orders.create({
        amount: subunitAmount,
        currency: currency.toUpperCase(),
        receipt: `outrank_rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          targetType: String(targetType),
          targetName: String(targetName).slice(0, 40),
          countryCode: String(countryCode),
          canonicalINR: String(canonicalINR || numAmount),
          originalCurrency: currency.toUpperCase(),
          platform: "Outrank Sovereign Leaderboard",
        },
      });
    } catch (orderErr: any) {
      // If Razorpay test account rejects currency not configured on the test merchant, fall back to canonical INR
      const fallbackINR = Math.max(1, Math.round(Number(canonicalINR) || numAmount));
      order = await razorpayClient.orders.create({
        amount: fallbackINR * 100, // paise
        currency: "INR",
        receipt: `outrank_rcpt_${Date.now().toString().slice(-8)}`,
        notes: {
          targetType: String(targetType),
          targetName: String(targetName).slice(0, 40),
          countryCode: String(countryCode),
          canonicalINR: String(fallbackINR),
          originalCurrency: currency.toUpperCase(),
          originalAmount: String(numAmount),
          platform: "Outrank Sovereign Leaderboard",
        },
      });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_TszCIAmcV6dfeg",
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create Razorpay test order" },
      { status: 500 }
    );
  }
}
