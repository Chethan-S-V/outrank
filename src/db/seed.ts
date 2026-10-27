import { existsSync } from "fs";
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { categories } from "./schema/categories";
import { products } from "./schema/products";
import { contributions, payments } from "./schema/financial";
import { productEvents } from "./schema/product-events";
import { users } from "./schema/users";

const CANONICAL_CATEGORIES = [
  {
    name: "Cars & Automobiles",
    slug: "cars-automobiles",
    description: "Electric vehicles, luxury supercars, sedans, SUVs, sports cars, and automotive innovations.",
    isActive: true,
  },
  {
    name: "Cameras & Photography",
    slug: "cameras-photography",
    description: "Mirrorless cameras, cinema gear, optical lenses, studio flashes, and photography equipment.",
    isActive: true,
  },
  {
    name: "Trucks & Commercial Vehicles",
    slug: "trucks-commercial-vehicles",
    description: "Heavy-duty commercial trucks, haulers, freight fleets, semi-trailers, and logistics transport.",
    isActive: true,
  },
  {
    name: "Tractors & Farm Machinery",
    slug: "tractors-farm-machinery",
    description: "Agricultural tractors, harvesters, precision tillage, sprayers, and farm equipment.",
    isActive: true,
  },
  {
    name: "Coding & Developer Tools",
    slug: "coding-dev-tools",
    description: "IDEs, code editors, compilers, GitHub repos, engineering APIs, and developer toolchains.",
    isActive: true,
  },
  {
    name: "OTT & Streaming Platforms",
    slug: "ott-streaming",
    description: "Video on demand, movie streaming, OTT networks, music platforms, and live broadcasts.",
    isActive: true,
  },
  {
    name: "Social Media & Creators",
    slug: "social-media",
    description: "Creator accounts, Instagram profiles, Twitter/X voices, TikTokers, and influencer hubs.",
    isActive: true,
  },
  {
    name: "AI & Agents",
    slug: "ai-agents",
    description: "Artificial intelligence platforms, autonomous agents, neural models, and LLM utilities.",
    isActive: true,
  },
  {
    name: "Productivity & SaaS",
    slug: "productivity",
    description: "Workflow automation, project management, team collaboration, and cloud software.",
    isActive: true,
  },
  {
    name: "Gaming & Esports",
    slug: "gaming-esports",
    description: "Game studios, esports teams, interactive titles, Discord gaming bots, and virtual worlds.",
    isActive: true,
  },
  {
    name: "Fintech & Banking",
    slug: "fintech-banking",
    description: "Payment gateways, digital banking, personal finance, investing, and neo-banks.",
    isActive: true,
  },
  {
    name: "E-Commerce & Retail",
    slug: "ecommerce-retail",
    description: "Online storefronts, direct-to-consumer brands, marketplaces, and dropshipping utilities.",
    isActive: true,
  },
  {
    name: "Education & EdTech",
    slug: "education-edtech",
    description: "Coding bootcamps, online academies, tutorial platforms, and language tutors.",
    isActive: true,
  },
  {
    name: "Design & Creative",
    slug: "design",
    description: "UI/UX kits, 3D modeling, creative graphics, generative visual assets, and design systems.",
    isActive: true,
  },
  {
    name: "Crypto & Web3",
    slug: "crypto-web3",
    description: "Decentralized protocols, DeFi apps, smart contracts, crypto wallets, and blockchains.",
    isActive: true,
  },
  {
    name: "Cybersecurity & Privacy",
    slug: "cybersecurity",
    description: "VPN services, password vaults, encryption tools, and identity verification systems.",
    isActive: true,
  },
  {
    name: "News, Media & Podcasts",
    slug: "news-media",
    description: "Tech publications, digital newsletters, podcast networks, and journalism aggregators.",
    isActive: true,
  },
  {
    name: "Health & Fitness",
    slug: "health-fitness",
    description: "Workout tracking, biohacking tools, nutrition planning, and health monitoring apps.",
    isActive: true,
  },
  {
    name: "Mobile & Desktop Apps",
    slug: "mobile-apps",
    description: "Native iOS, Android, macOS, Windows, and Linux standalone applications.",
    isActive: true,
  },
  {
    name: "Hardware & IoT",
    slug: "hardware-iot",
    description: "Connected devices, smart home automation, wearables, and robotics hardware.",
    isActive: true,
  },
  {
    name: "Marketing & SEO",
    slug: "marketing",
    description: "Search engine optimization, ad networks, growth analytics, and viral acquisition tools.",
    isActive: true,
  },
  {
    name: "Other Platforms",
    slug: "other",
    description: "Original web utilities, experimental platforms, and emerging software creations.",
    isActive: true,
  },
];

