import { HomeExperience } from "@/components/outrank/home-experience";
import { getActiveCategories, getPublicProducts, type PublicProduct } from "@/services/products";
import type { ProductSubmissionCategory } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  let products: PublicProduct[] = [];
  let categories: ProductSubmissionCategory[] = [];
  let categoriesUnavailable = false;

  try {
    [products, categories] = await Promise.all([getPublicProducts({ limit: 5000 }), getActiveCategories()]);
  } catch {
    categoriesUnavailable = true;
  }

  return <HomeExperience categories={categories} categoriesUnavailable={categoriesUnavailable} products={products} />;
}
