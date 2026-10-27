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
import { categories } from "@/db/schema/categories";
import {
  productModerationStatus,
  productVerificationStatus,
} from "@/db/schema/enums";
import { users } from "@/db/schema/users";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    slug: varchar("slug", { length: 180 }).notNull(),
    description: text("description").notNull(),
    websiteUrl: text("website_url").notNull(),
    logoUrl: text("logo_url"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    ownerEmail: varchar("owner_email", { length: 320 }).notNull(),
    makerName: varchar("maker_name", { length: 160 }),
    twitterHandle: varchar("twitter_handle", { length: 100 }),
    githubUrl: text("github_url"),
    discordUrl: text("discord_url"),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    verificationStatus: productVerificationStatus("verification_status")
      .notNull()
      .default("pending"),
    moderationStatus: productModerationStatus("moderation_status")
      .notNull()
      .default("pending"),
    // Numeric(20, 2) keeps currency values exact. This is the authoritative
    // confirmed-support aggregate and must only change after verified payments.
    totalSupportAmount: numeric("total_support_amount", {
      precision: 20,
      scale: 2,
    })
      .notNull()
      .default("0"),
    supportCurrency: varchar("support_currency", { length: 3 })
      .notNull()
      .default("INR"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("products_slug_unique").on(table.slug),
    uniqueIndex("products_website_url_unique").on(table.websiteUrl),
    index("products_category_id_idx").on(table.categoryId),
    index("products_verification_status_idx").on(table.verificationStatus),
    index("products_moderation_status_idx").on(table.moderationStatus),
    index("products_leaderboard_total_support_idx").on(
      table.totalSupportAmount.desc(),
    ),
    index("products_created_at_idx").on(table.createdAt),
    check(
      "products_support_currency_iso_code",
      sql`${table.supportCurrency} ~ '^[A-Z]{3}$'`,
    ),
  ],
);