const CANONICAL_PRODUCTS = [
  {
    name: "Notion",
    slug: "notion",
    description: "All-in-one workspace for notes, tasks, wikis, and collaboration.",
    websiteUrl: "https://notion.so",
    categorySlug: "productivity",
    ownerEmail: "team@notion.so",
    totalSupportAmount: "24718.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    makerName: "Ivan Zhao",
    twitterHandle: "@NotionHQ",
    githubUrl: "https://github.com/makenotion",
  },
  {
    name: "Figma",
    slug: "figma",
    description: "Collaborative interface design tool for modern teams.",
    websiteUrl: "https://figma.com",
    categorySlug: "design",
    ownerEmail: "team@figma.com",
    totalSupportAmount: "18432.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    makerName: "Dylan Field",
    twitterHandle: "@figma",
    githubUrl: "https://github.com/figma",
    discordUrl: "https://discord.gg/figma",
  },
  {
    name: "ChatGPT",
    slug: "chatgpt",
    description: "Advanced AI assistant for work, learning, and creativity.",
    websiteUrl: "https://chatgpt.com",
    categorySlug: "ai-agents",
    ownerEmail: "support@openai.com",
    totalSupportAmount: "16905.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    makerName: "Sam Altman",
    twitterHandle: "@OpenAI",
    githubUrl: "https://github.com/openai",
    discordUrl: "https://discord.gg/openai",
  },
  {
    name: "Discord",
    slug: "discord",
    description: "Community platform for gamers, creators, and businesses.",
    websiteUrl: "https://discord.com",
    categorySlug: "other",
    ownerEmail: "support@discord.com",
    totalSupportAmount: "14320.00",
    logoUrl: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    makerName: "Jason Citron",
    twitterHandle: "@discord",
    discordUrl: "https://discord.gg/discord",
  },
  {
    name: "Canva",
    slug: "canva",
    description: "Design anything with an easy-to-use online tool.",
    websiteUrl: "https://canva.com",
    categorySlug: "design",
    ownerEmail: "support@canva.com",
    totalSupportAmount: "12846.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    makerName: "Melanie Perkins",
    twitterHandle: "@canva",
  },
  {
    name: "GitHub",
    slug: "github",
    description: "The world's leading platform for developers.",
    websiteUrl: "https://github.com",
    categorySlug: "developer-tools",
    ownerEmail: "support@github.com",
    totalSupportAmount: "11924.00",
    logoUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    makerName: "Thomas Dohmke",
    twitterHandle: "@github",
    githubUrl: "https://github.com/github",
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "Build and deploy modern web applications.",
    websiteUrl: "https://vercel.com",
    categorySlug: "developer-tools",
    ownerEmail: "support@vercel.com",
    totalSupportAmount: "10431.00",
    logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    makerName: "Guillermo Rauch",
    twitterHandle: "@vercel",
    githubUrl: "https://github.com/vercel",
    discordUrl: "https://discord.gg/vercel",
  },
  {
    name: "Linear",
    slug: "linear",
    description: "The issue tracking tool you'll actually enjoy using.",
    websiteUrl: "https://linear.app",
    categorySlug: "productivity",
    ownerEmail: "contact@linear.app",
    totalSupportAmount: "9250.00",
    logoUrl: "https://linear.app/static/favicon.ico",
    makerName: "Karri Saarinen",
    twitterHandle: "@linear",
    githubUrl: "https://github.com/linear",
  },
  {
    name: "Framer",
    slug: "framer",
    description: "Design and ship stunning interactive websites.",
    websiteUrl: "https://framer.com",
    categorySlug: "design",
    ownerEmail: "support@framer.com",
    totalSupportAmount: "8800.00",
    logoUrl: "https://framer.com/favicon.ico",
    makerName: "Koen Bok",
    twitterHandle: "@framer",
    discordUrl: "https://discord.gg/framer",
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    description: "Generative AI imagery and creative exploration tool.",
    websiteUrl: "https://midjourney.com",
    categorySlug: "ai-agents",
    ownerEmail: "support@midjourney.com",
    totalSupportAmount: "7900.00",
    logoUrl: "https://midjourney.com/favicon.ico",
    makerName: "David Holz",
    twitterHandle: "@midjourney",
    discordUrl: "https://discord.gg/midjourney",
  },
  {
    name: "Claude",
    slug: "claude",
    description: "Next-generation AI assistant built by Anthropic.",
    websiteUrl: "https://anthropic.com/claude",
    categorySlug: "ai-agents",
    ownerEmail: "support@anthropic.com",
    totalSupportAmount: "7400.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    makerName: "Dario Amodei",
    twitterHandle: "@AnthropicAI",
    githubUrl: "https://github.com/anthropics",
    discordUrl: "https://discord.gg/anthropic",
  },
];

