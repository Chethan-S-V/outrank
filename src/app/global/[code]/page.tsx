import { notFound } from "next/navigation";
import { getCountryByCodeOrSlug, WORLD_COUNTRIES_CATALOG } from "@/lib/data/world-countries";
import { CountryDetailView } from "@/components/outrank/country-detail-view";

type PageProps = {
  params: Promise<{ code: string }>;
};

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps) {
  let resolvedCode = "in";
  try {
    const p = await params;
    resolvedCode = p.code;
  } catch {
    resolvedCode = "in";
  }

  const country = getCountryByCodeOrSlug(resolvedCode);
  if (!country) return { title: "Country Not Found | Outrank" };

  return {
    title: `${country.name} ${country.flag} — Sovereign Territory Leaderboard | Outrank`,
    description: `Explore ${country.name} sovereign territory, ${country.states.length} complete administrative states with official flags, and contribute to claim #1 rank dominance.`,
  };
}

export function generateStaticParams() {
  return WORLD_COUNTRIES_CATALOG.map((c) => ({
    code: c.code.toLowerCase(),
  }));
}

export default async function CountryDetailPage({ params }: PageProps) {
  let resolvedCode = "in";
  try {
    const p = await params;
    resolvedCode = p.code;
  } catch {
    resolvedCode = "in";
  }

  const country = getCountryByCodeOrSlug(resolvedCode);

  if (!country) {
    notFound();
  }

  return <CountryDetailView country={country} />;
}
