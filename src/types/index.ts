export type HealthCheckResponse = {
  status: "ok";
  service: "outrank";
};

export type ProductSubmissionCategory = {
  id: string;
  name: string;
  slug?: string;
};

export type ProductSubmissionFieldErrors = Partial<
  Record<
    | "name"
    | "websiteUrl"
    | "categoryId"
    | "description"
    | "logoUrl"
    | "ownerEmail"
    | "makerName"
    | "twitterHandle"
    | "githubUrl"
    | "discordUrl",
    string[]
  >
>;