async function seed() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL is not defined in environment.");
    process.exit(1);
  }

  const client = postgres(connectionString);
  const db = drizzle(client);

  console.log("Seeding canonical categories...");
  for (const cat of CANONICAL_CATEGORIES) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoUpdate({
        target: categories.slug,
        set: {
          name: cat.name,
          description: cat.description,
          isActive: cat.isActive,
        },
      });
  }

  // Fetch all category IDs
  const allCategories = await db.select().from(categories);
  const categoryMap = new Map(allCategories.map((c) => [c.slug, c.id]));

  console.log("Seeding showcase users...");
  const [seedUser] = await db
    .insert(users)
    .values({
      name: "Outrank Creator",
      handle: "outrank",
      email: "hello@outrank.app",
      bio: "Official Outrank showcase community account.",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=outrank",
      provider: "twitter",
      twitterHandle: "@outrank_app",
      githubHandle: "outrank",
    })
    .onConflictDoNothing()
    .returning();

  console.log("Seeding canonical verified products with social media platforms...");
  for (const prod of CANONICAL_PRODUCTS) {
    const categoryId = categoryMap.get(prod.categorySlug);
    if (!categoryId) continue;

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, prod.slug))
      .limit(1);

    if (existing.length === 0) {
      const [inserted] = await db
        .insert(products)
        .values({
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          websiteUrl: prod.websiteUrl,
          logoUrl: prod.logoUrl,
          categoryId,
          ownerEmail: prod.ownerEmail,
          makerName: prod.makerName,
          twitterHandle: prod.twitterHandle,
          githubUrl: prod.githubUrl,
          discordUrl: prod.discordUrl,
          userId: seedUser?.id,
          verificationStatus: "verified",
          moderationStatus: "approved",
          totalSupportAmount: prod.totalSupportAmount,
          supportCurrency: "USD",
        })
        .returning({ id: products.id });

      const productId = inserted.id;

      const [contrib] = await db
        .insert(contributions)
        .values({
          productId,
          amount: prod.totalSupportAmount,
          currency: "USD",
          status: "succeeded",
          contributorEmail: "backer@community.outrank.dev",
        })
        .returning({ id: contributions.id });

      await db
        .insert(payments)
        .values({
          contributionId: contrib.id,
          provider: "stripe",
          providerPaymentId: `seed_pay_${prod.slug}`,
          amount: prod.totalSupportAmount,
          currency: "USD",
          status: "succeeded",
        });

      await db.insert(productEvents).values({
        productId,
        eventType: "product_verified",
        metadata: {
          name: prod.name,
          verifiedAt: new Date().toISOString(),
          initialRankStanding: "verified_showcase",
        },
      });
    } else {
      // Update social fields
      await db
        .update(products)
        .set({
          makerName: prod.makerName,
          twitterHandle: prod.twitterHandle,
          githubUrl: prod.githubUrl,
          discordUrl: prod.discordUrl,
        })
        .where(eq(products.id, existing[0].id));
    }
  }

  console.log("Seeding complete! Database successfully populated with canonical data and social profiles.");
  await client.end();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed execution failed:", err);
  process.exit(1);
});
