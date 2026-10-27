import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import { CategoryIcon } from "@/components/outrank/category-icon";
import { RankingList } from "@/components/outrank/ranking-list";
import { VerifiedBadge } from "@/components/outrank/verified-badge";
import { getPublicCategoryBySlug, getPublicProducts } from "@/services/products";

type CategoryPageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category;
  let products = [];

  try {
    [category, products] = await Promise.all([
      getPublicCategoryBySlug(slug),
      getPublicProducts({ category: slug, limit: 5000 }),
    ]);
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <main className="outrank-main w-full space-y-6 pb-12">
      {/* 1. Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
        <Link
          href="/categories"
          className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Categories</span>
        </Link>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-bold">{category.name}</span>
      </div>

      {/* 2. Category Hero Header */}
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-950/30 border border-purple-500/20 text-[#7446d8] dark:text-[#c084fc] flex items-center justify-center shrink-0 shadow-sm">
              <CategoryIcon category={category.name} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] tracking-tight">
                  {category.name}
                </h1>
                <VerifiedBadge size="md" />
                <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                  {products.length} {products.length === 1 ? "Product" : "Products"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
                {category.description || `Explore and support top verified products in ${category.name}.`}
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] hover:bg-[var(--surface-hover)] text-xs font-bold text-[var(--text-primary)] transition-colors shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Claim Top Rank</span>
          </Link>
        </div>
      </section>

      {/* 3. Products Leaderboard List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm sm:text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#7446d8]" />
            <span>Ranked Products in {category.name}</span>
          </h2>
          <span className="text-xs font-mono text-[var(--text-muted)]">
            Sorted by verified community backing
          </span>
        </div>

        <RankingList products={products} />
      </section>
    </main>
  );
}
