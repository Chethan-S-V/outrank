"use client";

import Link from "next/link";
import { useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { OutrankLogo } from "@/components/branding/outrank-logo";

const links = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/categories", label: "Categories" },
  { href: "/#how-it-works", label: "About" },
  { href: "/#rules", label: "Rules" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color:rgba(17,15,14,.92)] backdrop-blur">
      <PageContainer>
        <div className="flex h-16 items-center justify-between gap-5">
          <Link href="/"><OutrankLogo /></Link>
          <nav aria-label="Primary navigation" className="hidden items-center gap-5 text-sm text-[var(--text-secondary)] lg:flex">
            {links.map((link) => <Link className="transition hover:text-[var(--text-primary)]" href={link.href} key={link.href}>{link.label}</Link>)}
          </nav>
          <div className="hidden md:block"><Link className="inline-flex h-9 items-center bg-[var(--accent)] px-4 text-sm font-semibold text-[#1a100d] transition hover:bg-[var(--accent-strong)]" href="/submit">Submit Product</Link></div>
          <button aria-expanded={open} aria-label="Toggle navigation" className="grid h-9 w-11 place-items-center border border-[var(--border)] text-xs font-medium text-[var(--text-primary)] lg:hidden" onClick={() => setOpen((value) => !value)} type="button">{open ? "Close" : "Menu"}</button>
        </div>
        {open ? <nav aria-label="Mobile navigation" className="grid gap-1 border-t border-[var(--border)] py-3 lg:hidden">{links.map((link) => <Link className="px-2 py-2 text-sm text-[var(--text-secondary)]" href={link.href} key={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link className="mt-2 bg-[var(--accent)] px-3 py-2 text-center text-sm font-semibold text-[#1a100d]" href="/submit" onClick={() => setOpen(false)}>Submit Product</Link></nav> : null}
      </PageContainer>
    </header>
  );
}
