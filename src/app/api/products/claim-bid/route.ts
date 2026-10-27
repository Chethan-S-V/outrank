import { NextResponse } from "next/server";
import { eq, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, products, productEvents, contributions } from "@/db/schema";
import { createSlug, createSlugCandidate } from "@/lib/utils/slug";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      websiteUrl,
      name,
      description,
      logoUrl,
      categorySlug = "productivity",
      bidAmount = 100,
      currency = "INR",
      canonicalINR = 100,
      ownerEmail = "founder@outrank.org",
      makerName,
      twitterHandle,
      githubUrl,
      discordUrl,
      productId,
      razorpay_payment_id,
      razorpay_order_id,
    } = body;

    const db = getDb();
    const numericCanonicalINR = Math.max(1, Math.round(Number(canonicalINR) || Number(bidAmount) || 100));

    // Case 1: Existing product bid update
    if (productId) {
      const [existing] = await db
        .select()
        .from(products)
        .where(eq(products.id, productId))
        .limit(1);

      if (existing) {
        const currentAmount = parseFloat(existing.totalSupportAmount || "0");
        const newTotal = (currentAmount + numericCanonicalINR).toFixed(2);

        await db
          .update(products)
          .set({
            totalSupportAmount: newTotal,
            updatedAt: new Date(),
          })
          .where(eq(products.id, productId));

        // Record confirmed contribution
        try {
          await db.insert(contributions).values({
            productId: existing.id,
            amount: String(numericCanonicalINR),
            currency: currency || "INR",
            canonicalAmount: String(numericCanonicalINR),
            status: "succeeded",
            contributorEmail: ownerEmail || "founder@outrank.org",
          });

          await db.insert(productEvents).values({
            productId: existing.id,
            eventType: "contribution_created",
            metadata: {
              amount: String(numericCanonicalINR),
              currency,
              paymentId: razorpay_payment_id,
              source: "product_bid",
            },
          });
        } catch {}

        return NextResponse.json({
          success: true,
          action: "updated",
          product: {
            id: existing.id,
            slug: existing.slug,
            name: existing.name,
            totalSupportAmount: newTotal,
          },
        });
      }
    }

    // Case 2: New Product Claim / Instant Add
    if (!websiteUrl) {
      return NextResponse.json({ error: "Website URL is required." }, { status: 400 });
    }

    const cleanUrl = String(websiteUrl).trim().replace(/\/+$/, "");

    // Check if website URL already exists
    const [duplicate] = await db
      .select()
      .from(products)
      .where(
        or(
          eq(products.websiteUrl, cleanUrl),
          eq(products.websiteUrl, `${cleanUrl}/`),
          sql`LOWER(${products.websiteUrl}) = LOWER(${cleanUrl})`
        )
      )
      .limit(1);

    if (duplicate) {
      // Elevate existing product's rank bid
      const currentAmount = parseFloat(duplicate.totalSupportAmount || "0");
      const newTotal = (currentAmount + numericCanonicalINR).toFixed(2);

      await db
        .update(products)
        .set({
          totalSupportAmount: newTotal,
          name: name ? String(name).trim() : duplicate.name,
          description: description ? String(description).trim() : duplicate.description,
          logoUrl: logoUrl || duplicate.logoUrl,
          updatedAt: new Date(),
        })
        .where(eq(products.id, duplicate.id));

      try {
        await db.insert(contributions).values({
          productId: duplicate.id,
          amount: String(numericCanonicalINR),
          currency: currency || "INR",
          canonicalAmount: String(numericCanonicalINR),
          status: "succeeded",
          contributorEmail: ownerEmail || "founder@outrank.org",
        });
      } catch {}

      return NextResponse.json({
        success: true,
        action: "elevated",
        product: {
          id: duplicate.id,
          slug: duplicate.slug,
          name: duplicate.name,
          totalSupportAmount: newTotal,
        },
      });
    }

    // Match or fallback category
    let matchedCategory;
    const catList = await db.select().from(categories);

    if (categorySlug) {
      matchedCategory = catList.find(
        (c) =>
          c.slug.toLowerCase() === String(categorySlug).toLowerCase() ||
          c.id === categorySlug
      );
    }

    if (!matchedCategory && catList.length > 0) {
      matchedCategory = catList[0];
    }

    if (!matchedCategory) {
      // Create initial default category if none exist
      const [newCat] = await db
        .insert(categories)
        .values({
          name: "Productivity & SaaS",
          slug: "productivity",
          description: "Software, tools, and digital innovation.",
          isActive: true,
        })
        .returning();
      matchedCategory = newCat;
    }

    // Generate unique slug
    const productName = String(name || "Product Showcase").trim();
    const baseSlug = createSlug(productName) || "product";
    let finalSlug = baseSlug;

    for (let seq = 1; seq <= 500; seq++) {
      const candidate = createSlugCandidate(baseSlug, seq);
      const [existingSlug] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, candidate))
        .limit(1);

      if (!existingSlug) {
        finalSlug = candidate;
        break;
      }
    }

    // Insert verified live product directly into Postgres
    const [newProduct] = await db
      .insert(products)
      .values({
        name: productName,
        slug: finalSlug,
        description: String(description || "Verified showcase ranking on Outrank.").trim(),
        websiteUrl: cleanUrl,
        logoUrl: logoUrl ? String(logoUrl).trim() : null,
        categoryId: matchedCategory.id,
        ownerEmail: String(ownerEmail || "founder@outrank.org").trim().toLowerCase(),
        makerName: makerName ? String(makerName).trim() : null,
        twitterHandle: twitterHandle ? String(twitterHandle).trim() : null,
        githubUrl: githubUrl ? String(githubUrl).trim() : null,
        discordUrl: discordUrl ? String(discordUrl).trim() : null,
        verificationStatus: "verified",
        moderationStatus: "approved",
        totalSupportAmount: String(numericCanonicalINR.toFixed(2)),
        supportCurrency: currency || "INR",
      })
      .returning();

    // Insert initial contribution record and event
    try {
      await db.insert(contributions).values({
        productId: newProduct.id,
        amount: String(numericCanonicalINR),
        currency: currency || "INR",
        canonicalAmount: String(numericCanonicalINR),
        status: "succeeded",
        contributorEmail: ownerEmail || "founder@outrank.org",
      });

      await db.insert(productEvents).values({
        productId: newProduct.id,
        eventType: "product_created",
        metadata: {
          name: newProduct.name,
          categoryId: matchedCategory.id,
          bidAmount: String(numericCanonicalINR),
          currency,
          source: "claim_instant",
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      action: "created",
      product: {
        id: newProduct.id,
        slug: newProduct.slug,
        name: newProduct.name,
        totalSupportAmount: newProduct.totalSupportAmount,
      },
    });
  } catch (err: any) {
    console.error("[Claim Bid Error]:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to process product claim bid." },
      { status: 500 }
    );
  }
}
