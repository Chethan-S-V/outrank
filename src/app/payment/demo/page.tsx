"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

function DemoRedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Demo payment system has been superseded by Razorpay.
    // Automatically redirect all traffic to official Razorpay checkout.
    const query = searchParams.toString();
    const targetUrl = query ? `/payment/razorpay?${query}` : "/payment/razorpay";
    router.replace(targetUrl);
  }, [searchParams, router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
      <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
      <p className="text-sm font-medium text-[var(--text-muted)]">
        Redirecting to Official Razorpay Checkout...
      </p>
    </div>
  );
}

export default function DemoPaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        </div>
      }
    >
      <DemoRedirectContent />
    </Suspense>
  );
}
