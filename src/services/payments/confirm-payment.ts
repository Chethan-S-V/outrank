import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { contributions, payments, productEvents, products } from "@/db/schema";

export class PaymentConfirmationError extends Error {
  constructor(
    public readonly code:
      | "CONTRIBUTION_NOT_FOUND"
      | "INVALID_STATUS"
      | "PRODUCT_NOT_FOUND"
      | "AMOUNT_MISMATCH",
    message: string,
  ) {
    super(message);
  }
}

export type ConfirmPaymentParams = {
  contributionId: string;
  provider: string;
  providerPaymentId: string;
  providerCheckoutId?: string;
  amount?: string;
  currency?: string;
  rawReference?: string;
};

export type ConfirmedPaymentResult = {
  contributionId: string;
  paymentId: string;
  productId: string;
  amount: string;
  currency: string;
  totalSupportAmount: string;
  alreadyProcessed: boolean;
};

export async function confirmPayment(
  params: ConfirmPaymentParams,
): Promise<ConfirmedPaymentResult> {
  const db = getDb();

  return db.transaction(async (tx) => {
    // 1. Fetch contribution
    const [contribution] = await tx
      .select({
        id: contributions.id,
        productId: contributions.productId,
        amount: contributions.amount,
        currency: contributions.currency,
        canonicalAmount: contributions.canonicalAmount,
        canonicalCurrency: contributions.canonicalCurrency,
        chargedAmount: contributions.chargedAmount,
        chargedCurrency: contributions.chargedCurrency,
        exchangeRate: contributions.exchangeRate,
        exchangeRateTimestamp: contributions.exchangeRateTimestamp,
        status: contributions.status,
        paymentId: contributions.paymentId,
      })
      .from(contributions)
      .where(eq(contributions.id, params.contributionId))
      .limit(1);

    if (!contribution) {
      throw new PaymentConfirmationError(
        "CONTRIBUTION_NOT_FOUND",
        "The specified contribution does not exist.",
      );
    }

    // 2. Idempotency: If contribution is already succeeded, return existing state
    if (contribution.status === "succeeded") {
      const [product] = await tx
        .select({ totalSupportAmount: products.totalSupportAmount })
        .from(products)
        .where(eq(products.id, contribution.productId))
        .limit(1);

      return {
        contributionId: contribution.id,
        paymentId: contribution.paymentId ?? "",
        productId: contribution.productId,
        amount: contribution.amount,
        currency: contribution.currency,
        totalSupportAmount: product?.totalSupportAmount ?? "0",
        alreadyProcessed: true,
      };
    }

    if (contribution.status !== "pending") {
      throw new PaymentConfirmationError(
        "INVALID_STATUS",
        `Cannot confirm payment for contribution with status ${contribution.status}.`,
      );
    }

    // Canonical INR amount to credit
    const canonicalINRToCredit = contribution.canonicalAmount || contribution.amount;

    // 3. Create payment record with full multi-currency audit trail
    const [payment] = await tx
      .insert(payments)
      .values({
        contributionId: contribution.id,
        provider: params.provider,
        providerPaymentId: params.providerPaymentId,
        providerCheckoutId: params.providerCheckoutId ?? null,
        amount: canonicalINRToCredit,
        currency: "INR",
        canonicalAmount: canonicalINRToCredit,
        canonicalCurrency: "INR",
        chargedAmount: contribution.chargedAmount || contribution.amount,
        chargedCurrency: contribution.chargedCurrency || contribution.currency,
        exchangeRate: contribution.exchangeRate,
        exchangeRateTimestamp: contribution.exchangeRateTimestamp,
        status: "succeeded",
        rawReference: params.rawReference ?? null,
      })
      .returning({ id: payments.id });

    // 4. Update contribution with paymentId and succeeded status
    await tx
      .update(contributions)
      .set({
        status: "succeeded",
        paymentId: payment.id,
        updatedAt: new Date(),
      })
      .where(eq(contributions.id, contribution.id));

    // 5. Authoritatively increment product totalSupportAmount in Canonical INR
    const [updatedProduct] = await tx
      .update(products)
      .set({
        totalSupportAmount: sql<string>`(${products.totalSupportAmount} + ${canonicalINRToCredit}::numeric)::numeric(20, 2)`,
        supportCurrency: "INR",
        updatedAt: new Date(),
      })
      .where(eq(products.id, contribution.productId))
      .returning({
        id: products.id,
        totalSupportAmount: products.totalSupportAmount,
      });

    if (!updatedProduct) {
      throw new PaymentConfirmationError(
        "PRODUCT_NOT_FOUND",
        "The product associated with this contribution was not found.",
      );
    }

    // 6. Record audit product events
    await tx.insert(productEvents).values([
      {
        productId: contribution.productId,
        contributionId: contribution.id,
        paymentId: payment.id,
        eventType: "payment_succeeded",
        amount: contribution.amount,
        metadata: {
          provider: params.provider,
          providerPaymentId: params.providerPaymentId,
          currency: contribution.currency,
        },
      },
      {
        productId: contribution.productId,
        contributionId: contribution.id,
        paymentId: payment.id,
        eventType: "support_added",
        amount: contribution.amount,
        metadata: {
          previousTotal: sql`(${updatedProduct.totalSupportAmount} - ${contribution.amount}::numeric)::text`,
          newTotalSupportAmount: updatedProduct.totalSupportAmount,
        },
      },
    ]);

    return {
      contributionId: contribution.id,
      paymentId: payment.id,
      productId: contribution.productId,
      amount: contribution.amount,
      currency: contribution.currency,
      totalSupportAmount: updatedProduct.totalSupportAmount,
      alreadyProcessed: false,
    };
  });
}
