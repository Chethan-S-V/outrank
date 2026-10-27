import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres, { type Sql } from "postgres";
import * as schema from "@/db/schema";

let client: Sql | undefined;
let database: PostgresJsDatabase<typeof schema> | undefined;

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required to use the database.");
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
