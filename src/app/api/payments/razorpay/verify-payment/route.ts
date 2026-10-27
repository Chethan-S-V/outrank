import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/services/payments/razorpay";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      targetType = "territory",
      targetName = "Territory Contribution",
      countryCode = "IN",
      canonicalINR = 0,
      chargedAmount = 0,
      currency = "INR",
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required Razorpay payment verification fields" },
        { status: 400 }
      );
    }

    // 1. Verify cryptographic HMAC signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid Razorpay signature. Verification failed." },
        { status: 400 }
      );
    }

    // 2. Verified payment logged for audit
    console.log("[Razorpay Gateway Audit]", {
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      targetType,
      targetName,
      countryCode,
      canonicalINR,
      chargedAmount,
      currency,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      status: "succeeded",
      message: "Test payment successfully verified via Razorpay Gateway",
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { error: error?.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
