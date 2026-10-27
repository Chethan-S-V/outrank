import { z } from "zod";

export const MAX_CONTRIBUTION_AMOUNT = "1000000000000";
export const MIN_CONTRIBUTION_AMOUNT = "1";

function normalizeAmount(value: string) {
  const [whole = "0", fraction = ""] = value.trim().split(".");
  return `${whole.replace(/^0+(?=\d)/, "") || "0"}.${fraction.padEnd(2, "0")}`;
}

function toCents(value: string): bigint | null {
  if (!/^\d+(?:\.\d{1,2})?$/.test(value.trim())) {
    return null;
  }

  const [whole, fraction] = normalizeAmount(value).split(".");
  return BigInt(whole) * BigInt(100) + BigInt(fraction.slice(0, 2));
}

const minimumContributionCents = toCents(MIN_CONTRIBUTION_AMOUNT);
const maximumContributionCents = toCents(MAX_CONTRIBUTION_AMOUNT);

const contributionAmount = z.string().trim().superRefine((value, context) => {
  const cents = toCents(value);

  if (cents === null) {
    context.addIssue({ code: "custom", message: "Enter a valid USD amount." });
    return;
  }

  if (minimumContributionCents !== null && cents < minimumContributionCents) {
    context.addIssue({ code: "custom", message: "The minimum contribution is $1." });
  }

  if (maximumContributionCents !== null && cents > maximumContributionCents) {
    context.addIssue({ code: "custom", message: "The maximum contribution is $1,000,000,000,000." });
  }
}).transform(normalizeAmount);

export const contributionRequestSchema = z.object({ productId: z.string().uuid(), amount: contributionAmount, currency: z.literal("USD") }).strict();
export type ContributionRequest = z.infer<typeof contributionRequestSchema>;
