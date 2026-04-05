import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "@/config/site";

export function buildMetadata(
  title: string,
  description: string,
  path = "/",
): Metadata {
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}${path === "/" ? "" : path}`;

  return {
    title,
    description,
    keywords: [...siteConfig.keywords],
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
