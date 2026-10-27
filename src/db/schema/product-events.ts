import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  numeric,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { contributions, payments } from "@/db/schema/financial";
import { productEventType } from "@/db/schema/enums";
import { products } from "@/db/schema/products";

export const productEvents = pgTable(
  "product_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    contributionId: uuid("contribution_id").references(() => contributions.id, {
      onDelete: "restrict",
    }),
    paymentId: uuid("payment_id").references(() => payments.id, {
      onDelete: "restrict",
    }),
    eventType: productEventType("event_type").notNull(),
    amount: numeric("amount", { precision: 20, scale: 2 }),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("product_events_product_created_at_idx").on(
      table.productId,
      table.createdAt,
    ),
    index("product_events_contribution_id_idx").on(table.contributionId),
    index("product_events_payment_id_idx").on(table.paymentId),
  ],
);
