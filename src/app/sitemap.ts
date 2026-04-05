import type { MetadataRoute } from "next";
import { getBaseUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = [
    "",
    "/dashboard",
    "/research/products",
    "/research/trends",
    "/scripts",
    "/drafts",
    "/analytics",
    "/analytics/videos",
    "/reports",
    "/settings",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "daily",
    priority: route === "" ? 1 : 0.7,
  }));
}
