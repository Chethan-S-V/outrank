import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";
import { createSlug } from "@/lib/utils/slug";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const list = await db.select().from(categories);
  return NextResponse.json({ categories: list });
}

export async function POST(request: Request) {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      name: string;
      description?: string;
    };

    if (!body.name?.trim()) {
      return NextResponse.json({ error: "Category name is required." }, { status: 400 });
    }

    const slug = createSlug(body.name.trim());
    const db = getDb();

    const [existing] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "A category with this name or slug already exists." }, { status: 409 });
    }

    const [newCat] = await db
      .insert(categories)
      .values({
        name: body.name.trim(),
        slug,
        description: body.description?.trim() || `${body.name.trim()} applications and platforms`,
        isActive: true,
      })
      .returning();

    return NextResponse.json({ success: true, category: newCat });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      id: string;
      isActive: boolean;
    };

    if (!body.id) {
      return NextResponse.json({ error: "Category ID is required." }, { status: 400 });
    }

    const db = getDb();
    const [updated] = await db
      .update(categories)
      .set({ isActive: body.isActive })
      .where(eq(categories.id, body.id))
      .returning();

    return NextResponse.json({ success: true, category: updated });
  } catch (err: unknown) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
