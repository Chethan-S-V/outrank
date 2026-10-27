import Link from "next/link";
import { CategoryBadge } from "@/components/products/category-badge";
import { ProductLogo } from "@/components/products/product-logo";
import type { PublicProduct } from "@/services/products";
import { RankBadge } from "./rank-badge";

function getDomain(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return value; }
}

export function LeaderboardRow({ product }: { product: PublicProduct }) {
  return (
    <article className="group grid gap-4 border-b border-[var(--border)] px-4 py-5 transition hover:bg-[var(--surface-hover)] sm:grid-cols-[auto_auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <RankBadge rank={product.rank} />
      <ProductLogo name={product.name} src={product.logoUrl} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h2 className="truncate text-base font-semibold text-[var(--text-primary)]">
            <Link className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]" href={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h2>
          <CategoryBadge name={product.categoryName} slug={product.categorySlug} />
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-[var(--text-secondary)]">{product.description}</p>
        <p className="mt-2 text-xs text-[var(--text-muted)]">{getDomain(product.websiteUrl)}</p>
      </div>
      <div className="flex items-center justify-between gap-5 border-t border-[var(--border)] pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
        <div>
          <p className="text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)]">Confirmed support</p>
          <p className="mt-1 font-mono text-sm font-semibold text-[var(--text-primary)]">
            {product.supportCurrency} {product.totalSupportAmount}
          </p>
        </div>
        <Link
          className="shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all sm:mt-2.5"
          style={{ backgroundColor: "#ffffff", color: "#000000" }}
          href={`/products/${product.slug}`}
        >
          <span style={{ color: "#000000", fontWeight: 800 }}>View →</span>
        </Link>
      </div>
    </article>
  );
}
