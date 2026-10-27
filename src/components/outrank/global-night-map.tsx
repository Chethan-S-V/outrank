"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Globe, Trophy, ArrowRight, ShieldCheck, Sparkles, MapPin, Compass } from "lucide-react";
import { WORLD_COUNTRIES_CATALOG, type WorldCountry } from "@/lib/data/world-countries";
import { CountryFlag } from "./country-flag";
import { useUserCurrency } from "@/lib/currency";

type GlobalNightMapProps = {
  topCountry?: WorldCountry;
};

export type ContinentData = {
  id: string;
  name: string;
  center: [number, number];
  rx: number;
  ry: number;
  summary: string;
};

// Continent centroids & spatial coverage matching NASA Earth at Night composite (1000x500)
const CONTINENTS: Record<string, ContinentData> = {
  asia: {
    id: "asia",
    name: "ASIA",
    center: [690, 175],
    rx: 180,
    ry: 95,
    summary: "World's largest continent spanning Eurasia, South Asia, East Asia, and the Pacific Rim",
  },
  europe: {
    id: "europe",
    name: "EUROPE",
    center: [475, 125],
    rx: 75,
    ry: 50,
    summary: "Western and Central Eurasian economic corridor",
  },
  "north-america": {
    id: "north-america",
    name: "NORTH AMERICA",
    center: [215, 150],
    rx: 125,
    ry: 75,
    summary: "North American continent encompassing USA, Canada, and Mexico",
  },
  "south-america": {
    id: "south-america",
    name: "SOUTH AMERICA",
    center: [315, 310],
    rx: 70,
    ry: 95,
    summary: "South American sovereign territories and bio-diverse economic heartland",
  },
  africa: {
    id: "africa",
    name: "AFRICA",
    center: [485, 240],
    rx: 90,
    ry: 100,
    summary: "Pan-African continental sovereign territories from the Maghreb to the Cape",
  },
  oceania: {
    id: "oceania",
    name: "OCEANIA",
    center: [800, 345],
    rx: 90,
    ry: 60,
    summary: "Oceania and Australia-Pacific sovereign territory zone",
  },
};

function getContinentForCountry(country: WorldCountry): ContinentData {
  const reg = country.region || "";
  const code = (country.code || "").toUpperCase();

  if (code === "RU" || reg.includes("Asia") || reg.includes("Middle East")) {
    return CONTINENTS.asia;
  }
  if (reg.includes("Europe")) {
    return CONTINENTS.europe;
  }
  if (reg.includes("North America") || reg.includes("Central America")) {
    return CONTINENTS["north-america"];
  }
  if (reg.includes("South America")) {
    return CONTINENTS["south-america"];
  }
  if (reg.includes("Africa")) {
    return CONTINENTS.africa;
  }
  return CONTINENTS.oceania;
}

