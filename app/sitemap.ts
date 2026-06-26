import type { MetadataRoute } from "next";

// TODO: trocar pelo domínio real quando definido
const BASE = "https://qubit.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: { path: string; priority: number; freq: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, freq: "weekly" },
    { path: "/servicos", priority: 0.9, freq: "monthly" },
    { path: "/universo", priority: 0.8, freq: "monthly" },
    { path: "/proposta", priority: 0.7, freq: "monthly" },
    { path: "/diagnostico", priority: 0.9, freq: "monthly" },
    { path: "/privacidade", priority: 0.3, freq: "yearly" },
    { path: "/termos", priority: 0.3, freq: "yearly" },
  ];

  return routes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
