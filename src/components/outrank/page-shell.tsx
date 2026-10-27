"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PublicHeader } from "./public-header";
import { CategorySidebar } from "./category-sidebar";
import { RightSidebar } from "./right-sidebar";
import { GlobalRightSidebar } from "./global-right-sidebar";
import { MadeWithWetBadge } from "./made-with-wet";

type PageShellProps = {
  children: ReactNode;
  pathname?: string;
  rightPanel?: ReactNode;
};

export function OutrankPageShell({ children, pathname, rightPanel }: PageShellProps) {
  const currentPathname = usePathname();
  const activePath = currentPathname || pathname || "";
  const isAdmin = activePath.startsWith("/admin");

  // Dedicated sovereign environment: If visiting admin, render isolated standalone interface
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-[#0b0d11] text-slate-100 flex flex-col font-sans selection:bg-[#38bdf8]/30">
        {children}
      </div>
    );
  }

  const isGlobal = activePath.startsWith("/global");

  const resolvedRightPanel =
    rightPanel !== undefined
      ? rightPanel
      : isGlobal
      ? <GlobalRightSidebar />
      : <RightSidebar />;

  const gridClassName = isGlobal
    ? "outrank-page-grid outrank-page-grid-no-left"
    : resolvedRightPanel
    ? "outrank-page-grid outrank-page-grid-with-panel"
    : "outrank-page-grid";

  return (
    <div className="outrank-shell flex flex-col min-h-screen">
      <PublicHeader />
      <div className={gridClassName}>
        {!isGlobal && <CategorySidebar pathname={currentPathname || pathname || "/"} />}
        <div className="min-w-0 flex-1">{children}</div>
        {resolvedRightPanel}
      </div>
      <footer className="outrank-footer border-t border-[var(--border)] py-4 mt-4 bg-[var(--surface)]">
        <div className="outrank-footer-inner max-w-[1440px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[var(--text-muted)]">
          <div>
            © {new Date().getFullYear()} Outrank. Verified Sovereign Visibility Leaderboard.
          </div>

          {/* Center: Made with WET Logo & Badge */}
          <div className="flex items-center justify-center py-0.5 select-none">
            <MadeWithWetBadge />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[var(--text-primary)] transition-colors">
              About
            </Link>
            <Link href="/playground" className="hover:text-[var(--text-primary)] transition-colors">
              Playground (Upcoming)
            </Link>
            <Link href="/payment/razorpay" className="hover:text-[var(--text-primary)] transition-colors">
              Razorpay Checkout
            </Link>
            <Link href="/categories" className="hover:text-[var(--text-primary)] transition-colors">
              Categories
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