export function GlobalNightMap({ topCountry }: GlobalNightMapProps) {
  const { formatAmount } = useUserCurrency();
  const [localContributions, setLocalContributions] = useState<Record<string, number>>({});

  useEffect(() => {
    function loadSaved() {
      try {
        const raw = localStorage.getItem("outrank_territory_contributions");
        if (raw) setLocalContributions(JSON.parse(raw));
      } catch {}
    }
    loadSaved();
    window.addEventListener("storage", loadSaved);
    return () => window.removeEventListener("storage", loadSaved);
  }, []);

  // Default leader is India (#1 flagship) or specified topCountry
  const defaultTop = useMemo(() => {
    return WORLD_COUNTRIES_CATALOG.find((c) => c.code === "IN") || WORLD_COUNTRIES_CATALOG[0];
  }, []);

  // Dynamic top 1 country by verified contribution pool
  const top1RankedCountry = useMemo(() => {
    if (topCountry) return topCountry;
    let highestCountry = defaultTop;
    let maxScore = -1;

    for (const c of WORLD_COUNTRIES_CATALOG) {
      const bonus = (localContributions[c.name] || localContributions[c.code] || 0);
      const total = c.currentPool + bonus;
      if (total > maxScore && total > 0) {
        maxScore = total;
        highestCountry = c;
      }
    }
    return highestCountry;
  }, [topCountry, localContributions, defaultTop]);

  const safeCountry = top1RankedCountry;

  const safeCountryPool =
    safeCountry.currentPool +
    (localContributions[safeCountry.name] || localContributions[safeCountry.code] || 0);

  // Active continent derived from the #1 ranked country
  const continent = useMemo(() => {
    return getContinentForCountry(safeCountry);
  }, [safeCountry]);

  const [cx, cy] = continent.center;

  return (
    <section aria-label="Global Earth at Night Sovereign Map" className="relative w-full rounded-3xl overflow-hidden border border-purple-300 dark:border-purple-500/30 bg-[#07090e] shadow-2xl">
      {/* 1. Deep Space Atmosphere Glow */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#080b14]/70 to-[#05060a] pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Real NASA Earth at Night Satellite Composite Map */}
      <div className="relative w-full aspect-[2/1] overflow-hidden flex items-center justify-center bg-[#03060f]">
        {/* Real satellite image backdrop */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/earth-night-map.jpg"
          alt="Earth at Night Satellite View"
          className="absolute inset-0 w-full h-full object-fill select-none pointer-events-none brightness-110 contrast-125"
        />

        {/* Deep Space Vignette Glow */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#050814]/20 to-[#03050a]/75 pointer-events-none" />

        {/* Coordinate Overlay & Whole Continent Highlight */}
        <svg
          viewBox="0 0 1000 500"
          preserveAspectRatio="none"
          className="relative z-10 w-full h-full select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pulsing continent gradient */}
            <radialGradient id="continentGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
            </radialGradient>

            <filter id="glowFilter" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Subtle Lat/Lon Navigation Grid */}
          <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" strokeDasharray="3 5">
            <line x1="0" y1="125" x2="1000" y2="125" />
            <line x1="0" y1="250" x2="1000" y2="250" />
            <line x1="0" y1="375" x2="1000" y2="375" />
            <line x1="250" y1="0" x2="250" y2="500" />
            <line x1="500" y1="0" x2="500" y2="500" />
            <line x1="750" y1="0" x2="750" y2="500" />
          </g>
        </svg>

        {/* 3. FLOATING HUD CARD: Showcases Current #1 Country & Continent */}
        <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 max-w-xs sm:max-w-sm bg-white/95 dark:bg-[#0e111a]/95 backdrop-blur-md border border-purple-300 dark:border-purple-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <Trophy className="w-3 h-3 text-amber-500 dark:text-amber-400" />
              <span>World #1 Country Rank</span>
            </div>

            <span className="flex items-center gap-1 text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
              <Globe className="w-3 h-3" />
              <span>{continent.name}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="shrink-0 p-1 rounded-xl bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 shadow-md">
              <CountryFlag code={safeCountry.code} name={safeCountry.name} size="xl" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight truncate flex items-center gap-1.5">
                <span>{safeCountry.name}</span>
                <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-500/20 px-1.5 py-0.2 rounded border border-purple-300 dark:border-purple-500/30">
                  {safeCountry.code}
                </span>
              </h2>

              <p className="text-[11px] font-mono text-slate-600 dark:text-zinc-400 truncate mt-0.5">
                Continent: <strong className="text-purple-600 dark:text-purple-400 font-bold">{continent.name}</strong> • <span className="text-slate-900 dark:text-zinc-200">{safeCountry.states.length} Subdivisions</span>
              </p>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 block">Contribution Amount:</span>
              <span className="text-sm font-extrabold text-[#7446d8] dark:text-[#c084fc]">
                {formatAmount(safeCountryPool)}
              </span>
            </div>

            <Link
              href={`/global/${(safeCountry.code || "in").toLowerCase()}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold font-mono transition-all shadow-md shadow-purple-900/30"
            >
              <span>Explore & Contribute</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 4. Map Bottom Status */}
        <div className="absolute bottom-3 right-4 z-20 hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-700 dark:text-zinc-400 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-200 dark:border-white/5 shadow-sm">
          <span className="text-purple-700 dark:text-purple-300 font-bold">Leading Continent: {continent.name}</span>
          <span>•</span>
          <span>{safeCountry.name} ({safeCountry.code})</span>
          <span>•</span>
          <span>{safeCountry.states.length} Subdivisions Verified</span>
        </div>
      </div>
    </section>
  );
}
