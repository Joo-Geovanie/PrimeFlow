import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://primeflow-production.up.railway.app"
  ).trim();
  const baseUrl = (
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`
  ).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/login", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
