import { GlobalNightMap } from "@/components/outrank/global-night-map";
import { GlobalCountryList } from "@/components/outrank/global-country-list";

export const metadata = {
  title: "Global Nations Sovereignty Leaderboard | Outrank",
  description:
    "Explore sovereign nations and compete for World #1 territorial dominance with official flags and night map telemetry on Outrank.",
};

export const revalidate = 60;

export default function GlobalPage() {
  return (
    <main className="outrank-main w-full space-y-5">
      {/* 1. Global Night Original Map (Replaces Claim #1 section and spotlights World #1) */}
      <GlobalNightMap />

      {/* 2. Countries Leaderboard (Starting from 0, Official Flags, View opens dedicated country page) */}
      <GlobalCountryList />
    </main>
  );
}
