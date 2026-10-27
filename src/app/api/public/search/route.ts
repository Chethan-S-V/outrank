import { NextResponse } from "next/server";
import { getPublicProducts } from "@/services/products";
import { searchWorldTerritories } from "@/lib/data/world-countries";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      const allProducts = await getPublicProducts({ limit: 50 });
      return NextResponse.json({ products: allProducts, territories: [] });
    }

    const trimmed = query.trim();
    const [products, territories] = await Promise.all([
      getPublicProducts({ query: trimmed, limit: 10 }),
      Promise.resolve(searchWorldTerritories(trimmed, 10)),
    ]);

    return NextResponse.json({ products, territories });
  } catch {
    return NextResponse.json({ products: [], territories: [], error: "Search failed." }, { status: 500 });
  }
}
