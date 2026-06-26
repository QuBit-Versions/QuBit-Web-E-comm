import { site } from "@/content/copy";

// TODO: trocar pelo domínio/logo/redes reais quando definidos
const BASE = "https://qubit.com.br";

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: BASE,
    logo: `${BASE}/qubit_wordmark_light.svg`,
    description:
      "Construímos sua loja, cuidamos de toda a infraestrutura e operamos seu tráfego com inteligência de dados.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rio de Janeiro",
      addressRegion: "RJ",
      addressCountry: "BR",
    },
    // taxID: site.cnpj, // descomentar quando confirmado
    // sameAs: ["https://instagram.com/...", "https://linkedin.com/company/..."], // TODO: redes reais
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
