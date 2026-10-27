"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { CategorySidebarItem, type SidebarCategoryItem } from "./category-sidebar-item";
import { SidebarRisingVisual } from "./sidebar-rising-visual";

type CategorySidebarProps = { pathname?: string };
type CategoryResponse = {
  categories: Array<{ name: string; slug: string; productCount: number }>;
};

// Top essential primary categories for the sidebar interface
const primaryCoreCategories: SidebarCategoryItem[] = [
  { count: null, href: "/", label: "All" },
  { count: null, href: "/daily", label: "Rankings" },
  { count: null, href: "/categories/ai-agents", label: "AI & Agents" },
  { count: null, href: "/categories/coding-dev-tools", label: "Coding & Dev" },
  { count: null, href: "/categories/fintech-banking", label: "Fintech & Banking" },
  { count: null, href: "/categories/ott-streaming", label: "OTT & Streaming" },
  { count: null, href: "/categories/social-media", label: "Social Media" },
  { count: null, href: "/categories/gaming-esports", label: "Gaming & Esports" },
];

export function CategorySidebar({ pathname = "/" }: CategorySidebarProps) {
  const [items, setItems] = useState<SidebarCategoryItem[]>(primaryCoreCategories);

  useEffect(() => {
    const controller = new AbortController();

    async function loadLiveCategoryCounts() {
      try {
        const response = await fetch(`/api/public/categories?_t=${Date.now()}`, {
          signal: controller.signal,
          cache: "no-store",
          headers: {
            Pragma: "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (!response.ok) return;
        const data = (await response.json()) as CategoryResponse;

        if (data.categories && data.categories.length > 0) {
          const totalProducts = data.categories.reduce((acc, c) => acc + c.productCount, 0);
          const countMap = new Map(data.categories.map((c) => [c.slug, c.productCount]));

          const updated = primaryCoreCategories.map((item) => {
            if (item.href === "/" || item.href === "/daily") {
              return {
                ...item,
                count: totalProducts > 0 ? String(totalProducts) : null,
              };
            }
            const slug = item.href.replace("/categories/", "");
            const liveCount = countMap.get(slug);
            return {
              ...item,
              count: liveCount && liveCount > 0 ? String(liveCount) : null,
            };
          });

          setItems(updated);
        }
      } catch {
        // Keep fallback
      }
    }

    void loadLiveCategoryCounts();
    return () => controller.abort();
  }, []);

  const isExploreActive = pathname === "/categories";

  return (
    <aside aria-label="Category navigation" className="outrank-sidebar select-none">
      <nav aria-label="Categories" className="outrank-sidebar-categories">
        {/* Important Few Primary Categories */}
        <div className="outrank-sidebar-list space-y-1">
          {items.map((item) => (
            <CategorySidebarItem item={item} key={item.href} pathname={pathname} />
          ))}

          {/* Clean Explore item — directly links to the full category hub */}
          <Link
            aria-current={isExploreActive ? "page" : undefined}
            className="outrank-sidebar-item flex items-center justify-between"
            href="/categories"
          >
            <span className="flex items-center gap-2.5 min-w-0">
              <span className="outrank-sidebar-item-icon shrink-0">
                <Compass className="w-4 h-4 text-purple-400" />
              </span>
              <span className="outrank-sidebar-item-label truncate">Explore</span>
            </span>
          </Link>
        </div>
      </nav>

      <div className="outrank-sidebar-lower mt-6">
        <SidebarRisingVisual />
      </div>
    </aside>
  );
}
