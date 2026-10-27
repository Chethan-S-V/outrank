import { NextResponse } from "next/server";
import { eq, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, contributions, payments, productEvents, products } from "@/db/schema";
import { scrapeWebsiteMetadata } from "@/lib/metadata/scraper";
import { createSlug, createSlugCandidate } from "@/lib/utils/slug";
import { convertToCanonical, type SupportedCurrency } from "@/services/currency/exchange-rate-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      productId?: string;
      websiteUrl?: string;
      amount?: number | string;
      currency?: string;
      canonicalAmountINR?: number | string;
      exchangeRate?: number;
      name?: string;
      description?: string;
      logoUrl?: string;
      categorySlug?: string;
      makerName?: string;
      twitterHandle?: string;
      githubUrl?: string;
      discordUrl?: string;
    };

    let normalizedUrl = body.websiteUrl?.trim() || "";
    if (normalizedUrl && !normalizedUrl.startsWith("http://") && !normalizedUrl.startsWith("https://")) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    if (!normalizedUrl && !body.productId) {
      return NextResponse.json({ error: "Product website URL or Product ID is required." }, { status: 400 });
    }

    const db = getDb();

    // If productId is provided, lookup the product immediately
    let existingProduct = null;
    if (body.productId) {
      const [found] = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          websiteUrl: products.websiteUrl,
          totalSupportAmount: products.totalSupportAmount,
          verificationStatus: products.verificationStatus,
          moderationStatus: products.moderationStatus,
          logoUrl: products.logoUrl,
          description: products.description,
          categoryId: products.categoryId,
        })
        .from(products)
        .where(eq(products.id, body.productId))
        .limit(1);

      if (found) {
        existingProduct = found;
        if (!normalizedUrl) normalizedUrl = found.websiteUrl;
      }
    }

    // Auto-scrape metadata if name or description are missing and URL is available
    let metadataName = body.name?.trim() || existingProduct?.name;
    let metadataDesc = body.description?.trim() || existingProduct?.description;
    let metadataLogo = body.logoUrl?.trim() || existingProduct?.logoUrl || undefined;
    let metadataTwitter = body.twitterHandle?.trim();
    let metadataGithub = body.githubUrl?.trim();
    let metadataDiscord = body.discordUrl?.trim();
    let suggestedCat = body.categorySlug;

    if ((!metadataName || !metadataDesc || !metadataLogo) && normalizedUrl) {
      try {
        const scraped = await scrapeWebsiteMetadata(normalizedUrl);
        if (!metadataName) metadataName = scraped.name;
        if (!metadataDesc) metadataDesc = scraped.description;
        if (!metadataLogo) metadataLogo = scraped.logoUrl || undefined;
        if (!metadataTwitter && scraped.twitterHandle) metadataTwitter = scraped.twitterHandle;
        if (!metadataGithub && scraped.githubUrl) metadataGithub = scraped.githubUrl;
        if (!metadataDiscord && scraped.discordUrl) metadataDiscord = scraped.discordUrl;
        if (!suggestedCat) suggestedCat = scraped.suggestedCategorySlug;
      } catch {
        try {
          const parsed = new URL(normalizedUrl);
          if (!metadataName) metadataName = parsed.hostname.replace(/^www\./, "").split(".")[0];
          if (!metadataDesc) metadataDesc = `Verified product for ${parsed.hostname}`;
        } catch {
          if (!metadataName) metadataName = "Verified Showcase";
          if (!metadataDesc) metadataDesc = "Verified platform on Outrank";
        }
      }
    }

    // Find active category or dynamically create new category
    const activeCategories = await db
      .select({ id: categories.id, slug: categories.slug })
      .from(categories)
      .where(eq(categories.isActive, true));

    let resolvedCategory = activeCategories.find((c) => c.slug === suggestedCat);

    if (!resolvedCategory && suggestedCat && suggestedCat !== "other") {
      const catSlug = createSlug(suggestedCat);
      const catName = suggestedCat
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

      try {
        const [insertedCat] = await db
          .insert(categories)
          .values({
            name: catName,
            slug: catSlug,
            description: `${catName} products and tools`,
            isActive: true,
          })
          .onConflictDoNothing()
          .returning({ id: categories.id, slug: categories.slug });

        if (insertedCat) {
          resolvedCategory = insertedCat;
        }
      } catch {
        // Fallback gracefully
      }
    }

    if (!resolvedCategory && activeCategories.length > 0) {
      resolvedCategory = activeCategories[0];
    }

    if (!resolvedCategory) {
      return NextResponse.json({ error: "No active product category found." }, { status: 400 });
    }

    // Precise Authoritative Financial Calculation
    const chargedCurrency = (body.currency?.toUpperCase() || "INR") as SupportedCurrency;
    const chargedAmountNum = Number(body.amount) || 1000;

    let canonicalAmountINRNum: number;
    let lockedRate: number;
    let rateTimestamp: string;

    if (body.canonicalAmountINR && Number(body.canonicalAmountINR) > 0) {
      canonicalAmountINRNum = Math.round(Number(body.canonicalAmountINR) * 100) / 100;
      lockedRate = body.exchangeRate || 1;
      rateTimestamp = new Date().toISOString();
    } else {
      const conversion = await convertToCanonical(chargedAmountNum, chargedCurrency);
      canonicalAmountINRNum = conversion.canonicalINR;
      lockedRate = conversion.rate;
      rateTimestamp = conversion.rateTimestamp;
    }

    const canonicalINRString = canonicalAmountINRNum.toFixed(2);
    const chargedAmountString = chargedAmountNum.toFixed(2);

    // Check if product already exists (if not already resolved above)
    if (!existingProduct) {
      const existingProductQuery = body.productId
        ? or(eq(products.id, body.productId), normalizedUrl ? eq(products.websiteUrl, normalizedUrl) : sql`false`)
        : eq(products.websiteUrl, normalizedUrl);

      const [found] = await db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          websiteUrl: products.websiteUrl,
          totalSupportAmount: products.totalSupportAmount,
          verificationStatus: products.verificationStatus,
          moderationStatus: products.moderationStatus,
        })
        .from(products)
        .where(existingProductQuery)
        .limit(1);

      if (found) {
        existingProduct = found;
      }
    }

    if (existingProduct && !normalizedUrl) {
      normalizedUrl = existingProduct.websiteUrl;
    }

    let productId = existingProduct?.id;
    let finalSlug = existingProduct?.slug;
    let finalName = existingProduct?.name;

    if (!existingProduct) {
      const baseSlug = createSlug(metadataName || "product") || "product";
      let candidateSlug = baseSlug;

      for (let seq = 1; seq <= 1000; seq++) {
        const [taken] = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.slug, candidateSlug))
          .limit(1);

        if (!taken) break;
        candidateSlug = createSlugCandidate(baseSlug, seq);
      }

      const [inserted] = await db
        .insert(products)
        .values({
          name: metadataName || "Product",
          slug: candidateSlug,
          description: metadataDesc || "Directly added verified product.",
          websiteUrl: normalizedUrl,
          logoUrl: metadataLogo || null,
          categoryId: resolvedCategory.id,
          ownerEmail: body.makerName
            ? `${body.makerName.toLowerCase().replace(/[^a-z0-9]/g, "")}@${new URL(normalizedUrl).hostname}`
            : `founder@${new URL(normalizedUrl).hostname}`,
          makerName: body.makerName || null,
          twitterHandle: metadataTwitter || null,
          githubUrl: metadataGithub || null,
          discordUrl: metadataDiscord || null,
          verificationStatus: "verified",
          moderationStatus: "approved",
          totalSupportAmount: canonicalINRString,
          supportCurrency: "INR",
        })
        .returning({
          id: products.id,
          name: products.name,
          slug: products.slug,
          totalSupportAmount: products.totalSupportAmount,
        });

      productId = inserted.id;
      finalSlug = inserted.slug;
      finalName = inserted.name;
    } else {
      const currentSupport = parseFloat(existingProduct.totalSupportAmount || "0");
      const newSupport = currentSupport + canonicalAmountINRNum;

      await db
        .update(products)
        .set({
          verificationStatus: "verified",
          moderationStatus: "approved",
          totalSupportAmount: newSupport.toFixed(2),
          supportCurrency: "INR",
          ...(metadataLogo ? { logoUrl: metadataLogo } : {}),
          ...(metadataDesc ? { description: metadataDesc } : {}),
          ...(metadataTwitter ? { twitterHandle: metadataTwitter } : {}),
          ...(metadataGithub ? { githubUrl: metadataGithub } : {}),
          ...(metadataDiscord ? { discordUrl: metadataDiscord } : {}),
        })
        .where(eq(products.id, existingProduct.id));

      finalSlug = existingProduct.slug;
      finalName = existingProduct.name;
    }

    if (!productId) {
      return NextResponse.json({ error: "Failed to resolve product identity." }, { status: 500 });
    }

    // Insert authoritative Financial Contribution Record
    const [contribution] = await db
      .insert(contributions)
      .values({
        productId,
        amount: canonicalINRString,
        currency: "INR",
        canonicalAmount: canonicalINRString,
        canonicalCurrency: "INR",
        chargedAmount: chargedAmountString,
        chargedCurrency,
        exchangeRate: lockedRate.toString(),
        exchangeRateTimestamp: new Date(rateTimestamp),
        status: "succeeded",
        contributorEmail: "backer@demo-payment.outrank.io",
      })
      .returning({ id: contributions.id });

    // Insert authoritative Financial Payment Record
    const [payment] = await db
      .insert(payments)
      .values({
        contributionId: contribution.id,
        provider: "demo_gateway",
        providerPaymentId: `demo_pm_${Date.now()}`,
        amount: canonicalINRString,
        currency: "INR",
        canonicalAmount: canonicalINRString,
        canonicalCurrency: "INR",
        chargedAmount: chargedAmountString,
        chargedCurrency,
        exchangeRate: lockedRate.toString(),
        exchangeRateTimestamp: new Date(rateTimestamp),
        status: "succeeded",
      })
      .returning({ id: payments.id });

    // Link paymentId back to contribution
    await db
      .update(contributions)
      .set({ paymentId: payment.id })
      .where(eq(contributions.id, contribution.id));

    // Audit log
    await db.insert(productEvents).values({
      productId,
      contributionId: contribution.id,
      paymentId: payment.id,
      eventType: "payment_succeeded",
      amount: canonicalINRString,
      metadata: {
        canonicalAmountINR: canonicalAmountINRNum,
        chargedAmount: chargedAmountNum,
        chargedCurrency,
        exchangeRate: lockedRate,
        provider: "demo_gateway",
        source: "direct_regional_claim",
      },
    });

    return NextResponse.json({
      success: true,
      directClaim: true,
      productId,
      productName: finalName,
      productSlug: finalSlug,
      canonicalAmountINR: canonicalAmountINRNum,
      chargedAmount: chargedAmountNum,
      chargedCurrency,
      message: `Product ${finalName} successfully ranked with ₹${canonicalAmountINRNum.toLocaleString()} INR confirmed support!`,
    });
  } catch (error: unknown) {
    console.error("Direct claim error:", error);
    const message = error instanceof Error ? error.message : "Unable to process claim.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
