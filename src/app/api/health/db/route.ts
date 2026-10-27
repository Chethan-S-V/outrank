import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";

export async function GET() {
  try {
    await getDb().execute(sql`SELECT 1`);

    return NextResponse.json({
      status: "ok",
      service: "outrank",
      database: "ok",
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        service: "outrank",
        database: "unavailable",
      },
      { status: 503 },
    );
  }
}
