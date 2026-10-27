import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { PageContainer } from "@/components/layout/page-container";
import { getDb } from "@/db";
import { contributions, products } from "@/db/schema";

export const metadata: Metadata = {
  title: "Contribution Confirmed | Outrank",
  description: "Your product contribution has been verified.",
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ contribution_id?: string; session_id?: string }>;
};

export default async function PaymentSuccessPage({ searchParams }: Props) {
  const { contribution_id } = await searchParams;

  let record;
  if (contribution_id) {
    try {
      const db = getDb();
      const [row] = await db
        .select({
          contributionId: contributions.id,
          amount: contributions.amount,
          currency: contributions.currency,
          status: contributions.status,
          updatedAt: contributions.updatedAt,
          productName: products.name,
          productSlug: products.slug,
          totalSupportAmount: products.totalSupportAmount,
        })
        .from(contributions)
        .innerJoin(products, eq(contributions.productId, products.id))
        .where(eq(contributions.id, contribution_id))
        .limit(1);

      record = row;
    } catch {
      record = undefined;
    }
  }

  return (
    <PageContainer>
      <main className="py-16 sm:py-24 max-w-xl mx-auto">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 text-center">
          {record && record.status === "succeeded" ? (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="mt-5 inline-block text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                Confirmed Support
              </span>
              <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                Contribution Confirmed!
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)]">
                Your support for{" "}
                <span className="font-semibold text-[var(--text-primary)]">
                  {record.productName}
                </span>{" "}
                has been verified and locked into the Outrank index.
              </p>

              <div className="mt-8 border-y border-[var(--border)] py-5 grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">Your Backing</p>
                  <p className="mt-1 font-mono text-xl font-bold text-[var(--accent)]">
                    ${record.amount} {record.currency}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)]">New Total Support</p>
                  <p className="mt-1 font-mono text-xl font-bold text-[var(--text-primary)]">
                    ${record.totalSupportAmount} USD
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  className="h-11 inline-flex items-center justify-center bg-[var(--accent)] px-6 text-sm font-semibold text-[#1a100d] hover:bg-[var(--accent-strong)] transition-colors"
                  href={`/products/${record.productSlug}`}
                >
                  View Product Page
                </Link>
                <Link
                  className="h-11 inline-flex items-center justify-center border border-[var(--border)] px-6 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  href="/leaderboard"
                >
                  Global Leaderboard
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <svg
                  className="h-7 w-7 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              </div>

              <h1 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">
                Payment Verification in Progress
              </h1>
              <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                Outrank only confirms rankings upon receiving verified payment provider confirmation.
                Once confirmed, the product position will update automatically.
              </p>

              <div className="mt-8">
                <Link
                  className="h-11 inline-flex items-center justify-center bg-[var(--accent)] px-6 text-sm font-semibold text-[#1a100d] hover:bg-[var(--accent-strong)] transition-colors"
                  href="/leaderboard"
                >
                  Return to Leaderboard
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </PageContainer>
  );
}
