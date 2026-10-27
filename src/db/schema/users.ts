import {
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    handle: varchar("handle", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    avatarUrl: text("avatar_url"),
    bio: text("bio"),
    provider: varchar("provider", { length: 50 }).default("manual"),
    providerId: varchar("provider_id", { length: 255 }),
    twitterHandle: varchar("twitter_handle", { length: 100 }),
    githubHandle: varchar("github_handle", { length: 100 }),
    discordHandle: varchar("discord_handle", { length: 100 }),
    linkedinUrl: text("linkedin_url"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("users_handle_unique").on(table.handle),
    uniqueIndex("users_email_unique").on(table.email),
  ],
);
