import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { categories, productEvents, products } from "@/db/schema";
import {
  productSubmissionSchema,
  type ProductSubmissionInput,
} from "@/lib/validations";
import { createSlug, createSlugCandidate } from "@/lib/utils/slug";
import type { ProductSubmissionFieldErrors } from "@/types";

type ProductSubmissionErrorCode =
  | "INVALID_INPUT"
  | "CATEGORY_NOT_FOUND"
  | "CATEGORY_INACTIVE"
  | "DUPLICATE_PRODUCT";

export class ProductSubmissionError extends Error {
  constructor(
    public readonly code: ProductSubmissionErrorCode,
    message: string,
    public readonly fieldErrors?: ProductSubmissionFieldErrors,
  ) {
    super(message);
  }
}

export type SubmittedProduct = {
  name: string;
  slug: string;
  verificationStatus: "pending" | "verified";
  moderationStatus: "pending" | "approved";
};

function getFieldErrors(
  error: z.ZodError<z.input<typeof productSubmissionSchema>>,
): ProductSubmissionFieldErrors {
  return z.flattenError(error).fieldErrors;
}

async function findAvailableSlug(
  input: ProductSubmissionInput,
  findProductBySlug: (slug: string) => Promise<boolean>,
) {
  const baseSlug = createSlug(input.name) || "product";

  for (let sequence = 1; sequence <= 1000; sequence += 1) {
    const slug = createSlugCandidate(baseSlug, sequence);

    if (!(await findProductBySlug(slug))) {
      return slug;
    }
  }

  throw new ProductSubmissionError(
    "DUPLICATE_PRODUCT",
    "A product with a similar name already exists.",
  );
}

export async function createProduct(input: unknown): Promise<SubmittedProduct> {
  const parsedInput = productSubmissionSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new ProductSubmissionError(
      "INVALID_INPUT",
      "Please correct the highlighted fields.",
      getFieldErrors(parsedInput.error),
    );
  }

  const submittedProduct = parsedInput.data;
  const db = getDb();

  return db.transaction(async (tx) => {
    const [category] = await tx
      .select({ id: categories.id, isActive: categories.isActive })
      .from(categories)
      .where(eq(categories.id, submittedProduct.categoryId))
      .limit(1);

    if (!category) {
      throw new ProductSubmissionError(
        "CATEGORY_NOT_FOUND",
        "The selected category does not exist.",
      );
    }

    if (!category.isActive) {
      throw new ProductSubmissionError(
        "CATEGORY_INACTIVE",
        "The selected category is not accepting submissions.",
      );
    }

    const [existingWebsite] = await tx
      .select({ id: products.id })
      .from(products)
      .where(eq(products.websiteUrl, submittedProduct.websiteUrl))
      .limit(1);

    if (existingWebsite) {
      throw new ProductSubmissionError(
        "DUPLICATE_PRODUCT",
        "A product with this website has already been submitted.",
      );
    }

    const slug = await findAvailableSlug(submittedProduct, async (candidate) => {
      const [existingProduct] = await tx
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, candidate))
        .limit(1);

      return Boolean(existingProduct);
    });

    const [product] = await tx
      .insert(products)
      .values({
        name: submittedProduct.name,
        slug,
        description: submittedProduct.description,
        websiteUrl: submittedProduct.websiteUrl,
        logoUrl: submittedProduct.logoUrl,
        categoryId: submittedProduct.categoryId,
        ownerEmail: submittedProduct.ownerEmail,
        makerName: submittedProduct.makerName,
        twitterHandle: submittedProduct.twitterHandle,
        githubUrl: submittedProduct.githubUrl,
        discordUrl: submittedProduct.discordUrl,
        verificationStatus: "verified",
        moderationStatus: "approved",
        totalSupportAmount: "0",
        supportCurrency: "USD",
      })
      .returning({
        id: products.id,
        name: products.name,
        slug: products.slug,
        verificationStatus: products.verificationStatus,
        moderationStatus: products.moderationStatus,
      });

    await tx.insert(productEvents).values({
      productId: product.id,
      eventType: "product_created",
      metadata: {
        name: product.name,
        categoryId: submittedProduct.categoryId,
        source: "product_submission",
      },
    });

    return {
      name: product.name,
      slug: product.slug,
      verificationStatus: "verified",
      moderationStatus: "approved",
    };
  });
}
