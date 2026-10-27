import { NextResponse } from "next/server";
import { eq, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import { scrapeWebsiteMetadata } from "@/lib/metadata/scraper";

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    let clean = url.trim();
    if (clean.startsWith("@")) {
      clean = `https://twitter.com/${clean.slice(1)}`;
    } else if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }

    // Validate URL syntax
    let targetUrl: URL;
    try {
      targetUrl = new URL(clean);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL provided. Please provide a valid, active website or creator profile link." },
        { status: 400 }
      );
    }

    // Check if product is ALREADY registered in Outrank database
    let isExisting = false;
    let existingProduct = null;

    try {
      const db = getDb();
      // Normalize URL variants (with/without trailing slash, http/https)
      const urlWithoutSlash = clean.replace(/\/+$/, "");
      const urlWithSlash = `${urlWithoutSlash}/`;

      const found = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          websiteUrl: products.websiteUrl,
          totalSupportAmount: products.totalSupportAmount,
          verificationStatus: products.verificationStatus,
          logoUrl: products.logoUrl,
        })
        .from(products)
        .where(
          or(
            eq(products.websiteUrl, urlWithoutSlash),
            eq(products.websiteUrl, urlWithSlash),
            eq(products.websiteUrl, clean),
            sql`LOWER(${products.websiteUrl}) = LOWER(${clean})`
          )
        )
        .limit(1);

      if (found.length > 0) {
        isExisting = true;
        existingProduct = found[0];
      }
    } catch {
      // Gracefully continue scrape if DB check has a minor hiccup
    }

    // Scrape live website metadata
    const metadata = await scrapeWebsiteMetadata(clean);

    return NextResponse.json({
      ...metadata,
      normalizedUrl: clean,
      isExisting,
      existingProduct,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to extract metadata. Please verify the URL exists and is online.";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}
