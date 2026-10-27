import { existsSync } from "fs";
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

import { getDb } from "../src/db";
import { products } from "../src/db/schema/products";
import { categories } from "../src/db/schema/categories";
import { eq } from "drizzle-orm";

// Generators for realistic, high-quality product names across commercial categories
const CATEGORY_PRODUCT_PATTERNS: Record<string, { prefixes: string[]; stems: string[]; suffixes: string[] }> = {
  "cars-automobiles": {
    prefixes: ["Apex", "Volt", "Aero", "Hyper", "Veloce", "Zenith", "Torque", "Phantom", "Stratos", "Lumina", "Pulse", "Titan", "Electra", "Matrix", "Kinetics", "Stallion"],
    stems: ["GT", "Roadster", "EV", "Motors", "Cruiser", "CyberDrive", "HyperCar", "TrackMaster", "Sedan", "Speedster", "Autocraft", "Velocity", "Turbo", "Dynamic", "Racer"],
    suffixes: ["Pro", "Ultra", "Plaid", "RS", "S Edition", "AWD", "Stealth", "Concept", "V8 Hybrid", "Sprint", "Prime", "Apex", "Carbon", "Signature"],
  },
  "cameras-photography": {
    prefixes: ["Lumix", "Optic", "Shutter", "Chroma", "Pixel", "Aperture", "Sensor", "Cine", "Vivid", "Focus", "Prism", "Macro", "Iso", "Zenith", "Spectra"],
    stems: ["Alpha", "EOS", "LensCraft", "Vision", "Rangefinder", "CinemaX", "StudioCam", "Mirrorless", "Optics", "ShutterPro", "Reflex", "Telephoto", "SensorHub"],
    suffixes: ["Mark IV", "Cinema", "Ultra", "Prime F1.2", "Pro 8K", "RAW", "Studio Edition", "Creator Kit", "HDR", "Gold", "Spectrum", "Compact"],
  },
  "trucks-commercial-vehicles": {
    prefixes: ["Haul", "Freight", "Titan", "Bison", "Mega", "Iron", "Cargo", "Rhino", "Atlas", "Goliath", "Vanguard", "Power", "Heavy", "Mammoth"],
    stems: ["Hauler", "Semi", "Freightliner", "Transport", "Fleet", "Truck", "Rig", "Carrier", "Logistics", "RoadKing", "CargoMaster", "TractorTrailer"],
    suffixes: ["Heavy Duty", "V8 Max", "Electric 600", "LongHaul", "Commercial 4x4", "EcoDiesel", "FleetPro", "PowerDrive", "AirRide", "Titanium"],
  },
  "tractors-farm-machinery": {
    prefixes: ["Agri", "Harvest", "Terra", "Crop", "Field", "Farm", "Bio", "Cultiva", "Precision", "Green", "Meadow", "Planter", "Yield", "Plow"],
    stems: ["Tractor", "Harvester", "Cultivator", "Tiller", "AgriBot", "Combine", "FarmMaster", "QuadTrac", "Sprayer", "Seeder", "EarthMover", "GrainPro"],
    suffixes: ["9RX Turbo", "SmartTrax", "Hydro", "EcoPower", "Autonomous", "GPS Yield", "Heavy 4WD", "BioDiesel", "CropCare", "AgriMax"],
  },
  "coding-dev-tools": {
    prefixes: ["Code", "Dev", "Byte", "Git", "Syntax", "Stack", "Node", "Rust", "Hyper", "Fast", "Terminal", "Query", "Cloud", "Script", "API", "Pulse", "Omni"],
    stems: ["Craft", "Flow", "Forge", "Studio", "IDE", "Engine", "Lint", "Pilot", "Nexus", "Matrix", "Deploy", "Build", "Runner", "Tunnel", "Vault"],
    suffixes: ["CLI", "Pro", "Cloud", "Hub", "Dev", "Engine", "Workspace", "Serverless", "SDK", "Runtime", "Optimizer", "AI", "Kit"],
  },
  "developer-tools": {
    prefixes: ["Turbo", "Super", "Micro", "Omni", "Core", "Meta", "Next", "Zero", "Poly", "Flex", "Echo", "Sync", "Graph", "Vector", "Wasm"],
    stems: ["Base", "Kit", "Wire", "Link", "Mesh", "Grid", "Plex", "Cast", "Dock", "Gate", "Port", "Rail", "Proxy", "Worker", "Pipe"],
    suffixes: ["OS", "HQ", "Stack", "Layer", "Box", "Node", "Stream", "Agent", "DB", "Ops", "CI", "Native"],
  },
  "ai-agents": {
    prefixes: ["Neuro", "Agent", "Cogni", "Synapse", "Deep", "Intelli", "Cortex", "Think", "Brain", "Gen", "Quantum", "Prompt", "Mind", "Oracle", "Omni"],
    stems: ["AI", "Bot", "Mind", "Cortex", "GPT", "Synth", "Copilot", "Sense", "Logic", "Model", "Brain", "Neural", "Reason", "Vector"],
    suffixes: ["Autonomous", "LLM", "Vision", "Agentic", "3.0", "Enterprise", "Zero", "Reasoning", "Intelligence", "Core", "Nexus", "Max"],
  },
  "fintech-banking": {
    prefixes: ["Pay", "Fin", "Coin", "Cash", "Ledger", "Vault", "Capital", "Wealth", "Credit", "Swift", "Yield", "Mint", "Reserve", "Apex", "Trust"],
    stems: ["Bank", "Pay", "Fund", "Wallet", "Card", "Exchange", "Settle", "Treasury", "Lend", "Invest", "Flow", "Asset", "Transfer"],
    suffixes: ["Global", "Pay", "Prime", "Card", "Capital", "Direct", "Instant", "B2B", "Secure", "Fintech", "Rails", "Fin"],
  },
  "ott-streaming": {
    prefixes: ["Stream", "Cine", "Play", "View", "Cast", "Show", "Wave", "Flick", "Screen", "Vibe", "Motion", "Live", "Flix", "Max"],
    stems: ["TV", "Flix", "Plus", "Stream", "Cinema", "Theater", "Video", "Media", "Channel", "Network", "Screen", "Cast"],
    suffixes: ["Premium", "Live", "4K HDR", "Studio", "Originals", "Connect", "HD", "Pass", "Unlimited", "Now"],
  },
  "social-media": {
    prefixes: ["Creator", "Vibe", "Echo", "Pulse", "Feed", "Loop", "Story", "Spark", "Post", "Chat", "Snap", "Glow", "Tribe", "Connect"],
    stems: ["Gram", "Social", "Hub", "Spot", "Club", "Zone", "Sphere", "Lounge", "Link", "Room", "Circle", "Space"],
    suffixes: ["Live", "VIP", "Club", "Influencer", "Studio", "Creator", "Daily", "Official", "Pro", "Network"],
  },
  "gaming-esports": {
    prefixes: ["Pixel", "Raid", "Battle", "Quest", "Mythic", "Vortex", "Shadow", "Apex", "Cyber", "Loot", "Respawn", "Blade", "Titan", "Forge"],
    stems: ["Arena", "Forge", "Realm", "Legends", "Clash", "Saga", "Zone", "Tactics", "Wars", "Combat", "Game", "Play", "Guild"],
    suffixes: ["Online", "Esports", "Arena", "Reloaded", "2026", "Championship", "RPG", "MMO", "Elite", "VR", "Studio"],
  },
  "productivity": {
    prefixes: ["Task", "Focus", "Flow", "Note", "Plan", "Sync", "Habit", "Goal", "Time", "Organize", "Mind", "Cal", "Desk", "Work"],
    stems: ["Track", "Flow", "Do", "Base", "Pad", "Desk", "Doc", "Keep", "Board", "Table", "Space", "Sheet", "Craft"],
    suffixes: ["Workspace", "Pro", "HQ", "Daily", "App", "Suite", "Calendar", "Notes", "Studio", "Assistant"],
  },
  "design": {
    prefixes: ["Pixel", "Canvas", "Vector", "Design", "Color", "Palette", "Type", "Font", "Layer", "Visual", "Craft", "Art", "Studio", "Brand"],
    stems: ["Lab", "Studio", "Draw", "Draft", "Brush", "Mockup", "Forge", "Maker", "Kit", "Space", "Board", "Element"],
    suffixes: ["Pro", "Creative", "Studio", "Vectors", "Kit", "Icons", "3D", "Design", "System", "Cloud"],
  },
  "ecommerce-retail": {
    prefixes: ["Shop", "Cart", "Store", "Market", "Retail", "Trade", "Boutique", "Bazaar", "Merch", "Deal", "Drop", "Buy", "Outlet"],
    stems: ["Pay", "Hub", "Store", "Mall", "Commerce", "Cart", "Bay", "Zone", "Vendor", "Checkout", "Supply"],
    suffixes: ["Express", "Direct", "Supply", "Marketplace", "Prime", "Global", "Online", "24/7", "Retail"],
  },
};

