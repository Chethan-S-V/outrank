import { z } from "zod";

export const verificationStatuses = ["pending", "verified", "rejected"] as const;
export const moderationStatuses = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;

const optionalReason = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(500).optional(),
);

export const productModerationSchema = z
  .object({
    verificationStatus: z.enum(verificationStatuses).optional(),
    moderationStatus: z.enum(moderationStatuses).optional(),
    reason: optionalReason,
  })
  .strict()
  .refine(
    (input) =>
      input.verificationStatus !== undefined ||
      input.moderationStatus !== undefined,
    { message: "Provide at least one status update." },
  );

export const productModerationParamsSchema = z.object({
  id: z.string().uuid(),
});

export type ProductModerationInput = z.infer<typeof productModerationSchema>;
