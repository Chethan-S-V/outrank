import { pgEnum } from "drizzle-orm/pg-core";

export const productVerificationStatus = pgEnum(
  "product_verification_status",
  ["pending", "verified", "rejected"],
);

export const productModerationStatus = pgEnum("product_moderation_status", [
  "pending",
  "approved",
  "rejected",
  "suspended",
]);

export const financialStatus = pgEnum("financial_status", [
  "pending",
  "succeeded",
  "failed",
  "refunded",
  "partially_refunded",
  "disputed",
]);

export const productEventType = pgEnum("product_event_type", [
  "product_created",
  "product_verified",
  "product_rejected",
  "product_approved",
  "product_moderation_rejected",
  "contribution_created",
  "payment_succeeded",
  "support_added",
  "payment_refunded",
  "payment_disputed",
  "product_suspended",
]);
