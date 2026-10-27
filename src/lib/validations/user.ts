import { z } from "zod";

export const userHandleSchema = z
  .string()
  .trim()
  .min(2, "Username must be at least 2 characters.")
  .max(50, "Username must not exceed 50 characters.")
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    "Username can only contain letters, numbers, underscores, dashes, and periods.",
  );

export const userRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(160, "Name must not exceed 160 characters."),
  handle: userHandleSchema,
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address.")
    .max(320, "Email must not exceed 320 characters."),
  avatarUrl: z.string().trim().url("Please provide a valid image URL.").optional().or(z.literal("")),
  bio: z.string().trim().max(500, "Bio must not exceed 500 characters.").optional().or(z.literal("")),
  provider: z.enum(["twitter", "github", "discord", "google", "linkedin", "manual"]).default("manual"),
  providerId: z.string().trim().optional(),
  twitterHandle: z
    .string()
    .trim()
    .regex(/^@?[a-zA-Z0-9_]{1,30}$/, "Invalid Twitter/X handle.")
    .optional()
    .or(z.literal("")),
  githubHandle: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_-]{1,39}$/, "Invalid GitHub handle.")
    .optional()
    .or(z.literal("")),
  discordHandle: z.string().trim().max(100).optional().or(z.literal("")),
  linkedinUrl: z.string().trim().url("Invalid LinkedIn URL.").optional().or(z.literal("")),
});

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
