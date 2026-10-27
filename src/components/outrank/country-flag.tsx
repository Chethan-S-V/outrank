"use client";

import { useState } from "react";
import Image from "next/image";

type CountryFlagProps = {
  code: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
};

const SIZE_MAP = {
  xs: { width: 16, height: 12, className: "w-4 h-3 min-w-[16px]" },
  sm: { width: 20, height: 15, className: "w-5 h-[15px] min-w-[20px]" },
  md: { width: 28, height: 20, className: "w-7 h-5 min-w-[28px]" },
  lg: { width: 36, height: 26, className: "w-9 h-[26px] min-w-[36px]" },
  xl: { width: 48, height: 34, className: "w-12 h-[34px] min-w-[48px]" },
  "2xl": { width: 64, height: 46, className: "w-16 h-[46px] min-w-[64px]" },
};

export function CountryFlag({
  code,
  name,
  size = "md",
  className = "",
}: CountryFlagProps) {
  const [hasError, setHasError] = useState(false);
  const cleanCode = (code || "un").toLowerCase().trim();
  const conf = SIZE_MAP[size] || SIZE_MAP.md;

  if (hasError || !cleanCode) {
    return (
      <span
        aria-label={name || code}
        className={`inline-flex items-center justify-center font-bold text-[10px] uppercase bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded shadow-xs border border-black/10 dark:border-white/10 ${conf.className} ${className}`}
      >
        {cleanCode.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  // Using FlagCDN PNG for instant, universal raster rendering across all browsers
  const flagPngUrl = `https://flagcdn.com/w80/${cleanCode}.png`;
  const flagPng2x = `https://flagcdn.com/w160/${cleanCode}.png`;

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden rounded-[3px] shadow-xs border border-black/15 dark:border-white/20 shrink-0 bg-slate-100 dark:bg-slate-800 ${conf.className} ${className}`}
      style={{ aspectRatio: "4/3" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={flagPngUrl}
        srcSet={`${flagPng2x} 2x`}
        alt={name ? `Flag of ${name}` : `Flag (${code.toUpperCase()})`}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover select-none pointer-events-none"
        onError={(e) => {
          // If PNG fails, try fallback SVG before giving up
          const target = e.currentTarget;
          if (target && !target.src.endsWith(".svg")) {
            target.src = `https://flagcdn.com/${cleanCode}.svg`;
          } else {
            setHasError(true);
          }
        }}
      />
    </span>
  );
}
