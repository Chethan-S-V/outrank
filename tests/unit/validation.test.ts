import { describe, expect, it } from "vitest";
import {
  websiteUrlSchema,
  productSubmissionSchema,
  contributionRequestSchema,
} from "@/lib/validations";

const VALID_UUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";

describe("Validation Schemas", () => {
  describe("Website URL Validation & SSRF Prevention", () => {
    it("accepts valid secure HTTPS URLs", () => {
      const valid = "https://notion.so";
      const result = websiteUrlSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("accepts valid HTTP URLs with domain", () => {
      const valid = "http://example.com/product";
      const result = websiteUrlSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects dangerous or malformed protocols (javascript:, file:, ftp:)", () => {
      const malicious = [
        "javascript:alert(1)",
        "file:///etc/passwd",
        "data:text/html,hello",
        "ftp://ftp.example.com",
      ];
      for (const url of malicious) {
        const result = websiteUrlSchema.safeParse(url);
        expect(result.success).toBe(false);
      }
    });

    it("rejects invalid URL strings", () => {
      expect(websiteUrlSchema.safeParse("not-a-url").success).toBe(false);
      expect(websiteUrlSchema.safeParse("").success).toBe(false);
    });
  });

  describe("Product Submission Validation", () => {
    it("validates a complete, legitimate product submission", () => {
      const validProduct = {
        name: "Acme Analytics",
        websiteUrl: "https://acme.io",
        categoryId: VALID_UUID,
        description: "Privacy-friendly product analytics for modern web applications.",
        logoUrl: "https://acme.io/logo.png",
        ownerEmail: "founder@acme.io",
      };

      const result = productSubmissionSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it("rejects submission with invalid email", () => {
      const invalid = {
        name: "Acme Analytics",
        websiteUrl: "https://acme.io",
        categoryId: VALID_UUID,
        description: "Valid description of adequate length.",
        ownerEmail: "not-an-email",
      };
      const result = productSubmissionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects submission with missing required fields", () => {
      const empty = {};
      const result = productSubmissionSchema.safeParse(empty);
      expect(result.success).toBe(false);
    });
  });

  describe("Contribution Amount & Limits Validation", () => {
    it("accepts amounts within allowed bounds", () => {
      const valid = {
        productId: VALID_UUID,
        amount: "100.00",
        currency: "USD",
      };
      const result = contributionRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects amounts below minimum (e.g. 0 or negative)", () => {
      expect(
        contributionRequestSchema.safeParse({
          productId: VALID_UUID,
          amount: "0",
          currency: "USD",
        }).success,
      ).toBe(false);

      expect(
        contributionRequestSchema.safeParse({
          productId: VALID_UUID,
          amount: "-50.00",
          currency: "USD",
        }).success,
      ).toBe(false);
    });

    it("enforces correct ISO currency code", () => {
      expect(
        contributionRequestSchema.safeParse({
          productId: VALID_UUID,
          amount: "50.00",
          currency: "EUR",
        }).success,
      ).toBe(false);
    });
  });
});
