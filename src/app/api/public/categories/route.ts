import { NextResponse } from "next/server";
import { getPublicCategories } from "@/services/products";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const categories = await getPublicCategories();
    return NextResponse.json(
      { categories },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Categories are temporarily unavailable." }, { status: 503 });
  }
}

