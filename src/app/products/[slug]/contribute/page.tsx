import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductLogo } from "@/components/products/product-logo";
import { ContributionForm } from "@/components/outrank/contribution-form";
import { getPublicProductBySlug } from "@/services/products";

type ContributionPageProps = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export default async function ContributionPage({ params }: ContributionPageProps) {
  let product;
  try { product = await getPublicProductBySlug((await params).slug); } catch { notFound(); }
  if (!product) notFound();
  return <main className="outrank-public-page"><Link className="outrank-secondary-link" href={`/products/${product.slug}`}>Back to product</Link><section className="outrank-contribution-product"><ProductLogo name={product.name} src={product.logoUrl} /><div><p>Current rank #{product.rank}</p><h1>Support {product.name}</h1><p>{product.description}</p></div></section><ContributionForm productId={product.id} productName={product.name} totalSupportAmount={product.totalSupportAmount} /></main>;
}
