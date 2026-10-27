"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type SidebarProductRowProps = {
  amount?: string | null;
  changePercent?: number | null;
  logoUrl?: string | null;
  name: string;
  rank: number;
  slug?: string;
};

export function SidebarProductRow({
  amount,
  changePercent,
  logoUrl,
  name,
  rank,
  slug,
}: SidebarProductRowProps) {
  const cleanSeed = encodeURIComponent(name.replace(/^@/, "").trim() || "creator");
  const fallbackAvatar = name.startsWith("@")
    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanSeed}`
    : `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanSeed}`;

  const [imgSrc, setImgSrc] = useState<string>(logoUrl || fallbackAvatar);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(logoUrl || fallbackAvatar);
    setHasError(false);
  }, [logoUrl, fallbackAvatar]);

  function handleImageError() {
    if (!hasError && imgSrc !== fallbackAvatar) {
      setHasError(true);
      setImgSrc(fallbackAvatar);
    }
  }

  const content = (
    <div className="flex items-center justify-between py-2 text-xs border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--surface-hover)] px-2 rounded-xl transition-colors cursor-pointer group gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="w-4 text-[11px] font-bold text-[var(--text-muted)] shrink-0">
          #{rank}
        </span>
        <div className="w-6 h-6 rounded-md bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
          <Image
            src={imgSrc}
            alt=""
            width={24}
            height={24}
            unoptimized
            onError={handleImageError}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors truncate text-[11px] min-w-0">
          {name}
        </span>
      </div>

      {amount !== undefined ? (
        <span className="font-bold text-[#7446d8] dark:text-[#a278ff] shrink-0 font-mono text-[11px] whitespace-nowrap text-right pl-1">
          {amount ?? "—"}
        </span>
      ) : null}

      {changePercent !== undefined ? (
        <span className="font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5 text-[11px] whitespace-nowrap text-right pl-1">
          <span>↑</span>
          <span>{changePercent === null ? "—" : `${changePercent}%`}</span>
        </span>
      ) : null}
    </div>
  );

  if (slug) {
    return <Link href={`/products/${slug}`}>{content}</Link>;
  }

  return content;
}
