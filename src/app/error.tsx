"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Something went wrong
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          An unexpected system condition occurred while rendering this page.
        </p>

        <div className="pt-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    </main>
  );
}
