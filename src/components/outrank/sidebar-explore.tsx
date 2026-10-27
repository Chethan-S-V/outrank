import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export function SidebarExplore() {
  return (
    <Link
      href="/categories"
      className="outrank-sidebar-explore flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors mt-2"
    >
      <div className="flex items-center gap-2.5">
        <Compass className="w-4 h-4 text-[var(--text-muted)]" />
        <span>Explore</span>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
    </Link>
  );
}
