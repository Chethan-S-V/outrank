import Link from "next/link";
import { CategoryIcon } from "@/components/outrank/category-icon";

export function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)] transition-colors"
      href={`/categories/${slug}`}
    >
      <CategoryIcon slug={slug} category={name} className="w-3 h-3 shrink-0" />
      <span>{name}</span>
    </Link>
  );
}
