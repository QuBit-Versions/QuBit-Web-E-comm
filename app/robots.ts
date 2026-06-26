import type { MetadataRoute } from "next";

// TODO: trocar pelo domínio real quando definido
const BASE = "https://qubit.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // rotas de conversão/sistema fora do índice
      disallow: ["/api/", "/obrigado", "/diagnostico", "/proposta"],
    },
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
