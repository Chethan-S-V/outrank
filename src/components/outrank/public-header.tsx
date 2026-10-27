"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Globe } from "lucide-react";
import { MobileNav, type HeaderNavigationItem } from "./mobile-nav";
import { OutrankLogo } from "./outrank-logo";
import { PlatformStatus } from "./platform-status";
import { SearchTrigger } from "./search-trigger";
import { ThemeToggle } from "./theme-toggle";

const navigation: readonly HeaderNavigationItem[] = [
  { href: "/playground", label: "Playground" },
  { href: "/daily", label: "Daily" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/guidelines", label: "Guidelines" },
];

export function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="outrank-header">
      <div className="outrank-header-inner">
        <div className="outrank-brand">
          <Link aria-label="Outrank home" href="/">
            <OutrankLogo />
          </Link>
          <PlatformStatus />
        </div>

        <SearchTrigger />

        <nav aria-label="Primary navigation" className="outrank-desktop-nav">
          {navigation.map((item) => {
            const isPlayground = item.href === "/playground";
            return (
              <span key={item.label} className="inline-flex items-center gap-1.5">
                <Link
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`outrank-nav-link flex items-center gap-1.5 ${
                    isPlayground
                      ? "font-bold text-[#7446d8] dark:text-[#c084fc] bg-purple-50 dark:bg-purple-950/40 border border-purple-500/20 shadow-xs"
                      : ""
                  }`}
                  href={item.href}
                >
                  {isPlayground ? <span className="w-1.5 h-1.5 rounded-full bg-[#7446d8] animate-pulse" /> : null}
                  <span>{item.label}</span>
                </Link>

                {/* Right after Playground: ONLY Global Icon similar to the other nav links */}
                {isPlayground && (
                  <Link
                    aria-current={pathname === "/global" ? "page" : undefined}
                    aria-label="Global Countries Bidding"
                    className={`outrank-nav-link flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ${
                      pathname === "/global"
                        ? "font-bold text-[#7446d8] dark:text-[#c084fc] bg-purple-50 dark:bg-purple-950/40 border border-purple-500/20 shadow-xs !text-[var(--text-primary)]"
                        : ""
                    }`}
                    href="/global"
                    title="Global Countries & States Bidding"
                  >
                    <Globe className="w-4 h-4" />
                  </Link>
                )}
              </span>
            );
          })}
        </nav>

        <div className="outrank-header-actions flex items-center gap-2">
          {/* Mobile Global Icon Shortcut */}
          <Link
            aria-label="Global Countries Bidding"
            className="md:hidden flex items-center justify-center p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)] transition-colors"
            href="/global"
            title="Global Countries Bidding"
          >
            <Globe className="w-4 h-4" />
          </Link>

          <ThemeToggle />

          <button
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
            className="outrank-icon-button outrank-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.8"
              />
            </svg>
          </button>
        </div>
      </div>

      <MobileNav
        items={navigation}
        onNavigate={() => setMenuOpen(false)}
        open={menuOpen}
        pathname={pathname}
      />
    </header>
  );
}
