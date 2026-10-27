"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowUpRight, Globe, MapPin } from "lucide-react";
import { CountryFlag } from "./country-flag";

type SearchResult = {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryName: string;
  totalSupportAmount: string;
  supportCurrency: string;
};

type TerritoryResult = {
  type: "country" | "state";
  id: string;
  name: string;
  code: string;
  flag: string;
  countryName: string;
  countryCode: string;
  url: string;
  subType?: string;
  currentAmount: number;
};

export function SearchTrigger() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [territoryResults, setTerritoryResults] = useState<TerritoryResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery("");
            setResults([]);
            setTerritoryResults([]);
          } else {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return !prev;
        });
      } else if (event.key === "Escape" && open) {
        setOpen(false);
        setQuery("");
        setResults([]);
        setTerritoryResults([]);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Debounced search fetch
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setTerritoryResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/public/search?q=${encodeURIComponent(trimmed)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.products || []);
          setTerritoryResults(data.territories || []);
        } else {
          setResults([]);
          setTerritoryResults([]);
        }
      } catch {
        setResults([]);
        setTerritoryResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [query]);

  function handleOpen() {
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleClose() {
    setOpen(false);
    setQuery("");
    setResults([]);
    setTerritoryResults([]);
  }

  function handleSelectProduct(slug: string) {
    handleClose();
    router.push(`/products/${slug}`);
  }

  function handleSelectTerritory(url: string) {
    handleClose();
    router.push(url);
  }

  function handleInputChange(val: string) {
    setQuery(val);
    if (!val.trim()) {
      setResults([]);
      setTerritoryResults([]);
      setIsLoading(false);
    }
  }

  const hasAnyResults = territoryResults.length > 0 || results.length > 0;

  return (
    <>
      <button
        aria-controls="header-search-dialog"
        aria-expanded={open}
        aria-label="Search products, countries, states..."
        className="outrank-search-trigger"
        onClick={handleOpen}
        type="button"
      >
        <Search className="outrank-search-icon w-4 h-4" aria-hidden="true" />
        <span className="outrank-search-placeholder">Search products, countries, states...</span>
        <kbd className="outrank-search-shortcut">Ctrl K</kbd>
      </button>

      {open ? (
        <div
          aria-label="Search products and sovereign territories"
          aria-modal="true"
          className="outrank-search-dialog"
          id="header-search-dialog"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div className="w-full max-w-xl border border-[var(--border-strong)] rounded-2xl bg-[var(--surface)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Top Search Input Field */}
            <div className="flex items-center gap-2 p-3.5 border-b border-[var(--border)]">
              <Search className="w-5 h-5 text-purple-500 ml-1.5 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                autoFocus
                id="header-search-input"
                name="q"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search products, countries, or states..."
                className="flex-1 bg-transparent border-0 px-2 py-1 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                type="search"
              />
              {isLoading && <Loader2 className="w-4 h-4 animate-spin text-[var(--accent)] mr-2 shrink-0" />}
              <button
                aria-label="Close search"
                onClick={handleClose}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Scroll View */}
            <div className="max-h-96 overflow-y-auto p-2.5 space-y-3">
              {query.trim() === "" ? (
                <div className="p-6 text-center text-xs text-[var(--text-muted)] space-y-1">
                  <p className="font-semibold text-[var(--text-secondary)]">Search across Outrank</p>
                  <p>Type to search 197 countries, 5,000+ administrative states, and verified products.</p>
                  <p className="text-[10px] pt-1">Press <kbd className="px-1.5 py-0.5 border rounded text-[10px] font-mono">Esc</kbd> to exit</p>
                </div>
              ) : hasAnyResults ? (
                <div className="space-y-3">
                  {/* Sovereign Countries & Administrative States */}
                  {territoryResults.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        <Globe className="w-3 h-3 text-purple-500" />
                        <span>Countries & States ({territoryResults.length})</span>
                      </div>

                      <div className="space-y-1 mt-1">
                        {territoryResults.map((t) => (
                          <button
                            key={`${t.type}-${t.id}`}
                            onClick={() => handleSelectTerritory(t.url)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] flex items-center justify-between group transition-colors border border-transparent hover:border-[var(--border)]"
                            type="button"
                          >
                            <div className="flex items-center gap-2.5 min-w-0 pr-3">
                              {t.type === "country" ? (
                                <CountryFlag code={t.countryCode} name={t.name} size="sm" />
                              ) : (
                                <div className="w-5 h-5 rounded-md bg-purple-500/10 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                                  <MapPin className="w-3.5 h-3.5" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                                    {t.name}
                                  </span>
                                  {t.type === "state" ? (
                                    <span className="text-[10px] text-[var(--text-muted)] truncate">
                                      ({t.countryName})
                                    </span>
                                  ) : null}
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">
                                    {t.type === "country" ? "Country" : (t.subType || "State")}
                                  </span>
                                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                                    {t.id}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 text-xs font-mono text-[var(--accent)]">
                              <span className="text-[11px] font-bold">Explore</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {/* Verified Products Leaderboard */}
                  {results.length > 0 ? (
                    <div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--text-muted)]">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span>Products ({results.length})</span>
                      </div>

                      <div className="space-y-1 mt-1">
                        {results.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleSelectProduct(product.slug)}
                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[var(--surface-hover)] flex items-center justify-between group transition-colors border border-transparent hover:border-[var(--border)]"
                            type="button"
                          >
                            <div className="min-w-0 pr-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] truncate">
                                  {product.name}
                                </span>
                                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-muted)] shrink-0">
                                  {product.categoryName}
                                </span>
                              </div>
                              <p className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                                {product.description}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)]">
                                ${parseFloat(product.totalSupportAmount || "0").toLocaleString()}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)]" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-[var(--text-muted)]">
                  {isLoading
                    ? "Searching eligible products, countries, and states..."
                    : `No products, countries, or states found matching "${query}".`}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
