import Link from "next/link";
import { CategoryIcon } from "./category-icon";

export type SidebarIconName = string;

export type SidebarCategoryItem = {
  count: string | null;
  href: string;
  icon?: SidebarIconName;
  label: string;
};

type CategorySidebarItemProps = { item: SidebarCategoryItem; pathname: string };

export function CategorySidebarItem({ item, pathname }: CategorySidebarItemProps) {
  const isActive = item.href === pathname;
  const slug = item.href.startsWith("/categories/")
    ? item.href.replace("/categories/", "")
    : item.label.toLowerCase();

  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className="outrank-sidebar-item flex items-center justify-between"
      href={item.href}
    >
      <span className="flex items-center gap-2.5 min-w-0">
        <span className="outrank-sidebar-item-icon shrink-0">
          <CategoryIcon category={item.label} slug={slug} className="w-4 h-4" />
        </span>
        <span className="outrank-sidebar-item-label truncate">{item.label}</span>
      </span>
      {item.count ? (
        <span className="outrank-sidebar-item-count text-[11px] font-mono text-[var(--text-muted)]">
          {item.count}
        </span>
      ) : null}
    </Link>
  );
}
