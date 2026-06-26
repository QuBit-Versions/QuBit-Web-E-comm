import type { Metadata } from "next";
import { Check, Minus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { ServiceCard } from "@/components/services/ServiceCard";
import { pillars, services, transparency, contractRules } from "@/content/services";
import { proposta_page, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `Proposta comercial — ${site.name}`,
  description: proposta_page.sub,
  robots: { index: false },
};

const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

export default function PropostaPage() {
  return (
    <main id="main-content" className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-[1320px] mx-auto">
        {/* Cabeçalho */}
        <header className="max-w-3xl mb-16">
          <p className="text-mono-label text-brand-text mb-4">{proposta_page.eyebrow}</p>
          <h1 className="text-h1 text-text-1 mb-6">{proposta_page.h1}</h1>
          <p className="text-body-lg text-text-2">{proposta_page.sub}</p>
        </header>

        {/* Como funciona a contratação — quadro de previsibilidade */}
        <section className="surface-glass glow-aurora rounded-2xl p-8 md:p-10 max-w-4xl mb-20" aria-labelledby="como">
          <h2 id="como" className="text-h3 text-text-1 mb-4">Modular, com escopo fechado.</h2>
          <p className="text-text-2 mb-6 max-w-2xl">
            Você começa pela estrutura mínima e adiciona capacidades conforme o negócio amadurece.
            Toda proposta tem escopo fechado — sem surpresa de preço no meio do caminho.
          </p>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {contractRules.escopoFechado.map((r) => (
              <p key={r} className="flex gap-2 text-text-2">
                <Check className="w-4 h-4 shrink-0 mt-0.5 text-brand-text" aria-hidden strokeWidth={2} />
                {r}
              </p>
            ))}
          </div>
        </section>

        {/* Catálogo completo por pilar — tudo à vista (camada de compromisso) */}
        {pillars.map((pillar) => {
          const list = services.filter((s) => s.pillarId === pillar.id);
          if (!list.length) return null;
          return (
            <section key={pillar.id} className="mb-20" aria-labelledby={`prop-${pillar.id}`}>
              <div className="max-w-2xl mb-8">
                <h2 id={`prop-${pillar.id}`} className="text-h2 text-text-1 mb-2">{pillar.name}</h2>
                <p className="text-text-2">{pillar.tagline}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {list.map((s) => (
                  <ServiceCard key={s.id} service={s} defaultOpen />
                ))}
              </div>
            </section>
          );
        })}

        {/* Transparência */}
        <section className="mb-16 surface-glass rounded-2xl p-8 md:p-12 max-w-4xl" aria-labelledby="prop-transparencia">
          <h2 id="prop-transparencia" className="text-h2 text-text-1 mb-3">{transparency.title}</h2>
          <p className="text-text-2 mb-8 max-w-2xl">{transparency.intro}</p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-mono-label text-success-strong mb-3">prometemos</p>
              <ul className="space-y-3">
                {transparency.promise.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-text-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-success-strong" aria-hidden strokeWidth={2} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-mono-label text-text-3 mb-3">não prometemos</p>
              <ul className="space-y-3">
                {transparency.notPromise.map((p) => (
                  <li key={p} className="flex gap-2 text-sm text-text-3">
                    <Minus className="w-4 h-4 shrink-0 mt-0.5" aria-hidden strokeWidth={2} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Regras de contratação — expandidas (modo documento) */}
        <section className="mb-20 surface-glass rounded-2xl p-8 md:p-12 max-w-4xl" aria-labelledby="prop-regras">
          <h2 id="prop-regras" className="text-h2 text-text-1 mb-8">Condições de contratação</h2>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-mono-label text-text-3 mb-3">alteração de escopo</p>
              <p className="text-text-2 mb-6">{contractRules.aditivo}</p>
              <p className="text-mono-label text-text-3 mb-3">toda proposta define</p>
              <ul className="list-disc pl-5 space-y-1 text-text-2 marker:text-brand-text/60">
                {contractRules.escopoFechado.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-mono-label text-text-3 mb-3">responsabilidade do cliente</p>
              <ul className="list-disc pl-5 space-y-1 text-text-2 marker:text-brand-text/60">
                {contractRules.clientResponsibility.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="surface-glass glow-aurora rounded-2xl p-8 md:p-12 max-w-2xl" aria-labelledby="prop-cta">
          <h2 id="prop-cta" className="text-h2 text-text-1 mb-4">{proposta_page.ctaTitle}</h2>
          <p className="text-body-lg text-text-2 mb-8">{proposta_page.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <ButtonLink href="/servicos" size="lg">
              Agendar diagnóstico
            </ButtonLink>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              Falar no WhatsApp
            </ButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}
