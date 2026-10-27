import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { SidebarProductRow } from "./sidebar-product-row";

export type TodayRankingItem = {
  amount: string | null;
  logoUrl?: string | null;
  name: string;
  rank: number;
  slug?: string;
};

type TodaysRankingProps = {
  items?: readonly TodayRankingItem[];
};

export function TodaysRanking({ items = [] }: TodaysRankingProps) {
  return (
    <section aria-labelledby="todays-ranking-title" className="outrank-right-card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-2xl shadow-xs">
      <div className="outrank-right-card-header flex items-center justify-between mb-3 gap-2">
        <h2 id="todays-ranking-title" className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5 uppercase tracking-wider shrink-0">
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" aria-hidden="true" />
          <span>Today&apos;s Ranking</span>
        </h2>
        <Link href="/daily" className="text-[11px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-0.5 shrink-0 whitespace-nowrap">
          <span>See all</span>
          <ArrowRight className="w-3 h-3 shrink-0" aria-hidden="true" />
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="outrank-right-product-list space-y-1.5">
          {items.slice(0, 5).map((item) => (
            <SidebarProductRow
              amount={item.amount}
              key={item.rank}
              logoUrl={item.logoUrl}
              name={item.name}
              rank={item.rank}
              slug={item.slug}
            />
          ))}
        </div>
      ) : (
        <p className="text-xs text-[var(--text-muted)] py-4 text-center border border-dashed border-[var(--border)] rounded-xl">
          No rankings recorded today yet
        </p>
      )}
    </section>
  );
}
