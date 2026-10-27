import Link from "next/link";
import type { PublicCategory } from "@/services/products";
import { CategoryIcon } from "@/components/outrank/category-icon";
import { Compass } from "lucide-react";

export function CategoryBar({ categories, selected }: { categories: PublicCategory[]; selected?: string }) {
  const itemClass = (active: boolean) =>
    `shrink-0 inline-flex items-center gap-1.5 border rounded-xl px-3 py-2 text-xs font-semibold transition ${
      active
        ? "border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm"
        : "border-[var(--border)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/60 hover:text-[var(--text-primary)]"
    }`;

  return (
    <nav aria-label="Product categories" className="-mx-5 overflow-x-auto px-5 pb-1 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10">
      <div className="flex w-max gap-2 items-center">
        <Link className={itemClass(!selected)} href="/leaderboard">
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span>All products</span>
        </Link>
        {categories.map((category) => (
          <Link
            className={itemClass(selected === category.slug)}
            href={`/leaderboard?category=${encodeURIComponent(category.slug)}`}
            key={category.slug}
          >
            <CategoryIcon slug={category.slug} category={category.name} className="w-3.5 h-3.5 shrink-0" />
            <span>{category.name}</span>
          </Link>
        ))}
        <Link className={itemClass(false)} href="/categories">
          <Compass className="w-3.5 h-3.5 shrink-0" />
          <span>Explore All</span>
        </Link>
      </div>
    </nav>
  );
}
