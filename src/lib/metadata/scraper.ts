/**
 * Universal safe website and creator metadata analyser.
 * Extracts high-resolution logo/profile image, title, bio/description,
 * and accurately classifies the category across all modern platform sectors.
 */

export type ScrapedMetadata = {
  name: string;
  description: string;
  logoUrl: string | null;
  twitterHandle?: string | null;
  githubUrl?: string | null;
  discordUrl?: string | null;
  suggestedCategorySlug?: string;
  isSocialProfile?: boolean;
};

export async function scrapeWebsiteMetadata(urlStr: string): Promise<ScrapedMetadata> {
  let targetUrl: URL;
  try {
    let clean = urlStr.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    targetUrl = new URL(clean);
  } catch {
    throw new Error("Invalid website URL provided.");
  }

  const hostname = targetUrl.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = targetUrl.pathname;

  // ==========================================
  // 1. DEDICATED SOCIAL & CREATOR PLATFORMS
  // ==========================================

  // Instagram: instagram.com/username
  if (hostname.includes("instagram.com")) {
    const segments = pathname.split("/").filter(Boolean);
    const candidate = segments[0]?.replace(/^@/, "");
    const ignoredSegments = new Set([
      "p", "reel", "reels", "stories", "explore", "direct", "accounts",
      "developer", "about", "legal", "terms", "privacy"
    ]);

    if (candidate && !ignoredSegments.has(candidate.toLowerCase())) {
      const cleanHandle = candidate.toLowerCase();
      const displayName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      return {
        name: `@${cleanHandle}`,
        description: `Official Instagram creator profile for ${displayName} (@${cleanHandle}). Follow for content, updates, and community highlights.`,
        logoUrl: `https://unavatar.io/instagram/${cleanHandle}?fallback=https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
        suggestedCategorySlug: "social-media",
        isSocialProfile: true,
      };
    }
  }

  // Twitter / X: x.com/username or twitter.com/username
  if (hostname.includes("twitter.com") || hostname.includes("x.com")) {
    const segments = pathname.split("/").filter(Boolean);
    const candidate = segments[0]?.replace(/^@/, "");
    const ignored = new Set([
      "home", "explore", "notifications", "messages", "settings", "i",
      "intent", "search", "tos", "privacy", "help"
    ]);

    if (candidate && !ignored.has(candidate.toLowerCase())) {
      const cleanHandle = candidate.toLowerCase();
      const displayName = candidate.charAt(0).toUpperCase() + candidate.slice(1);
      return {
        name: `@${cleanHandle}`,
        description: `Verified X (Twitter) profile for ${displayName} (@${cleanHandle}). Real-time insights, dispatches, and public updates.`,
        logoUrl: `https://unavatar.io/twitter/${cleanHandle}?fallback=https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
        twitterHandle: `@${cleanHandle}`,
        suggestedCategorySlug: "social-media",
        isSocialProfile: true,
      };
    }
  }

  // TikTok: tiktok.com/@username
  if (hostname.includes("tiktok.com")) {
    const segments = pathname.split("/").filter(Boolean);
    const candidate = segments[0]?.replace(/^@/, "");
    if (candidate) {
      const cleanHandle = candidate.toLowerCase();
      return {
        name: `@${cleanHandle}`,
        description: `TikTok video creator profile for @${cleanHandle}. Viral shorts, entertainment, and creative productions.`,
        logoUrl: `https://unavatar.io/tiktok/${cleanHandle}?fallback=https://api.dicebear.com/7.x/bottts/svg?seed=${cleanHandle}`,
        suggestedCategorySlug: "social-media",
        isSocialProfile: true,
      };
    }
  }

  // YouTube: youtube.com/@channel or youtube.com/c/name
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) {
    const match = pathname.match(/@([a-zA-Z0-9_.-]+)/) || pathname.match(/\/(?:c|user|channel)\/([a-zA-Z0-9_.-]+)/);
    if (match && match[1]) {
      const handle = match[1];
      return {
        name: `@${handle}`,
        description: `YouTube video creator channel @${handle}. Watch original streaming content, documentaries, and creative releases.`,
        logoUrl: `https://unavatar.io/youtube/${handle}`,
        suggestedCategorySlug: "ott-streaming",
        isSocialProfile: true,
      };
    }
  }

  // GitHub user or repository
  if (hostname === "github.com") {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 1 && !["features", "pricing", "explore", "trending", "topics", "collections"].includes(segments[0].toLowerCase())) {
      const username = segments[0];
      return {
        name: `@${username}`,
        description: `GitHub open-source engineer and developer profile for @${username}. Inspect codebases, commits, and open packages.`,
        logoUrl: `https://github.com/${username}.png`,
        githubUrl: `https://github.com/${username}`,
        suggestedCategorySlug: "coding-dev-tools",
        isSocialProfile: true,
      };
    }
    if (segments.length >= 2) {
      const [owner, repo] = segments;
      return {
        name: `${repo}`,
        description: `Open-source software repository ${owner}/${repo} hosted on GitHub. Developer documentation, issues, and releases.`,
        logoUrl: `https://github.com/${owner}.png`,
        githubUrl: `https://github.com/${owner}/${repo}`,
        suggestedCategorySlug: "coding-dev-tools",
        isSocialProfile: false,
      };
    }
  }

  // Spotify
  if (hostname.includes("spotify.com")) {
    return {
      name: "Spotify Showcase",
      description: "Music, album, artist, or podcast streaming release on Spotify.",
      logoUrl: "https://unavatar.io/spotify.com",
      suggestedCategorySlug: "ott-streaming",
    };
  }

  // Substack
  if (hostname.includes("substack.com")) {
    const sub = hostname.split(".")[0];
    const cleanName = sub.charAt(0).toUpperCase() + sub.slice(1);
    return {
      name: cleanName,
      description: `Independent publication and newsletter by ${cleanName} on Substack. Deep dives, essays, and subscriber dispatches.`,
      logoUrl: `https://unavatar.io/${hostname}`,
      suggestedCategorySlug: "news-media",
    };
  }

  // ==========================================
  // 2. LIVE HTML PARSING & METADATA EXTRACTION
  // ==========================================

  const hostParts = hostname.split(".");
  const rawDomain = hostParts[0] || "Platform";
  const fallbackName = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
  const fallbackFavicon = `https://unavatar.io/${hostname}?fallback=https://www.google.com/s2/favicons?domain=${targetUrl.hostname}&sz=256`;

  let html = "";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(targetUrl.href, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 OutrankBot/2.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (response.ok) {
      html = await response.text();
    }
  } catch {
    // If fetch fails or is blocked by Cloudflare/DDoS protection, return rich domain metadata
    return {
      name: fallbackName,
      description: `Verified platform showcase for ${targetUrl.hostname}.`,
      logoUrl: fallbackFavicon,
      suggestedCategorySlug: classifyCategory(`${hostname} ${fallbackName}`),
    };
  }

  // Helper Regex Extractors
  function getMeta(propertyOrName: string): string | null {
    const regex = new RegExp(
      `<meta\\s+(?:[^>]*?\\b(?:property|name)=["']${propertyOrName}["'][^>]*?\\bcontent=["']([^"']+)["']|[^>]*?\\bcontent=["']([^"']+)["'][^>]*?\\b(?:property|name)=["']${propertyOrName}["'])`,
      "i"
    );
    const match = html.match(regex);
    return match ? (match[1] || match[2] || "").trim() : null;
  }

  function getTagContent(tagName: string): string | null {
    const regex = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i");
    const match = html.match(regex);
    return match ? match[1].replace(/<[^>]+>/g, "").trim() : null;
  }

  // 1. High-Resolution Icon Extraction (Apple Touch Icon, SVG Icon, PNG Icon)
  function getBestIcon(): string | null {
    // Apple touch icons are usually 180x180 or 192x192 PNGs, ideal for sharp logo avatars
    const appleIconRegex = /<link\s+[^>]*?rel=["']apple-touch-icon(?:-precomposed)?["'][^>]*?href=["']([^"']+)["']/i;
    const appleMatch = html.match(appleIconRegex);
    if (appleMatch && appleMatch[1]) {
      return resolveUrl(appleMatch[1].trim());
    }

    // Modern SVG or high-res favicon
    const iconRegex = /<link\s+[^>]*?rel=["'](?:shortcut\s+)?icon["'][^>]*?href=["']([^"']+)["']/i;
    const iconMatch = html.match(iconRegex);
    if (iconMatch && iconMatch[1]) {
      return resolveUrl(iconMatch[1].trim());
    }

    return null;
  }

  function resolveUrl(relativeOrAbsolute: string): string {
    if (relativeOrAbsolute.startsWith("http://") || relativeOrAbsolute.startsWith("https://")) {
      return relativeOrAbsolute;
    }
    if (relativeOrAbsolute.startsWith("//")) {
      return `https:${relativeOrAbsolute}`;
    }
    if (relativeOrAbsolute.startsWith("/")) {
      return `${targetUrl.origin}${relativeOrAbsolute}`;
    }
    return `${targetUrl.origin}/${relativeOrAbsolute}`;
  }

  // 2. Extract JSON-LD Schema (e.g. Organization, Product, WebSite)
  let jsonLdName: string | null = null;
  let jsonLdDesc: string | null = null;
  let jsonLdLogo: string | null = null;

  try {
    const jsonLdMatches = html.match(/<script\s+[^>]*?type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatches) {
      for (const block of jsonLdMatches) {
        const rawJson = block.replace(/<script[^>]*>|<\/script>/gi, "").trim();
        const parsed = JSON.parse(rawJson);
        const item = Array.isArray(parsed) ? parsed[0] : parsed["@graph"] ? parsed["@graph"][0] : parsed;
        if (item) {
          if (!jsonLdName && item.name) jsonLdName = String(item.name).trim();
          if (!jsonLdDesc && item.description) jsonLdDesc = String(item.description).trim();
          if (!jsonLdLogo && item.logo) {
            const logo = typeof item.logo === "string" ? item.logo : item.logo.url;
            if (logo) jsonLdLogo = resolveUrl(logo);
          }
        }
      }
    }
  } catch {
    // Ignore JSON-LD parse errors
  }

  // 3. Resolve Title / Name
  const ogTitle = getMeta("og:title") || getMeta("twitter:title") || jsonLdName || getTagContent("title");
  let resolvedName = fallbackName;
  if (ogTitle) {
    // Strip common suffixes: "Product Name | The best tool" -> "Product Name"
    const cleaned = ogTitle.split(/[-|:–—]/)[0]?.trim();
    if (cleaned && cleaned.length >= 2 && cleaned.length <= 48) {
      resolvedName = cleaned;
    } else if (ogTitle.length <= 48) {
      resolvedName = ogTitle.trim();
    }
  }

  // 4. Resolve Bio / Description
  const rawDescription =
    getMeta("og:description") ||
    getMeta("description") ||
    getMeta("twitter:description") ||
    jsonLdDesc ||
    getTagContent("p") ||
    `Verified platform and digital innovations for ${resolvedName}.`;

  const cleanDescription = rawDescription
    .replace(/\s+/g, " ")
    .replace(/<[^>]+>/g, "")
    .slice(0, 180)
    .trim();

  // 5. Resolve Logo / Avatar
  const ogImage = getMeta("og:image") || getMeta("twitter:image");
  const bestIcon = getBestIcon();

  let resolvedLogo = fallbackFavicon;
  if (jsonLdLogo) {
    resolvedLogo = jsonLdLogo;
  } else if (bestIcon) {
    resolvedLogo = bestIcon;
  } else if (ogImage) {
    resolvedLogo = resolveUrl(ogImage);
  }

  // 6. Social Handles Discovery
  let twitterHandle: string | null = null;
  const twitterMeta = getMeta("twitter:site") || getMeta("twitter:creator");
  if (twitterMeta && twitterMeta.startsWith("@")) {
    twitterHandle = twitterMeta;
  } else {
    const twMatch = html.match(/twitter\.com\/([a-zA-Z0-9_]{1,15})/i) || html.match(/x\.com\/([a-zA-Z0-9_]{1,15})/i);
    if (twMatch && twMatch[1] && !["intent", "share", "home", "search", "explore"].includes(twMatch[1].toLowerCase())) {
      twitterHandle = `@${twMatch[1]}`;
    }
  }

  let githubUrl: string | null = null;
  const ghMatch = html.match(/https?:\/\/github\.com\/([a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+)/i);
  if (ghMatch && ghMatch[0]) {
    githubUrl = ghMatch[0];
  }

  let discordUrl: string | null = null;
  const dcMatch = html.match(/https?:\/\/(?:discord\.gg|discord\.com\/invite)\/[a-zA-Z0-9]+/i);
  if (dcMatch && dcMatch[0]) {
    discordUrl = dcMatch[0];
  }

  // 7. Accurate Category Classification
  const corpus = `${hostname} ${resolvedName} ${cleanDescription}`.toLowerCase();
  const suggestedCategorySlug = classifyCategory(corpus);

  return {
    name: resolvedName,
    description: cleanDescription,
    logoUrl: resolvedLogo,
    twitterHandle,
    githubUrl,
    discordUrl,
    suggestedCategorySlug,
  };
}

/**
 * Intelligent domain and corpus category classifier
 */
function classifyCategory(corpus: string): string {
  // Coding & Developer Tools
  if (
    corpus.includes("code") ||
    corpus.includes("coding") ||
    corpus.includes("developer") ||
    corpus.includes("github") ||
    corpus.includes("api") ||
    corpus.includes("sdk") ||
    corpus.includes("compiler") ||
    corpus.includes("ide") ||
    corpus.includes("terminal") ||
    corpus.includes("leetcode") ||
    corpus.includes("codeforces") ||
    corpus.includes("replit") ||
    corpus.includes("stack") ||
    corpus.includes("docker") ||
    corpus.includes("kubernetes") ||
    corpus.includes("database") ||
    corpus.includes("postgres") ||
    corpus.includes("npm")
  ) {
    return "coding-dev-tools";
  }

  // OTT & Streaming
  if (
    corpus.includes("stream") ||
    corpus.includes("streaming") ||
    corpus.includes("netflix") ||
    corpus.includes("hotstar") ||
    corpus.includes("disney") ||
    corpus.includes("primevideo") ||
    corpus.includes("spotify") ||
    corpus.includes("twitch") ||
    corpus.includes("movie") ||
    corpus.includes("series") ||
    corpus.includes("ott") ||
    corpus.includes("podcast") ||
    corpus.includes("tv") ||
    corpus.includes("cinema") ||
    corpus.includes("video on demand")
  ) {
    return "ott-streaming";
  }

  // AI & Autonomous Agents
  if (
    corpus.includes("ai") ||
    corpus.includes("agent") ||
    corpus.includes("gpt") ||
    corpus.includes("llm") ||
    corpus.includes("neural") ||
    corpus.includes("openai") ||
    corpus.includes("anthropic") ||
    corpus.includes("claude") ||
    corpus.includes("machine learning") ||
    corpus.includes("deep learning") ||
    corpus.includes("autonomous") ||
    corpus.includes("model") ||
    corpus.includes("bot")
  ) {
    return "ai-agents";
  }

  // Fintech & Banking
  if (
    corpus.includes("bank") ||
    corpus.includes("banking") ||
    corpus.includes("fintech") ||
    corpus.includes("payment") ||
    corpus.includes("stripe") ||
    corpus.includes("pay") ||
    corpus.includes("wallet") ||
    corpus.includes("invest") ||
    corpus.includes("stock") ||
    corpus.includes("trade") ||
    corpus.includes("loan") ||
    corpus.includes("credit") ||
    corpus.includes("invoice")
  ) {
    return "fintech-banking";
  }

  // Crypto & Web3
  if (
    corpus.includes("crypto") ||
    corpus.includes("bitcoin") ||
    corpus.includes("ethereum") ||
    corpus.includes("solana") ||
    corpus.includes("blockchain") ||
    corpus.includes("web3") ||
    corpus.includes("nft") ||
    corpus.includes("defi") ||
    corpus.includes("dao") ||
    corpus.includes("token")
  ) {
    return "crypto-web3";
  }

  // Gaming & Esports
  if (
    corpus.includes("game") ||
    corpus.includes("gaming") ||
    corpus.includes("esport") ||
    corpus.includes("steam") ||
    corpus.includes("roblox") ||
    corpus.includes("epic games") ||
    corpus.includes("playstation") ||
    corpus.includes("xbox") ||
    corpus.includes("nintendo") ||
    corpus.includes("discord bot")
  ) {
    return "gaming-esports";
  }

  // Social Media & Creators
  if (
    corpus.includes("social") ||
    corpus.includes("creator") ||
    corpus.includes("instagram") ||
    corpus.includes("twitter") ||
    corpus.includes("tiktok") ||
    corpus.includes("threads") ||
    corpus.includes("influencer") ||
    corpus.includes("community")
  ) {
    return "social-media";
  }

  // E-Commerce & Retail
  if (
    corpus.includes("shop") ||
    corpus.includes("store") ||
    corpus.includes("ecommerce") ||
    corpus.includes("shopify") ||
    corpus.includes("amazon") ||
    corpus.includes("cart") ||
    corpus.includes("retail") ||
    corpus.includes("merch") ||
    corpus.includes("apparel") ||
    corpus.includes("clothing")
  ) {
    return "ecommerce-retail";
  }

  // Design & Creative
  if (
    corpus.includes("design") ||
    corpus.includes("figma") ||
    corpus.includes("canva") ||
    corpus.includes("ui") ||
    corpus.includes("ux") ||
    corpus.includes("3d") ||
    corpus.includes("creative") ||
    corpus.includes("graphic") ||
    corpus.includes("art") ||
    corpus.includes("typography") ||
    corpus.includes("font")
  ) {
    return "design";
  }

  // Education & EdTech
  if (
    corpus.includes("learn") ||
    corpus.includes("education") ||
    corpus.includes("edtech") ||
    corpus.includes("course") ||
    corpus.includes("academy") ||
    corpus.includes("school") ||
    corpus.includes("tutor") ||
    corpus.includes("bootcamp") ||
    corpus.includes("duolingo")
  ) {
    return "education-edtech";
  }

  // Cybersecurity
  if (
    corpus.includes("security") ||
    corpus.includes("privacy") ||
    corpus.includes("vpn") ||
    corpus.includes("auth") ||
    corpus.includes("password") ||
    corpus.includes("vault") ||
    corpus.includes("encryption") ||
    corpus.includes("firewall") ||
    corpus.includes("antivirus")
  ) {
    return "cybersecurity";
  }

  // News, Media & Podcasts
  if (
    corpus.includes("news") ||
    corpus.includes("media") ||
    corpus.includes("journal") ||
    corpus.includes("press") ||
    corpus.includes("magazine") ||
    corpus.includes("newsletter") ||
    corpus.includes("publication")
  ) {
    return "news-media";
  }

  // Health & Fitness
  if (
    corpus.includes("health") ||
    corpus.includes("fitness") ||
    corpus.includes("workout") ||
    corpus.includes("wellness") ||
    corpus.includes("gym") ||
    corpus.includes("diet") ||
    corpus.includes("nutrition") ||
    corpus.includes("medical")
  ) {
    return "health-fitness";
  }

  // Marketing & Growth
  if (
    corpus.includes("marketing") ||
    corpus.includes("seo") ||
    corpus.includes("advertising") ||
    corpus.includes("leads") ||
    corpus.includes("growth") ||
    corpus.includes("campaign") ||
    corpus.includes("email marketing")
  ) {
    return "marketing";
  }

  // Productivity & SaaS (Default versatile category)
  return "productivity";
}
