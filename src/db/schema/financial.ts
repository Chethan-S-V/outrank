import { sql } from "drizzle-orm";
import {
  check,
  index,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { financialStatus } from "@/db/schema/enums";
import { products } from "@/db/schema/products";

export const contributions = pgTable(
  "contributions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    canonicalAmount: numeric("canonical_amount", { precision: 20, scale: 2 }),
    canonicalCurrency: varchar("canonical_currency", { length: 3 }).default("INR"),
    chargedAmount: numeric("charged_amount", { precision: 20, scale: 2 }),
    chargedCurrency: varchar("charged_currency", { length: 3 }),
    exchangeRate: numeric("exchange_rate", { precision: 18, scale: 8 }),
    exchangeRateTimestamp: timestamp("exchange_rate_timestamp", { withTimezone: true }),
    status: financialStatus("status").notNull().default("pending"),
    contributorEmail: varchar("contributor_email", { length: 320 }),
    paymentId: uuid("payment_id"),
    idempotencyKey: varchar("idempotency_key", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("contributions_amount_positive", sql`${table.amount} > 0`),
    index("contributions_product_id_idx").on(table.productId),
    index("contributions_status_idx").on(table.status),
    index("contributions_created_at_idx").on(table.createdAt),
    uniqueIndex("contributions_payment_id_unique").on(table.paymentId),
    uniqueIndex("contributions_idempotency_key_unique").on(table.idempotencyKey),
    check(
      "contributions_currency_iso_code",
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);

export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contributionId: uuid("contribution_id")
      .notNull()
      .references(() => contributions.id, { onDelete: "restrict" }),
    provider: varchar("provider", { length: 64 }).notNull(),
    providerPaymentId: varchar("provider_payment_id", { length: 255 }),
    providerCheckoutId: varchar("provider_checkout_id", { length: 255 }),
    amount: numeric("amount", { precision: 20, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull().default("INR"),
    canonicalAmount: numeric("canonical_amount", { precision: 20, scale: 2 }),
    canonicalCurrency: varchar("canonical_currency", { length: 3 }).default("INR"),
    chargedAmount: numeric("charged_amount", { precision: 20, scale: 2 }),
    chargedCurrency: varchar("charged_currency", { length: 3 }),
    exchangeRate: numeric("exchange_rate", { precision: 18, scale: 8 }),
    exchangeRateTimestamp: timestamp("exchange_rate_timestamp", { withTimezone: true }),
    feeAmount: numeric("fee_amount", { precision: 20, scale: 2 }),
    status: financialStatus("status").notNull().default("pending"),
    rawReference: text("raw_reference"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check("payments_amount_positive", sql`${table.amount} > 0`),
    uniqueIndex("payments_contribution_id_unique").on(table.contributionId),
    uniqueIndex("payments_provider_payment_id_unique").on(
      table.providerPaymentId,
    ),
    index("payments_status_idx").on(table.status),
    index("payments_created_at_idx").on(table.createdAt),
    check(
      "payments_currency_iso_code",
      sql`${table.currency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);
