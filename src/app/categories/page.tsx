import { CategoryDiscovery } from "@/components/outrank/category-discovery";
import { PublicPageHeading } from "@/components/outrank/public-page-heading";
import { getPublicCategories, getPublicProducts, type PublicCategory, type PublicProduct } from "@/services/products";

export const metadata = {
  title: "Categories & Sectors Directory | Outrank",
  description:
    "Explore sovereign categories, industries, and platforms ranking globally on Outrank. Discover where ranks are getting claimed right now.",
};

export const revalidate = 60;

export default async function CategoriesPage() {
  let categories: PublicCategory[] = [];
  let products: PublicProduct[] = [];
  try {
    [categories, products] = await Promise.all([
      getPublicCategories(),
      getPublicProducts({ limit: 100 }),
    ]);
  } catch {
    categories = [];
    products = [];
  }

  return (
    <main className="outrank-public-page max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <PublicPageHeading
        title="Explore Categories"
        eyebrow="Categories & Industries"
        description="Browse categories, industries, and platforms ranking globally on Outrank."
      />
      {categories.length > 0 ? (
        <CategoryDiscovery categories={categories} products={products} />
      ) : (
        <section className="text-center py-12 border border-[var(--border)] rounded-2xl bg-[var(--surface)]">
          <h2 className="text-base font-bold text-[var(--text-primary)]">No categories available yet.</h2>
          <p className="text-xs text-[var(--text-muted)] mt-1">Categories will appear once loaded.</p>
        </section>
      )}
    </main>
  );
}
