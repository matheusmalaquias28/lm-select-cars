import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { cars } from "@/lib/stock";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/estoque", "/avaliacao", "/financiamento", "/sobre", "/contato", "/privacidade"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: p === "/estoque" || p === "" ? ("daily" as const) : ("monthly" as const),
    priority: p === "" ? 1 : p === "/estoque" ? 0.9 : 0.5,
  }));
  const vehicles = cars.map((c) => ({
    url: `${site.url}/estoque/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: c.photos.slice(0, 3).map((p) => p.src),
  }));
  return [...pages, ...vehicles];
}
