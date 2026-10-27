import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productEvents, products } from "@/db/schema";
import {
  moderationStatuses,
  productModerationParamsSchema,
  productModerationSchema,
  verificationStatuses,
  type ProductModerationInput,
} from "@/lib/validations";

type VerificationStatus = (typeof verificationStatuses)[number];
type ModerationStatus = (typeof moderationStatuses)[number];

type ProductModerationErrorCode =
  | "INVALID_INPUT"
  | "PRODUCT_NOT_FOUND"
  | "INVALID_TRANSITION";

export class ProductModerationError extends Error {
  constructor(
    public readonly code: ProductModerationErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export type ModeratedProduct = {
  slug: string;
  verificationStatus: VerificationStatus;
  moderationStatus: ModerationStatus;
};

const verificationTransitions: Record<
  VerificationStatus,
  readonly VerificationStatus[]
> = {
  pending: ["verified", "rejected"],
  verified: ["rejected"],
  rejected: [],
};

const moderationTransitions: Record<ModerationStatus, readonly ModerationStatus[]> = {
  pending: ["approved", "rejected", "suspended"],
  approved: ["rejected", "suspended"],
  rejected: ["approved"],
  suspended: ["approved"],
};

function assertTransition<Status extends string>(
  currentStatus: Status,
  nextStatus: Status | undefined,
  transitions: Record<Status, readonly Status[]>,
  label: string,
) {
  if (
    nextStatus !== undefined &&
    nextStatus !== currentStatus &&
    !transitions[currentStatus].includes(nextStatus)
  ) {
    throw new ProductModerationError(
      "INVALID_TRANSITION",
      `This ${label} status change is not allowed.`,
    );
  }
}

function verificationEventType(status: VerificationStatus) {
  return status === "verified" ? "product_verified" : "product_rejected";
}

function moderationEventType(status: ModerationStatus) {
  switch (status) {
    case "approved":
      return "product_approved";
    case "rejected":
      return "product_moderation_rejected";
    case "suspended":
      return "product_suspended";
    default:
      throw new ProductModerationError(
        "INVALID_TRANSITION",
        "This moderation status change is not allowed.",
      );
  }
}

export async function moderateProduct(
  productId: unknown,
  input: unknown,
): Promise<ModeratedProduct> {
  const parsedProductId = productModerationParamsSchema.safeParse({ id: productId });
  const parsedInput = productModerationSchema.safeParse(input);

  if (!parsedProductId.success || !parsedInput.success) {
    throw new ProductModerationError("INVALID_INPUT", "Invalid moderation request.");
  }

  const moderationInput: ProductModerationInput = parsedInput.data;
  const db = getDb();

  return db.transaction(async (tx) => {
    const [currentProduct] = await tx
      .select({
        id: products.id,
        slug: products.slug,
        verificationStatus: products.verificationStatus,
        moderationStatus: products.moderationStatus,
      })
      .from(products)
      .where(eq(products.id, parsedProductId.data.id))
      .limit(1);

    if (!currentProduct) {
      throw new ProductModerationError("PRODUCT_NOT_FOUND", "Product not found.");
    }

    assertTransition(
      currentProduct.verificationStatus,
      moderationInput.verificationStatus,
      verificationTransitions,
      "verification",
    );
    assertTransition(
      currentProduct.moderationStatus,
      moderationInput.moderationStatus,
      moderationTransitions,
      "moderation",
    );

    const verificationChanged =
      moderationInput.verificationStatus !== undefined &&
      moderationInput.verificationStatus !== currentProduct.verificationStatus;
    const moderationChanged =
      moderationInput.moderationStatus !== undefined &&
      moderationInput.moderationStatus !== currentProduct.moderationStatus;

    const [updatedProduct] = await tx
      .update(products)
      .set({
        verificationStatus:
          moderationInput.verificationStatus ?? currentProduct.verificationStatus,
        moderationStatus:
          moderationInput.moderationStatus ?? currentProduct.moderationStatus,
        updatedAt: new Date(),
      })
      .where(eq(products.id, currentProduct.id))
      .returning({
        slug: products.slug,
        verificationStatus: products.verificationStatus,
        moderationStatus: products.moderationStatus,
      });

    if (verificationChanged && moderationInput.verificationStatus) {
      await tx.insert(productEvents).values({
        productId: currentProduct.id,
        eventType: verificationEventType(moderationInput.verificationStatus),
        metadata: {
          previousStatus: currentProduct.verificationStatus,
          newStatus: moderationInput.verificationStatus,
          reason: moderationInput.reason,
        },
      });
    }

    if (moderationChanged && moderationInput.moderationStatus) {
      await tx.insert(productEvents).values({
        productId: currentProduct.id,
        eventType: moderationEventType(moderationInput.moderationStatus),
        metadata: {
          previousStatus: currentProduct.moderationStatus,
          newStatus: moderationInput.moderationStatus,
          reason: moderationInput.reason,
        },
      });
    }

    return updatedProduct;
  });
}
