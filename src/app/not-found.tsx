import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10 rounded-2xl text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-[var(--accent)] flex items-center justify-center mx-auto">
          <Compass className="w-6 h-6" />
        </div>

        <h1 className="text-3xl font-extrabold text-[var(--text-primary)]">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
          The product, category, or document you were looking for doesn&apos;t exist or has been relocated.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--accent)] text-white hover:bg-[var(--accent-strong)] text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Rankings</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
