import type { MetadataRoute } from "next";
import { getPublishedArticles, getPublishedProducts } from "@/lib/data-store";

function resolveBaseUrl(): string {
  const raw = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://primeflow-production.up.railway.app"
  ).trim();
  const withProto =
    raw.startsWith("http://") || raw.startsWith("https://") ? raw : `https://${raw}`;
  return withProto.replace(/\/+$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = resolveBaseUrl();

  const [products, articles] = await Promise.all([
    getPublishedProducts(),
    getPublishedArticles(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/about",
    "/products",
    "/technology",
    "/solutions",
    "/sustainability",
    "/insights",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/products/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${baseUrl}/insights/${a.slug}`,
    lastModified: new Date(a.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...articleRoutes];
}
