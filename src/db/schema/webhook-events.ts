import { sql } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const webhookEvents = pgTable(
  "webhook_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    provider: varchar("provider", { length: 64 }).notNull(),
    providerEventId: varchar("provider_event_id", { length: 255 }).notNull(),
    eventType: varchar("event_type", { length: 128 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("processed"),
    payload: jsonb("payload")
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("webhook_events_provider_event_id_unique").on(
      table.provider,
      table.providerEventId,
    ),
    index("webhook_events_created_at_idx").on(table.createdAt),
  ],
);
