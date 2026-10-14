import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://www.aquari-vt.jp/", changeFrequency: "weekly", priority: 1 },
    { url: "https://www.aquari-vt.jp/achievements", changeFrequency: "monthly", priority: 0.6 },
  ];
}
