import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export const metadata: Metadata = {
  title: "Contribution Cancelled | Outrank",
  description: "The payment process was cancelled.",
};

type Props = {
  searchParams: Promise<{ slug?: string; contribution_id?: string }>;
};

export default async function PaymentCancelledPage({ searchParams }: Props) {
  const { slug } = await searchParams;

  return (
    <PageContainer>
      <main className="py-16 sm:py-24 max-w-xl mx-auto">
        <div className="border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-400">
            <svg
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-5 text-2xl font-semibold text-[var(--text-primary)]">
            Contribution Cancelled
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            No charge was made, and no ranking points were attributed. You can try again anytime.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {slug && (
              <Link
                className="h-11 inline-flex items-center justify-center bg-[var(--accent)] px-6 text-sm font-semibold text-[#1a100d] hover:bg-[var(--accent-strong)] transition-colors"
                href={`/products/${slug}/contribute`}
              >
                Try Again
              </Link>
            )}
            <Link
              className="h-11 inline-flex items-center justify-center border border-[var(--border)] px-6 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              href="/leaderboard"
            >
              Back to Leaderboard
            </Link>
          </div>
        </div>
      </main>
    </PageContainer>
  );
}
