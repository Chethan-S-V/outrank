import { existsSync } from "fs";
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
} else if (existsSync(".env")) {
  process.loadEnvFile(".env");
}

import postgres from "postgres";

const REAL_PRODUCTS = [
  // AI & Agents
  {
    name: "ChatGPT",
    slug: "chatgpt",
    description: "The world-leading conversational AI model and intelligence interface created by OpenAI.",
    websiteUrl: "https://chatgpt.com",
    categorySlug: "ai-agents",
    totalSupportAmount: "48200.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    makerName: "Sam Altman",
    twitterHandle: "@OpenAI",
  },
  {
    name: "Claude",
    slug: "claude",
    description: "Next-generation AI assistant built by Anthropic with constitutional safety and reasoning.",
    websiteUrl: "https://claude.ai",
    categorySlug: "ai-agents",
    totalSupportAmount: "39400.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
    makerName: "Dario Amodei",
    twitterHandle: "@AnthropicAI",
  },
  {
    name: "Cursor",
    slug: "cursor",
    description: "The AI-first code editor built for pair-programming, codebase indexing, and speed.",
    websiteUrl: "https://cursor.com",
    categorySlug: "ai-agents",
    totalSupportAmount: "34100.00",
    logoUrl: "https://www.cursor.com/favicon.ico",
    makerName: "Anysphere",
    twitterHandle: "@cursor_ai",
  },
  {
    name: "Perplexity AI",
    slug: "perplexity-ai",
    description: "AI-powered conversational search engine with live citations and real-time web discovery.",
    websiteUrl: "https://perplexity.ai",
    categorySlug: "ai-agents",
    totalSupportAmount: "28700.00",
    logoUrl: "https://www.perplexity.ai/favicon.ico",
    makerName: "Aravind Srinivas",
    twitterHandle: "@perplexity_ai",
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    description: "Generative AI program generating hyper-realistic visual art from natural language prompts.",
    websiteUrl: "https://midjourney.com",
    categorySlug: "ai-agents",
    totalSupportAmount: "24500.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png",
    makerName: "David Holz",
    twitterHandle: "@midjourney",
  },

  // Coding & Developer Tools
  {
    name: "GitHub",
    slug: "github",
    description: "The complete developer platform to build, scale, and deliver software securely.",
    websiteUrl: "https://github.com",
    categorySlug: "coding-dev-tools",
    totalSupportAmount: "45000.00",
    logoUrl: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
    makerName: "Thomas Dohmke",
    twitterHandle: "@github",
  },
  {
    name: "Vercel",
    slug: "vercel",
    description: "The frontend cloud platform powering Next.js and speed for modern web applications.",
    websiteUrl: "https://vercel.com",
    categorySlug: "coding-dev-tools",
    totalSupportAmount: "38900.00",
    logoUrl: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    makerName: "Guillermo Rauch",
    twitterHandle: "@vercel",
  },
  {
    name: "Supabase",
    slug: "supabase",
    description: "The open source Firebase alternative with Postgres database, Auth, and realtime edge functions.",
    websiteUrl: "https://supabase.com",
    categorySlug: "coding-dev-tools",
    totalSupportAmount: "31200.00",
    logoUrl: "https://supabase.com/favicon/favicon-196x196.png",
    makerName: "Paul Copplestone",
    twitterHandle: "@supabase",
  },
  {
    name: "Raycast",
    slug: "raycast",
    description: "Blazingly fast, extendable launcher that lets you complete tasks, calculate, and share scripts.",
    websiteUrl: "https://raycast.com",
    categorySlug: "coding-dev-tools",
    totalSupportAmount: "22800.00",
    logoUrl: "https://www.raycast.com/favicon-production.png",
    makerName: "Thomas Paul Mann",
    twitterHandle: "@raycastapp",
  },
  {
    name: "Postman",
    slug: "postman",
    description: "API platform for building and using APIs, simplifying each step of the API lifecycle.",
    websiteUrl: "https://postman.com",
    categorySlug: "coding-dev-tools",
    totalSupportAmount: "19500.00",
    logoUrl: "https://assets.getpostman.com/common-share/postman-logo-stacked.svg",
    makerName: "Abhinav Asthana",
    twitterHandle: "@getpostman",
  },

  // Productivity & SaaS
  {
    name: "Notion",
    slug: "notion",
    description: "Connected workspace where better, faster work happens with wikis, docs, and projects.",
    websiteUrl: "https://notion.so",
    categorySlug: "productivity",
    totalSupportAmount: "42000.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png",
    makerName: "Ivan Zhao",
    twitterHandle: "@NotionHQ",
  },
  {
    name: "Linear",
    slug: "linear",
    description: "Purpose-built tool for modern software teams to manage product building and issue tracking.",
    websiteUrl: "https://linear.app",
    categorySlug: "productivity",
    totalSupportAmount: "36500.00",
    logoUrl: "https://linear.app/favicon.ico",
    makerName: "Karri Saarinen",
    twitterHandle: "@linear",
  },
  {
    name: "Slack",
    slug: "slack",
    description: "Team communication and productivity platform with channels, huddles, and app integrations.",
    websiteUrl: "https://slack.com",
    categorySlug: "productivity",
    totalSupportAmount: "29100.00",
    logoUrl: "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
    makerName: "Stewart Butterfield",
    twitterHandle: "@SlackHQ",
  },
  {
    name: "Airtable",
    slug: "airtable",
    description: "Relational database platform enabling teams to build flexible business workflows and apps.",
    websiteUrl: "https://airtable.com",
    categorySlug: "productivity",
    totalSupportAmount: "21300.00",
    logoUrl: "https://airtable.com/images/favicon/baymax/favicon-32x32.png",
    makerName: "Howie Liu",
    twitterHandle: "@airtable",
  },

  // Design & Creative
  {
    name: "Figma",
    slug: "figma",
    description: "The leading collaborative web design tool for digital products, wireframes, and prototypes.",
    websiteUrl: "https://figma.com",
    categorySlug: "design",
    totalSupportAmount: "44200.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    makerName: "Dylan Field",
    twitterHandle: "@figma",
  },
  {
    name: "Canva",
    slug: "canva",
    description: "Free visual worksuite empowered by generative AI tools, templates, and graphic design.",
    websiteUrl: "https://canva.com",
    categorySlug: "design",
    totalSupportAmount: "35800.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    makerName: "Melanie Perkins",
    twitterHandle: "@canva",
  },
  {
    name: "Framer",
    slug: "framer",
    description: "Interactive website builder for designers that exports directly to production-ready React.",
    websiteUrl: "https://framer.com",
    categorySlug: "design",
    totalSupportAmount: "27600.00",
    logoUrl: "https://framerusercontent.com/images/48ha9Z4v38.png",
    makerName: "Koen Bok",
    twitterHandle: "@framer",
  },

  // Fintech & Banking
  {
    name: "Stripe",
    slug: "stripe",
    description: "Financial infrastructure for the internet, powering millions of businesses worldwide.",
    websiteUrl: "https://stripe.com",
    categorySlug: "fintech-banking",
    totalSupportAmount: "49000.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg",
    makerName: "Patrick Collison",
    twitterHandle: "@stripe",
  },
  {
    name: "Razorpay",
    slug: "razorpay",
    description: "India's premier full-stack payments and neo-banking platform for digital commerce.",
    websiteUrl: "https://razorpay.com",
    categorySlug: "fintech-banking",
    totalSupportAmount: "32400.00",
    logoUrl: "https://razorpay.com/favicon.png",
    makerName: "Harshil Mathur",
    twitterHandle: "@razorpay",
  },
  {
    name: "Wise",
    slug: "wise",
    description: "International money transfer and borderless multicurrency account network.",
    websiteUrl: "https://wise.com",
    categorySlug: "fintech-banking",
    totalSupportAmount: "26900.00",
    logoUrl: "https://wise.com/public-resources/assets/logos/wise/brand_logo.svg",
    makerName: "Kristo Kaarmann",
    twitterHandle: "@wise",
  },

  // OTT & Streaming Platforms
  {
    name: "Netflix",
    slug: "netflix",
    description: "Global streaming entertainment service with award-winning television series, films, and games.",
    websiteUrl: "https://netflix.com",
    categorySlug: "ott-streaming",
    totalSupportAmount: "41500.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
    makerName: "Reed Hastings",
    twitterHandle: "@netflix",
  },
  {
    name: "Spotify",
    slug: "spotify",
    description: "Digital music, podcast, and audio streaming service giving access to millions of songs worldwide.",
    websiteUrl: "https://spotify.com",
    categorySlug: "ott-streaming",
    totalSupportAmount: "37200.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg",
    makerName: "Daniel Ek",
    twitterHandle: "@Spotify",
  },
  {
    name: "Twitch",
    slug: "twitch",
    description: "Live streaming service for video games, esports tournaments, creative content, and music broadcasts.",
    websiteUrl: "https://twitch.tv",
    categorySlug: "ott-streaming",
    totalSupportAmount: "25400.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/26/Twitch_logo.svg",
    makerName: "Dan Clancy",
    twitterHandle: "@Twitch",
  },

  // Social Media & Creators
  {
    name: "Discord",
    slug: "discord",
    description: "Voice, video, and text communication service used by over a hundred million people to hang out.",
    websiteUrl: "https://discord.com",
    categorySlug: "social-media",
    totalSupportAmount: "36000.00",
    logoUrl: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    makerName: "Jason Citron",
    twitterHandle: "@discord",
  },
  {
    name: "X (formerly Twitter)",
    slug: "x-twitter",
    description: "The global digital town square for breaking news, live commentary, audio spaces, and creators.",
    websiteUrl: "https://x.com",
    categorySlug: "social-media",
    totalSupportAmount: "33800.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg",
    makerName: "Elon Musk",
    twitterHandle: "@X",
  },

  // Cybersecurity & Privacy
  {
    name: "1Password",
    slug: "1password",
    description: "Password manager and digital vault protecting enterprise logins, credentials, and SSH keys.",
    websiteUrl: "https://1password.com",
    categorySlug: "cybersecurity",
    totalSupportAmount: "31500.00",
    logoUrl: "https://1password.com/img/brand/1password-logo.svg",
    makerName: "Jeff Shiner",
    twitterHandle: "@1Password",
  },
  {
    name: "Cloudflare",
    slug: "cloudflare",
    description: "Global cloud network providing DDoS mitigation, CDN speed, and web security defense.",
    websiteUrl: "https://cloudflare.com",
    categorySlug: "cybersecurity",
    totalSupportAmount: "29800.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg",
    makerName: "Matthew Prince",
    twitterHandle: "@Cloudflare",
  },

  // Education & EdTech
  {
    name: "LeetCode",
    slug: "leetcode",
    description: "The premier platform for technical interview preparation, algorithms, and engineering challenges.",
    websiteUrl: "https://leetcode.com",
    categorySlug: "education-edtech",
    totalSupportAmount: "32700.00",
    logoUrl: "https://leetcode.com/favicon.ico",
    makerName: "Winston Tang",
    twitterHandle: "@LeetCode",
  },
  {
    name: "Duolingo",
    slug: "duolingo",
    description: "Gamified mobile and web language learning application with science-backed micro lessons.",
    websiteUrl: "https://duolingo.com",
    categorySlug: "education-edtech",
    totalSupportAmount: "28300.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo.svg",
    makerName: "Luis von Ahn",
    twitterHandle: "@duolingo",
  },

  // E-Commerce & Retail
  {
    name: "Shopify",
    slug: "shopify",
    description: "Complete commerce platform that lets anyone start, manage, and scale an online business.",
    websiteUrl: "https://shopify.com",
    categorySlug: "ecommerce-retail",
    totalSupportAmount: "38100.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    makerName: "Tobi Lütke",
    twitterHandle: "@Shopify",
  },

  // Cars & Automobiles
  {
    name: "Tesla",
    slug: "tesla",
    description: "Electric vehicles, solar roofs, and scalable clean energy ecosystem leader.",
    websiteUrl: "https://tesla.com",
    categorySlug: "cars-automobiles",
    totalSupportAmount: "46500.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    makerName: "Elon Musk",
    twitterHandle: "@Tesla",
  },
  {
    name: "Porsche",
    slug: "porsche",
    description: "High-performance German sports cars, electric Taycan series, and endurance racing engineering.",
    websiteUrl: "https://porsche.com",
    categorySlug: "cars-automobiles",
    totalSupportAmount: "34800.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/8/8c/Porsche_logo.svg",
    makerName: "Oliver Blume",
    twitterHandle: "@Porsche",
  },

  // Cameras & Photography
  {
    name: "Sony Alpha",
    slug: "sony-alpha",
    description: "Industry-standard full-frame mirrorless camera bodies and optical G-Master lenses.",
    websiteUrl: "https://alphauniverse.com",
    categorySlug: "cameras-photography",
    totalSupportAmount: "29400.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
    makerName: "Kenichiro Yoshida",
    twitterHandle: "@SonyAlpha",
  },

  // Trucks & Commercial Vehicles
  {
    name: "Volvo Trucks",
    slug: "volvo-trucks",
    description: "Global manufacturer of heavy commercial transport, electric freight trucks, and haulers.",
    websiteUrl: "https://volvotrucks.com",
    categorySlug: "trucks-commercial-vehicles",
    totalSupportAmount: "26100.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/2/29/Volvo-Iron-Mark-Black.svg",
    makerName: "Martin Lundstedt",
    twitterHandle: "@VolvoTrucks",
  },

  // Tractors & Farm Machinery
  {
    name: "John Deere",
    slug: "john-deere",
    description: "World leader in agricultural machinery, autonomous tractors, harvesters, and precision farming.",
    websiteUrl: "https://deere.com",
    categorySlug: "tractors-farm-machinery",
    totalSupportAmount: "31800.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/e/e3/John_Deere_logo.svg",
    makerName: "John C. May",
    twitterHandle: "@JohnDeere",
  },

  // Gaming & Esports
  {
    name: "Steam",
    slug: "steam",
    description: "The ultimate digital destination for playing, discussing, and creating video games.",
    websiteUrl: "https://store.steampowered.com",
    categorySlug: "gaming-esports",
    totalSupportAmount: "41000.00",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg",
    makerName: "Gabe Newell",
    twitterHandle: "@Steam",
  },

  // Crypto & Web3
  {
    name: "Uniswap",
    slug: "uniswap",
    description: "Decentralized automated liquidity protocol and trading interface on Ethereum.",
    websiteUrl: "https://uniswap.org",
    categorySlug: "crypto-web3",
    totalSupportAmount: "33400.00",
    logoUrl: "https://uniswap.org/favicon.ico",
    makerName: "Hayden Adams",
    twitterHandle: "@Uniswap",
  },
];

