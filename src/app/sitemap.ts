import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { localizePath } from "@/i18n/config";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Cada página en español y en inglés, avisándole a Google que son la misma en dos idiomas
  const entry = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => {
    const languages = {
      es: `${site.url}${path === "/" ? "" : path}`,
      en: `${site.url}${localizePath(path, "en")}`,
    };
    return [languages.es, languages.en].map((url) => ({
      url,
      lastModified: now,
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  };
  return [
    ...["/", "/tienda", "/disena-tu-obra", "/info"].flatMap((p) => entry(p, p === "/" ? 1 : 0.8, "weekly")),
    ...products.flatMap((p) => entry(`/tienda/${p.slug}`, 0.7, "monthly")),
  ];
}
