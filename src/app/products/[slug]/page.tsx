import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductBySlug } from "@/services/products";
import { ProductDetailView } from "@/components/outrank/product-detail-view";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getPublicProductBySlug((await params).slug);
    return product
      ? {
          title: `${product.name} — Full Overview & Ranking | Outrank`,
          description: product.description,
        }
      : { title: "Product Not Found | Outrank" };
  } catch {
    return { title: "Product | Outrank" };
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product;
  try {
    product = await getPublicProductBySlug(slug);
  } catch {
    notFound();
  }

  if (!product) notFound();

  return <ProductDetailView product={product} />;
}
