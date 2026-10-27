import { TrendingUp } from "lucide-react";
import { SidebarProductRow } from "./sidebar-product-row";

export type TrendingProduct = {
  changePercent: number | null;
  logoUrl?: string | null;
  name: string;
  rank: number;
  slug?: string;
};

type TrendingThisWeekProps = {
  items?: readonly TrendingProduct[];
};

export function TrendingThisWeek({ items = [] }: TrendingThisWeekProps) {
  return (
    <section aria-labelledby="trending-this-week-title" className="outrank-right-card border border-[var(--border)] bg-[var(--surface)] p-4 rounded-2xl shadow-xs">
      <div className="outrank-right-card-header flex items-center justify-between mb-3 gap-2">
        <h2 id="trending-this-week-title" className="text-xs font-bold text-[#7446d8] dark:text-[#a278ff] flex items-center gap-1.5 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-[#7446d8] dark:text-[#a278ff]" aria-hidden="true" />
          <span>Trending This Week</span>
        </h2>
      </div>

      {items.length > 0 ? (
        <div className="outrank-right-product-list space-y-1.5">
          {items.slice(0, 5).map((item) => (
            <SidebarProductRow
              changePercent={item.changePercent}
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
          No weekly trend data yet
        </p>
      )}
    </section>
  );
}
