import { redirect } from "next/navigation";
import { count, desc, eq } from "drizzle-orm";
import { isServerAdminAuthenticated } from "@/lib/auth/admin";
import { getDb } from "@/db";
import { categories, products, productEvents, contributions } from "@/db/schema";
import { AdminDashboard } from "./admin-dashboard";
import { getExchangeRates } from "@/services/currency/exchange-rate-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuth = await isServerAdminAuthenticated();
  if (!isAuth) {
    redirect("/admin/login");
  }

  const db = getDb();

  const [allProducts, events, allContributions, categoriesList, ratesSnapshot] =
    await Promise.all([
      db
        .select({
          id: products.id,
          name: products.name,
          slug: products.slug,
          websiteUrl: products.websiteUrl,
          categoryName: categories.name,
          ownerEmail: products.ownerEmail,
          makerName: products.makerName,
          twitterHandle: products.twitterHandle,
          verificationStatus: products.verificationStatus,
          moderationStatus: products.moderationStatus,
          totalSupportAmount: products.totalSupportAmount,
          supportCurrency: products.supportCurrency,
          createdAt: products.createdAt,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .orderBy(desc(products.createdAt)),

      db
        .select({
          id: productEvents.id,
          productName: products.name,
          eventType: productEvents.eventType,
          amount: productEvents.amount,
          createdAt: productEvents.createdAt,
        })
        .from(productEvents)
        .leftJoin(products, eq(productEvents.productId, products.id))
        .orderBy(desc(productEvents.createdAt))
        .limit(100),

      db
        .select({
          id: contributions.id,
          productName: products.name,
          amount: contributions.amount,
          currency: contributions.currency,
          canonicalAmount: contributions.canonicalAmount,
          canonicalCurrency: contributions.canonicalCurrency,
          chargedAmount: contributions.chargedAmount,
          chargedCurrency: contributions.chargedCurrency,
          exchangeRate: contributions.exchangeRate,
          exchangeRateTimestamp: contributions.exchangeRateTimestamp,
          status: contributions.status,
          contributorEmail: contributions.contributorEmail,
          createdAt: contributions.createdAt,
        })
        .from(contributions)
        .leftJoin(products, eq(contributions.productId, products.id))
        .orderBy(desc(contributions.createdAt))
        .limit(100),

      db
        .select({
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          isActive: categories.isActive,
          productCount: count(products.id).mapWith(Number),
        })
        .from(categories)
        .leftJoin(products, eq(categories.id, products.categoryId))
        .groupBy(categories.id, categories.name, categories.slug, categories.description, categories.isActive)
        .orderBy(categories.name),

      getExchangeRates(),
    ]);

  return (
    <div className="w-full">
      <AdminDashboard
        products={allProducts}
        events={events}
        contributions={allContributions}
        categories={categoriesList}
        ratesTelemetry={ratesSnapshot}
      />
    </div>
  );
}
