import Razorpay from "razorpay";
import crypto from "crypto";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_TszCIAmcV6dfeg";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "amk8l29oWVpsqSbXAWJ03zFd";

export const razorpayClient = new Razorpay({
  key_id,
  key_secret,
});

export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", key_secret)
    .update(body)
    .digest("hex");

  return expectedSignature === signature;
}
