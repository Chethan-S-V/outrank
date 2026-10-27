import { PageShell } from "@/components/layout/page-shell";
import { ProductSubmissionForm } from "@/components/forms/product-submission-form";
import { getActiveCategories } from "@/services/products";
import type { ProductSubmissionCategory } from "@/types";

type SubmitPageProps = {
  searchParams: Promise<{
    websiteUrl?: string;
    categoryId?: string;
    twitterHandle?: string;
    githubUrl?: string;
    discordUrl?: string;
    amount?: string;
  }>;
};

export default async function SubmitPage({ searchParams }: SubmitPageProps) {
  let categories: ProductSubmissionCategory[] = [];
  let categoriesUnavailable = false;

  try {
    categories = await getActiveCategories();
  } catch {
    categoriesUnavailable = true;
  }

  const { websiteUrl, categoryId, twitterHandle, githubUrl, discordUrl } =
    await searchParams;
  const selectedCategoryId =
    categoryId && categories.some((category) => category.id === categoryId)
      ? categoryId
      : "";

  return (
    <PageShell
      title="Submit a product"
      description="Share your product with the Outrank community. Every submission is reviewed before it can appear publicly."
    >
      <ProductSubmissionForm
        categories={categories}
        categoriesUnavailable={categoriesUnavailable}
        initialValues={{
          websiteUrl: websiteUrl ?? "",
          categoryId: selectedCategoryId,
          twitterHandle: twitterHandle ?? "",
          githubUrl: githubUrl ?? "",
          discordUrl: discordUrl ?? "",
        }}
      />
    </PageShell>
  );
}
