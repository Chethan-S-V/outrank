import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";

function computeSignature(payload: string, secret: string, timestamp: number): string {
  const hmac = createHmac("sha256", secret);
  hmac.update(`${timestamp}.${payload}`);
  return `t=${timestamp},v1=${hmac.digest("hex")}`;
}

function verifyStripeSignature(rawBody: string, header: string, secret: string): boolean {
  try {
    const parts = header.split(",");
    const timestampPart = parts.find((p) => p.startsWith("t="));
    const sigPart = parts.find((p) => p.startsWith("v1="));
    if (!timestampPart || !sigPart) return false;

    const timestamp = timestampPart.slice(2);
    const signature = sigPart.slice(3);

    const hmac = createHmac("sha256", secret);
    hmac.update(`${timestamp}.${rawBody}`);
    const expected = hmac.digest("hex");

    return signature === expected;
  } catch {
    return false;
  }
}

describe("Webhook Cryptographic Signature Verification", () => {
  const secret = "whsec_test_secret_for_webhook_signature_123456";
  const payload = JSON.stringify({
    id: "evt_123",
    type: "checkout.session.completed",
    data: { object: { id: "cs_123", amount_total: 5000 } },
  });

  it("verifies a genuinely signed webhook payload", () => {
    const now = Math.floor(Date.now() / 1000);
    const signatureHeader = computeSignature(payload, secret, now);

    const verified = verifyStripeSignature(payload, signatureHeader, secret);
    expect(verified).toBe(true);
  });

  it("rejects a payload with a modified body", () => {
    const now = Math.floor(Date.now() / 1000);
    const signatureHeader = computeSignature(payload, secret, now);

    const tamperedPayload = JSON.stringify({
      id: "evt_123",
      type: "checkout.session.completed",
      data: { object: { id: "cs_123", amount_total: 9999999 } },
    });

    const verified = verifyStripeSignature(tamperedPayload, signatureHeader, secret);
    expect(verified).toBe(false);
  });

  it("rejects signature generated with wrong secret", () => {
    const now = Math.floor(Date.now() / 1000);
    const wrongSignature = computeSignature(payload, "whsec_attacker_secret", now);

    const verified = verifyStripeSignature(payload, wrongSignature, secret);
    expect(verified).toBe(false);
  });

  it("rejects malformed signature headers", () => {
    expect(verifyStripeSignature(payload, "malformed_header", secret)).toBe(false);
    expect(verifyStripeSignature(payload, "", secret)).toBe(false);
  });
});
