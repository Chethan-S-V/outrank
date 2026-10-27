import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://outrank.dev";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/daily", "/categories", "/categories/*", "/products/*", "/about", "/guidelines"],
      disallow: ["/admin", "/admin/*", "/api/admin/*", "/payment/success*", "/payment/cancelled*"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
