import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { contributions, productEvents, products } from "@/db/schema";
import { contributionRequestSchema } from "@/lib/validations";
import {
  convertToCanonical,
  type SupportedCurrency,
} from "@/services/currency/exchange-rate-service";

export class PaymentConfigurationError extends Error {}
export class ContributionRequestError extends Error {}

type CreateCheckoutOptions = {
  origin?: string;
};

export type CheckoutSessionResult = {
  checkoutUrl: string;
  contributionId: string;
};

export async function createContributionCheckout(
  input: unknown,
  options: CreateCheckoutOptions = {},
): Promise<CheckoutSessionResult> {
  const parsed = contributionRequestSchema.safeParse(input);
  if (!parsed.success) {
    throw new ContributionRequestError("Invalid contribution request.");
  }

  const db = getDb();

  return db.transaction(async (tx) => {
    const [product] = await tx
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        verificationStatus: products.verificationStatus,
        moderationStatus: products.moderationStatus,
      })
      .from(products)
      .where(
        and(
          eq(products.id, parsed.data.productId),
          eq(products.verificationStatus, "verified"),
          eq(products.moderationStatus, "approved"),
        ),
      )
      .limit(1);

    if (!product) {
      throw new ContributionRequestError(
        "This product is not available for public contributions.",
      );
    }

    // 1. Calculate locked canonical INR conversion
    const chargedCurrency = (parsed.data.currency || "USD") as SupportedCurrency;
    const conversion = await convertToCanonical(parsed.data.amount, chargedCurrency);
    const canonicalINRString = conversion.canonicalINR.toFixed(2);
    const chargedAmountString = parseFloat(parsed.data.amount).toFixed(2);

    // 2. Create a pending contribution record with locked financial quote
    const [contribution] = await tx
      .insert(contributions)
      .values({
        productId: product.id,
        amount: canonicalINRString,
        currency: "INR",
        canonicalAmount: canonicalINRString,
        canonicalCurrency: "INR",
        chargedAmount: chargedAmountString,
        chargedCurrency,
        exchangeRate: conversion.rate.toString(),
        exchangeRateTimestamp: new Date(conversion.rateTimestamp),
        status: "pending",
      })
      .returning({ id: contributions.id });

    // 3. Audit log the contribution initiation
    await tx.insert(productEvents).values({
      productId: product.id,
      contributionId: contribution.id,
      eventType: "contribution_created",
      amount: canonicalINRString,
      metadata: {
        canonicalAmountINR: conversion.canonicalINR,
        chargedAmount: parsed.data.amount,
        chargedCurrency,
        exchangeRate: conversion.rate,
        productSlug: product.slug,
      },
    });

    const origin = options.origin?.replace(/\/$/, "") || "";

    // 3. Official Stripe Provider Checkout Session
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new PaymentConfigurationError(
        "Payment processing is currently in setup mode. Please configure STRIPE_SECRET_KEY to enable verified payment checkouts.",
      );
    }

    try {
      const amountCents = Math.round(parseFloat(parsed.data.amount) * 100);
      const params = new URLSearchParams({
        "payment_method_types[0]": "card",
        "line_items[0][price_data][currency]": parsed.data.currency.toLowerCase(),
        "line_items[0][price_data][unit_amount]": amountCents.toString(),
        "line_items[0][price_data][product_data][name]": `Outrank Backing: ${product.name}`,
        "line_items[0][price_data][product_data][description]": `Contribution to boost ${product.name} on Outrank leaderboard.`,
        "line_items[0][quantity]": "1",
        mode: "payment",
        success_url: `${origin}/payment/success?contribution_id=${contribution.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/payment/cancelled?slug=${encodeURIComponent(product.slug)}&contribution_id=${contribution.id}`,
        client_reference_id: contribution.id,
        "metadata[contributionId]": contribution.id,
        "metadata[productId]": product.id,
      });

      const stripeResponse = await fetch(
        "https://api.stripe.com/v1/checkout/sessions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeSecretKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        },
      );

      if (!stripeResponse.ok) {
        const errorBody = await stripeResponse.text();
        console.error("Stripe Checkout session creation failed:", errorBody);
        throw new PaymentConfigurationError(
          "Unable to initiate secure checkout with payment provider.",
        );
      }

      const session = (await stripeResponse.json()) as { url: string };
      return {
        checkoutUrl: session.url,
        contributionId: contribution.id,
      };
    } catch (err) {
      if (err instanceof PaymentConfigurationError) throw err;
      console.error("Failed to connect to Stripe:", err);
      throw new PaymentConfigurationError("Payment gateway connection error.");
    }
  });
}
