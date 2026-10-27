"use client";

import { useState, useLayoutEffect, useRef } from "react";
import type { PublicProduct } from "@/services/products";
import { RankingRow } from "./ranking-row";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

type RankingListProps = {
  products: readonly PublicProduct[];
  period?: "all-time" | "today";
};

const ITEMS_PER_PAGE = 25;

function getPagePills(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export function RankingList({ products, period = "all-time" }: RankingListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowElements = useRef(new Map<string, HTMLDivElement>());
  const previousPositions = useRef(new Map<string, number>());

  const rankedProducts = products;
  const totalPages = Math.ceil(rankedProducts.length / ITEMS_PER_PAGE) || 1;

  // Ensure current page is valid when product count changes
  const safePage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, rankedProducts.length);
  const visibleProducts = rankedProducts.slice(startIndex, endIndex);

  function handlePageChange(newPage: number) {
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  useLayoutEffect(() => {
    const nextPositions = new Map<string, number>();
    rowElements.current.forEach((element, productId) => {
      const nextPosition = element.getBoundingClientRect().top;
      const previousPosition = previousPositions.current.get(productId);
      const isRoyalRow = visibleProducts.findIndex((product) => product.id === productId) < 3;
      if (previousPosition !== undefined && isRoyalRow) {
        const distance = previousPosition - nextPosition;
        if (distance) {
          element.animate(
            [{ transform: `translateY(${distance}px)` }, { transform: "translateY(0)" }],
            { duration: 240, easing: "cubic-bezier(.2,.8,.2,1)" },
          );
        }
      }
      nextPositions.set(productId, nextPosition);
    });
    previousPositions.current = nextPositions;
  }, [visibleProducts]);

  if (!products.length) {
    return (
      <section className="outrank-ranking-empty p-12 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)] my-6">
        <h3 className="text-base font-bold text-[var(--text-primary)]">No products ranked yet.</h3>
        <p className="text-xs text-[var(--text-secondary)] mt-1">
          Be the first product to claim the top spot directly!
        </p>
      </section>
    );
  }

  return (
    <section aria-label="Product rankings" className="outrank-ranking-list mt-4 space-y-4" ref={containerRef}>
      {/* Today's Leaderboard Mode Banner */}
      {period === "today" && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-transparent border border-amber-500/30 text-amber-700 dark:text-amber-300 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
                <span>Today&apos;s Live Ranking Active</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Rankings dynamically calculated from today&apos;s verified backing velocity.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-300 shrink-0">
            Resets at Midnight
          </span>
        </div>
      )}

      {/* Empty State when no products exist */}
      {visibleProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-[var(--border)] rounded-2xl bg-[var(--surface)]">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">No products listed yet</h3>
          <p className="text-xs text-[var(--text-muted)] mt-1 max-w-sm">
            The leaderboard is completely clean. Be the first creator to submit and claim the #1 rank.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {visibleProducts.map((product, index) => {
            const absoluteRank = startIndex + index + 1;
            return (
              <div
                className="outrank-ranking-row-motion"
                key={product.id}
                ref={(element) => {
                  if (element) rowElements.current.set(product.id, element);
                  else rowElements.current.delete(product.id);
                }}
              >
                <RankingRow product={product} rank={absoluteRank} />
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls — When products exceed 10 */}
      {totalPages > 1 && (
        <nav
          aria-label="Leaderboard pagination"
          className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] mt-4 text-xs"
        >
          <div className="text-[var(--text-muted)] font-mono text-[11px]">
            Showing <strong className="text-[var(--text-primary)]">{startIndex + 1}–{endIndex}</strong> of{" "}
            <strong className="text-[var(--text-primary)]">{products.length}</strong> products
          </div>

          <div className="flex items-center gap-1.5">
            {/* Previous Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage <= 1}
              aria-label="Go to previous 10 products"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {/* Page Number Pills (Windowed for large product sets) */}
            <div className="flex items-center gap-1 px-1">
              {getPagePills(safePage, totalPages).map((p, idx) => {
                if (typeof p === "string") {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-6 text-center text-xs text-[var(--text-muted)] font-mono select-none"
                    >
                      …
                    </span>
                  );
                }
                const isActive = p === safePage;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePageChange(p)}
                    aria-current={isActive ? "page" : undefined}
                    className={`w-8 h-8 rounded-xl font-bold font-mono transition-all text-xs flex items-center justify-center cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-[#7446d8] to-[#9333ea] text-white shadow-sm shadow-purple-900/40"
                        : "border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage >= totalPages}
              aria-label="Go to next 10 products"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </nav>
      )}
    </section>
  );
}
