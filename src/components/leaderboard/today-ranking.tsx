import Link from "next/link";
import { ProductLogo } from "@/components/products/product-logo";
import type { PublicProduct } from "@/services/products";
import { RankBadge } from "./rank-badge";

export function TodayRanking({ products }: { products: PublicProduct[] }) {
  return <aside className="border border-[var(--border)] bg-[var(--surface)]"><div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4"><h2 className="text-sm font-semibold text-[var(--text-primary)]">Current ranking</h2><span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_14px_var(--accent)]" /></div>{products.length ? <ol className="divide-y divide-[var(--border)]">{products.slice(0, 5).map((product) => <li key={product.slug}><Link className="flex items-center gap-3 px-4 py-3 transition hover:bg-[var(--surface-hover)]" href={`/products/${product.slug}`}><RankBadge rank={product.rank} /><ProductLogo name={product.name} src={product.logoUrl} /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-[var(--text-primary)]">{product.name}</span><span className="mt-0.5 block font-mono text-xs text-[var(--text-muted)]">{product.supportCurrency} {product.totalSupportAmount}</span></span></Link></li>)}</ol> : <p className="px-5 py-8 text-sm leading-6 text-[var(--text-muted)]">Live rankings will appear once verified products are available.</p>}</aside>;
}
