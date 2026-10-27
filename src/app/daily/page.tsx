import type { Metadata } from "next";
import { getPublicProducts } from "@/services/products";
import { RankingRow } from "@/components/outrank/ranking-row";
import { Zap, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Today's Rankings | Outrank",
  description: "Explore the top products and confirmed daily visibility on Outrank.",
};

export const revalidate = 60;

export default async function DailyPage() {
  const products = await getPublicProducts({ limit: 50 });
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="outrank-main py-6">
      <div className="border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8 rounded-2xl mb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">
          <Zap className="w-4 h-4 fill-amber-500" />
          <span>Daily Leaderboard</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
          Today&apos;s Product Rankings
        </h1>
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>Snapshot for {todayDate} • Ranked by confirmed support</span>
        </div>
      </div>

      {products.length > 0 ? (
        <section aria-label="Daily product list" className="space-y-3">
          {products.map((product, index) => (
            <RankingRow key={product.id} product={product} rank={index + 1} />
          ))}
        </section>
      ) : (
        <div className="p-12 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]">
          <p className="text-sm text-[var(--text-muted)]">No eligible products have confirmed support today yet.</p>
        </div>
      )}
    </main>
  );
}
