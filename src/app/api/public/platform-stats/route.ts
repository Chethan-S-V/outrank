import { NextResponse } from "next/server";
import { getPublicPlatformStats } from "@/services/products/public-discovery";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const stats = await getPublicPlatformStats();
    return NextResponse.json({ stats });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch platform stats" }, { status: 500 });
  }
}
