import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "@/db/schema";

let client: Sql | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    // Safe build-time fallback when static pages are collected on CI/Vercel without live DB env
    return "postgresql://postgres:postgres@127.0.0.1:5432/outrank_build_placeholder";
  }

  return databaseUrl;
}

export function getDatabaseClient() {
  if (!client) {
    client = postgres(getDatabaseUrl(), { prepare: false });
  }

  return client;
}

export function getDb() {
  if (!database) {
    database = drizzle(getDatabaseClient(), { schema });
  }

  return database;
}
