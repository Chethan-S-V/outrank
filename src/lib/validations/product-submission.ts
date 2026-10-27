import { z } from "zod";

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function normalizeWebsiteUrl(value: string) {
  const url = new URL(value.trim());

  url.hash = "";

  return url.toString();
}

export const websiteUrlSchema = z
  .string()
  .trim()
  .min(1, "A URL is required.")
  .url("Enter a valid URL.")
  .refine(isHttpUrl, "Use an HTTP or HTTPS URL without credentials.")
  .transform(normalizeWebsiteUrl);

const optionalHttpUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  websiteUrlSchema.optional(),
);

const optionalString = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
  z.string().trim().max(160).optional(),
);

export const productSubmissionSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    websiteUrl: websiteUrlSchema,
    categoryId: z.string().uuid(),
    description: z.string().trim().min(10).max(500),
    logoUrl: optionalHttpUrl,
    ownerEmail: z
      .string()
      .trim()
      .email()
      .max(320)
      .transform((value) => value.toLowerCase()),
    makerName: optionalString,
    twitterHandle: optionalString,
    githubUrl: optionalHttpUrl,
    discordUrl: optionalHttpUrl,
  })
  .strict();

export type ProductSubmissionInput = z.infer<typeof productSubmissionSchema>;