const DEFAULT_PATTERN = {
  prefixes: ["Nova", "Hyper", "Zenith", "Prime", "Alpha", "Omni", "Vanguard", "Pulse", "Apex", "Nexus", "Vertex", "Atlas", "Aura", "Catalyst"],
  stems: ["Core", "Platform", "Engine", "Network", "Cloud", "Sphere", "Wave", "Hub", "Craft", "Matrix", "Lab", "Suite", "Link", "Sync"],
  suffixes: ["Pro", "AI", "Cloud", "HQ", "Global", "Enterprise", "Studio", "Connect", "X", "One", "Next", "Direct"],
};

const LOGO_TEMPLATES = [
  (seed: string) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`,
  (seed: string) => `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`,
  (seed: string) => `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`,
  (seed: string) => `https://api.dicebear.com/7.x/icons/svg?seed=${seed}`,
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("Starting 2,000 Demo Products generation...");
  const db = getDb();

  const allCategories = await db.select().from(categories);
  if (allCategories.length === 0) {
    console.error("No categories found in database. Please seed categories first.");
    process.exit(1);
  }

  console.log(`Found ${allCategories.length} categories.`);

  // Target: exactly 2,000 products distributed across categories
  const TOTAL_TARGET = 2000;
  const productsPerCategory = Math.ceil(TOTAL_TARGET / allCategories.length);

  const existingProducts = await db.select({ slug: products.slug }).from(products);
  const usedSlugs = new Set(existingProducts.map((p) => p.slug));

  const newProductsList = [];
  let count = 0;

  for (const cat of allCategories) {
    const pattern = CATEGORY_PRODUCT_PATTERNS[cat.slug] || DEFAULT_PATTERN;

    for (let i = 0; i < productsPerCategory && count < TOTAL_TARGET; i++) {
      const pfx = getRandomItem(pattern.prefixes);
      const stem = getRandomItem(pattern.stems);
      const sfx = getRandomItem(pattern.suffixes);

      // Create unique name
      let name = `${pfx} ${stem} ${sfx}`;
      let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      if (usedSlugs.has(slug)) {
        slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
        name = `${name} #${count + 1}`;
      }
      usedSlugs.add(slug);

      // Generate realistic tiered financial support
      // Some top tier (>1,000,000), some mid-tier (10,000 - 500,000), long tail (100 - 10,000)
      const tierRoll = Math.random();
      let amount: number;
      if (tierRoll > 0.98) {
        amount = Math.floor(1000000 + Math.random() * 50000000);
      } else if (tierRoll > 0.90) {
        amount = Math.floor(100000 + Math.random() * 900000);
      } else if (tierRoll > 0.60) {
        amount = Math.floor(10000 + Math.random() * 90000);
      } else {
        amount = Math.floor(50 + Math.random() * 9950);
      }

      const domain = `${slug.replace(/-[0-9]+$/, "")}.io`;
      const logoUrl = LOGO_TEMPLATES[count % LOGO_TEMPLATES.length](slug);

      newProductsList.push({
        name,
        slug,
        description: `Verified enterprise solution and top-tier showcase in ${cat.name}. Highly rated by the Outrank community for performance and innovation.`,
        websiteUrl: `https://${domain}`,
        logoUrl,
        categoryId: cat.id,
        ownerEmail: `founder@${domain}`,
        makerName: `${getRandomItem(["Alex", "Sarah", "Vikram", "Elena", "Marcus", "Priya", "David", "Chloe", "Arjun", "Lucas"])} ${getRandomItem(["Chen", "Sharma", "Smith", "Patel", "Novak", "Kim", "Dubois", "Gowda", "Muller"])}`,
        twitterHandle: `@${slug.replace(/[^a-z0-9]/g, "").slice(0, 15)}`,
        verificationStatus: "verified" as const,
        moderationStatus: "approved" as const,
        totalSupportAmount: String(amount),
        supportCurrency: "INR",
      });

      count++;
    }
  }

  console.log(`Prepared ${newProductsList.length} products. Batch inserting into database...`);

  // Batch insert in chunks of 100 to avoid payload size limits
  const BATCH_SIZE = 100;
  for (let i = 0; i < newProductsList.length; i += BATCH_SIZE) {
    const chunk = newProductsList.slice(i, i + BATCH_SIZE);
    await db.insert(products).values(chunk).onConflictDoNothing();
    const progress = Math.min(newProductsList.length, i + BATCH_SIZE);
    process.stdout.write(`\rInserted ${progress}/${newProductsList.length} products...`);
  }

  console.log("\nSuccessfully seeded 2,000 products!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Failed to seed products:", err);
  process.exit(1);
});
