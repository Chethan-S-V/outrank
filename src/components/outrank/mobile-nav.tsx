"use client";

import Link from "next/link";

export type HeaderNavigationItem = { href: string; label: string };

type MobileNavProps = { items: readonly HeaderNavigationItem[]; onNavigate: () => void; open: boolean; pathname: string };

export function MobileNav({ items, onNavigate, open, pathname }: MobileNavProps) {
  return <nav aria-label="Mobile navigation" className="outrank-mobile-nav" data-open={open} id="mobile-navigation">{items.map((item) => <Link aria-current={pathname === item.href ? "page" : undefined} className="outrank-nav-link" href={item.href} key={item.label} onClick={onNavigate}>{item.label}</Link>)}</nav>;
}
