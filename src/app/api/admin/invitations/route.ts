import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { invitations } from "@/db/schema";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const list = await db
      .select()
      .from(invitations)
      .orderBy(desc(invitations.sentAt))
      .limit(100);

    return NextResponse.json({ invitations: list });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch invitations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
