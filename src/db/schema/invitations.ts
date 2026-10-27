import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("company"), // "company" | "creator"
  websiteUrl: text("website_url"),
  categorySlug: varchar("category_slug", { length: 100 }),
  inviteCode: varchar("invite_code", { length: 64 }).notNull().unique(),
  status: varchar("status", { length: 50 }).notNull().default("sent"), // "sent" | "opened" | "claimed"
  personalNote: text("personal_note"),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  claimedAt: timestamp("claimed_at", { withTimezone: true }),
});
