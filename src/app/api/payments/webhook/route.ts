import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { confirmPayment, PaymentConfirmationError } from "@/services/payments";
import { getDb } from "@/db";
import { webhookEvents } from "@/db/schema";
import { eq, and } from "drizzle-orm";

function verifyStripeSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string,
): boolean {
  try {
    const parts = signatureHeader.split(",");
    const timestampPart = parts.find((part) => part.startsWith("t="));
    const sigPart = parts.find((part) => part.startsWith("v1="));

    if (!timestampPart || !sigPart) return false;

    const timestamp = timestampPart.slice(2);
    const signature = sigPart.slice(3);

    const payload = `${timestamp}.${rawBody}`;
    const hmac = createHmac("sha256", secret);
    hmac.update(payload);
    const expectedSig = hmac.digest("hex");

    const expectedBuffer = Buffer.from(expectedSig, "hex");
    const receivedBuffer = Buffer.from(signature, "hex");

    if (expectedBuffer.length !== receivedBuffer.length) return false;

    return timingSafeEqual(expectedBuffer, receivedBuffer);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (webhookSecret) {
    if (!signatureHeader || !verifyStripeSignature(rawBody, signatureHeader, webhookSecret)) {
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
    }
  }

  let event: {
    id?: string;
    type?: string;
    data?: {
      object?: {
        id?: string;
        payment_intent?: string;
        client_reference_id?: string;
        metadata?: {
          contributionId?: string;
          productId?: string;
        };
        amount_total?: number;
        currency?: string;
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON webhook payload." }, { status: 400 });
  }

  const providerEventId = event.id || `evt_${Date.now()}`;
  const db = getDb();

  // 1. Idempotency check in webhook_events ledger
  const [existingEvent] = await db
    .select({ id: webhookEvents.id })
    .from(webhookEvents)
    .where(
      and(
        eq(webhookEvents.provider, "stripe"),
        eq(webhookEvents.providerEventId, providerEventId),
      ),
    )
    .limit(1);

  if (existingEvent) {
    return NextResponse.json({ received: true, note: "Event already processed." });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const contributionId = session?.metadata?.contributionId || session?.client_reference_id;

    if (!contributionId) {
      console.warn("Stripe checkout session missing contribution ID:", session?.id);
      return NextResponse.json({ received: true, note: "No contribution ID in session" });
    }

    const providerPaymentId =
      (typeof session.payment_intent === "string" ? session.payment_intent : null) ||
      session.id ||
      `str_${Date.now()}`;

    const amount =
      typeof session.amount_total === "number"
        ? (session.amount_total / 100).toFixed(2)
        : undefined;

    const currency = session.currency ? session.currency.toUpperCase() : "USD";

    try {
      await confirmPayment({
        contributionId,
        provider: "stripe",
        providerPaymentId,
        providerCheckoutId: session.id,
        amount,
        currency,
        rawReference: JSON.stringify(session),
      });

      // Log in webhook ledger
      await db.insert(webhookEvents).values({
        provider: "stripe",
        providerEventId,
        eventType: event.type,
        status: "processed",
        payload: event as Record<string, unknown>,
      });
    } catch (error) {
      if (error instanceof PaymentConfirmationError) {
        console.warn("Payment confirmation notice:", error.message);
      } else {
        console.error("Failed to confirm payment from webhook:", error);
        return NextResponse.json(
          { error: "Internal error processing payment." },
          { status: 500 },
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
