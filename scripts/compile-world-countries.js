// compile-world-countries.js
const fs = require('fs');
const path = require('path');

function getFlag(code) {
  if (code === 'XK') return '🇽🇰';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const afr = require('./data-africa.js');
const asia = require('./data-asia.js');
const eur = require('./data-europe.js');
const amoc = require('./data-americas-oceania.js');
const allRaw = [...afr, ...asia, ...eur, ...amoc];

// Official subdivisions from pycountry dataset
const officialSubs = JSON.parse(fs.readFileSync(path.join(__dirname, 'official-subdivisions.json'), 'utf8'));

const compiled = allRaw.map(c => {
  const flag = getFlag(c.code);
  const slug = slugify(c.name);

  // Retrieve official subdivisions for this country
  const rawSubs = officialSubs[c.code] || [];
  
  // Format subdivisions
  const states = rawSubs.map(s => ({
    id: s.id,
    name: s.name,
    code: s.code,
    flag: flag,
    type: s.type || "Subdivision",
    currentBid: 0, // Starts strictly from 0
    minBid: 100,
  }));

  return {
    id: c.id,
    code: c.code,
    slug: slug,
    name: c.name,
    flag: flag,
    capital: c.capital,
    region: c.region,
    targetPool: 50000,
    currentPool: 0, // Starts strictly from 0
    centerLat: c.lat,
    centerLon: c.lon,
    population: c.population,
    currency: c.currency,
    about: c.about,
    states: states
  };
});

const tsContent = `// All 197 sovereign countries and territories categorized by continent
// Complete ISO 3166-2 First-Level Administrative Subdivisions from official reference list
// All initial pool and bidding values start strictly from 0.

export interface WorldState {
  id: string; // ISO 3166-2 code (e.g. US-CA, IN-KA)
  name: string; // Subdivision / state / province name
  code: string; // Short code
  flag?: string; // Flag emoji
  type?: string; // "State" | "Province" | "Region" | "Department" | "Governorate" | etc.
  currentBid: number; // Starts from 0
  minBid: number;
}

export interface WorldCountry {
  id: string; // ISO 3-letter code
  code: string; // ISO 2-letter code
  slug: string;
  name: string;
  flag: string; // Official Flag Emoji
  capital: string;
  region: "Africa" | "Asia" | "Europe" | "North America" | "South America" | "Oceania" | "South Asia" | "East Asia" | "Middle East" | "Central America";
  targetPool: number;
  currentPool: number; // Starts from 0
  centerLat: number;
  centerLon: number;
  population: string;
  currency: string;
  about: string;
  states: WorldState[];
}

export const WORLD_COUNTRIES_CATALOG: WorldCountry[] = ${JSON.stringify(compiled, null, 2)};

export function getCountryByCodeOrSlug(param?: string): WorldCountry | undefined {
  if (!param) return undefined;
  const normalized = decodeURIComponent(param).trim().toLowerCase();
  const slugified = normalized.replace(/[\\s_]+/g, "-");
  return WORLD_COUNTRIES_CATALOG.find(
    (c) =>
      c.code.toLowerCase() === normalized ||
      c.id.toLowerCase() === normalized ||
      c.slug.toLowerCase() === normalized ||
      c.slug.toLowerCase() === slugified ||
      c.name.toLowerCase() === normalized ||
      c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slugified
  );
}

export type SearchableGeoItem = {
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

// Search index for Countries and States
export function searchWorldTerritories(query: string, limit = 8): SearchableGeoItem[] {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();
  const results: SearchableGeoItem[] = [];

  // Match countries first
  for (const c of WORLD_COUNTRIES_CATALOG) {
    if (
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase() === q ||
      c.id.toLowerCase() === q ||
      c.capital.toLowerCase().includes(q)
    ) {
      results.push({
        type: "country",
        id: c.id,
        name: c.name,
        code: c.code,
        flag: c.flag,
        countryName: c.name,
        countryCode: c.code,
        url: \`/global/\${c.code.toLowerCase()}\`,
        subType: c.region,
        currentAmount: c.currentPool,
      });
      if (results.length >= limit) return results;
    }
  }

  // Match states / subdivisions
  for (const c of WORLD_COUNTRIES_CATALOG) {
    for (const s of c.states) {
      if (
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase() === q ||
        s.code.toLowerCase() === q
      ) {
        results.push({
          type: "state",
          id: s.id,
          name: s.name,
          code: s.code,
          flag: c.flag,
          countryName: c.name,
          countryCode: c.code,
          url: \`/global/\${c.code.toLowerCase()}\`,
          subType: s.type || "Subdivision",
          currentAmount: s.currentBid,
        });
        if (results.length >= limit) return results;
      }
    }
  }

  return results;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/data/world-countries.ts'), tsContent, 'utf8');
console.log('Successfully wrote src/lib/data/world-countries.ts with 197 countries and', 
  compiled.reduce((acc, c) => acc + c.states.length, 0), 'subdivisions');