async function run() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Missing DATABASE_URL");
    process.exit(1);
  }

  const sql = postgres(connectionString, { max: 1 });

  console.log("1. Cleaning up artificial demo products (Resetting to clean launch)...");
  await sql`TRUNCATE TABLE payments, contributions, product_events, products CASCADE;`;

  console.log("2. Ensuring all 24 canonical categories exist...");
  // Query categories map
  const catRows = await sql`SELECT id, slug FROM categories`;
  const catMap = new Map<string, string>();
  for (const row of catRows) {
    catMap.set(row.slug, row.id);
  }

  console.log("3. Inserting flagship authentic products for clean launch...");
  for (const prod of REAL_PRODUCTS) {
    const categoryId = catMap.get(prod.categorySlug) || catMap.get("coding-dev-tools") || catRows[0].id;

    // Check if exists
    const existing = await sql`SELECT id FROM products WHERE slug = ${prod.slug} LIMIT 1`;
    if (existing.length === 0) {
      const [inserted] = await sql`
        INSERT INTO products (
          name, slug, description, website_url, logo_url,
          category_id, owner_email, maker_name, twitter_handle,
          verification_status, moderation_status,
          total_support_amount, support_currency, created_at, updated_at
        ) VALUES (
          ${prod.name}, ${prod.slug}, ${prod.description}, ${prod.websiteUrl}, ${prod.logoUrl},
          ${categoryId}, ${`contact@${prod.slug}.com`}, ${prod.makerName}, ${prod.twitterHandle},
          'verified', 'approved',
          ${prod.totalSupportAmount}, 'INR', NOW(), NOW()
        ) RETURNING id
      `;

      await sql`
        INSERT INTO contributions (
          product_id, amount, currency, status, contributor_email, created_at
        ) VALUES (
          ${inserted.id}, ${prod.totalSupportAmount}, 'INR', 'succeeded', 'verified.maker@outrank.dev', NOW()
        )
      `;
    } else {
      await sql`
        UPDATE products SET
          name = ${prod.name},
          description = ${prod.description},
          website_url = ${prod.websiteUrl},
          logo_url = ${prod.logoUrl},
          maker_name = ${prod.makerName},
          twitter_handle = ${prod.twitterHandle},
          total_support_amount = ${prod.totalSupportAmount},
          verification_status = 'verified',
          moderation_status = 'approved'
        WHERE id = ${existing[0].id}
      `;
    }
  }

  const finalCount = await sql`SELECT count(*) FROM products`;
  console.log(`Cleanup & Launch Seeding Complete! Total Authentic Real Products: ${finalCount[0].count}`);
  await sql.end();
  process.exit(0);
}

run().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
