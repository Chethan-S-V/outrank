import { describe, expect, it } from "vitest";
import {
  signAdminToken,
  verifyAdminToken,
  hashPassword,
  verifyPassword,
  validateAdminCredentials,
} from "@/lib/auth/admin";

describe("Admin Authentication Utilities", () => {
  it("generates a signed admin token with timestamp and valid HMAC", () => {
    const token = signAdminToken();
    expect(typeof token).toBe("string");
    expect(token).toContain(".");
  });

  it("verifies a validly signed admin token", () => {
    const token = signAdminToken();
    const isValid = verifyAdminToken(token);
    expect(isValid).toBe(true);
  });

  it("rejects a tampered admin token", () => {
    const token = signAdminToken();
    const [timestamp, hmac] = token.split(".");
    const tampered = `${timestamp}.${hmac.slice(0, -2)}ff`;
    expect(verifyAdminToken(tampered)).toBe(false);
  });

  it("rejects an expired admin token", () => {
    // 25 hours in the past
    const oldTimestamp = (Date.now() - 25 * 60 * 60 * 1000).toString();
    const token = `${oldTimestamp}.fakehmac`;
    expect(verifyAdminToken(token)).toBe(false);
  });

  it("rejects empty or malformed tokens", () => {
    expect(verifyAdminToken("")).toBe(false);
    expect(verifyAdminToken("random-string-without-dot")).toBe(false);
  });

  it("hashes password with PBKDF2 salt and correctly verifies it", () => {
    const password = "admin@123";
    const hashed = hashPassword(password);
    expect(hashed).toContain(":");
    expect(verifyPassword(password, hashed)).toBe(true);
    expect(verifyPassword("wrong-password", hashed)).toBe(false);
  });

  it("validates admin credentials with username and password", () => {
    // Default bootstrap admin/admin@123
    expect(
      validateAdminCredentials({
        username: "admin",
        password: "admin@123",
      })
    ).toBe(true);

    // Wrong password
    expect(
      validateAdminCredentials({
        username: "admin",
        password: "wrongpassword",
      })
    ).toBe(false);

    // Wrong username
    expect(
      validateAdminCredentials({
        username: "fakeadmin",
        password: "admin@123",
      })
    ).toBe(false);
  });

  it("validates admin credentials via secret token", () => {
    const defaultSecret = "outrank-dev-admin-secret-change-in-prod-2026";
    expect(validateAdminCredentials({ secret: defaultSecret })).toBe(true);
    expect(validateAdminCredentials({ secret: "invalid-secret" })).toBe(false);
  });
});
