import type { Metadata } from "next";
import { Check, Minus, MousePointerClick } from "lucide-react";
import { pillars, services, transparency, contractRules } from "@/content/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { SelectionProvider } from "@/components/services/SelectionContext";
import { SelectionBar } from "@/components/services/SelectionBar";
import { Block } from "@/components/ui/Block";
import { SnapMode } from "@/components/ui/SnapMode";
import { ButtonLink } from "@/components/ui/Button";
import { Stepper } from "@/components/funnel/Stepper";
import { site } from "@/content/copy";

export const metadata: Metadata = {
  title: `Serviços e investimento — ${site.name}`,
  description:
    "Da presença digital ao sistema sob medida. Marque o que te interessa e siga para um diagnóstico já personalizado.",
  alternates: { canonical: "/servicos" },
};

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

export default function ServicosPage() {
  return (
    <main id="main-content">
      <Stepper current="servicos" />
      <SnapMode soft />
      <SelectionProvider>
        {/* Bloco — abertura */}
        <Block className="px-6">
          <div className="max-w-[1320px] mx-auto w-full">
            <p className="b-item text-mono-label text-brand-text mb-4" style={st(0)}>Serviços & investimento</p>
            <h1 className="b-item text-display text-text-1 mb-6 max-w-3xl" style={st(1)}>
              Monte o seu caminho.
            </h1>
            <p className="b-item text-body-lg text-text-2 max-w-2xl mb-8" style={st(2)}>
              Comece pela estrutura mínima e adicione conforme amadurece. Cada faixa mostra o que muda
              o valor — sem surpresa depois.
            </p>
            <p className="b-item inline-flex items-center gap-2 text-sm text-text-3 surface-glass rounded-full px-4 py-2" style={st(3)}>
              <MousePointerClick className="w-4 h-4 text-brand-text" aria-hidden />
              Marque “tenho interesse” nas soluções e siga para um diagnóstico já personalizado.
            </p>
          </div>
        </Block>

        {/* Um bloco por pilar */}
        {pillars.map((pillar) => {
          const list = services.filter((s) => s.pillarId === pillar.id);
          if (!list.length) return null;
          const c = (list.length - 1) / 2;
          return (
            <Block key={pillar.id} className="px-6" id={`pillar-${pillar.id}`}>
              <div className="max-w-[1320px] mx-auto w-full">
                <div className="max-w-2xl mb-10">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="b-item text-h1 text-text-1" style={st(0)}>{pillar.name}</h2>
                    {pillar.transversal && (
                      <span className="b-item font-sans text-mono-label text-text-3 border border-line rounded-full px-2.5 py-0.5" style={st(0)}>
                        transversal
                      </span>
                    )}
                  </div>
                  <p className="b-item text-body-lg text-text-2" style={st(1)}>{pillar.tagline}</p>
                  <p className="b-item text-sm text-text-3 mt-1 italic" style={st(2)}>Resolve: “{pillar.fear}”</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  {list.map((s, i) => (
                    <div key={s.id} className="b-spread" style={st(i + 3, i < c ? -1 : i > c ? 1 : 0)}>
                      <ServiceCard service={s} selectable />
                    </div>
                  ))}
                </div>
              </div>
            </Block>
          );
        })}

        {/* Bloco — transparência + contratação */}
        <Block className="px-6">
          <div className="max-w-4xl mx-auto w-full">
            <div className="b-item surface-glass glow-aurora rounded-2xl p-8 md:p-12 mb-6" style={st(0)}>
              <h2 className="text-h2 text-text-1 mb-3">{transparency.title}</h2>
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
            </div>

            <details className="b-item surface-glass rounded-2xl p-6 md:p-8 group" style={st(1)}>
              <summary className="font-sans cursor-pointer text-text-1 font-medium list-none flex items-center justify-between min-h-[44px]">
                Como contratamos (escopo fechado, aditivos e responsabilidades)
                <span className="text-text-3 text-xl transition-transform group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <div className="mt-6 pt-6 border-t border-line grid md:grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-mono-label text-text-3 mb-3">toda proposta define</p>
                  <ul className="list-disc pl-5 space-y-1 text-text-2 marker:text-brand-text/60">
                    {contractRules.escopoFechado.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                  <p className="text-text-2 mt-4">
                    <span className="text-text-1 font-medium">Aditivo:</span> {contractRules.aditivo}
                  </p>
                </div>
                <div>
                  <p className="text-mono-label text-text-3 mb-3">responsabilidade do cliente</p>
                  <ul className="list-disc pl-5 space-y-1 text-text-2 marker:text-brand-text/60">
                    {contractRules.clientResponsibility.map((r) => <li key={r}>{r}</li>)}
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </Block>

        {/* Bloco — fechamento */}
        <Block className="px-6">
          <div className="b-item surface-glass glow-aurora rounded-2xl p-8 md:p-12 max-w-2xl mx-auto w-full" style={st(0)}>
            <h2 className="text-h2 text-text-1 mb-3">Não sabe por onde começar?</h2>
            <p className="text-body-lg text-text-2 mb-8">
              Marque as soluções de interesse acima e use a barra para seguir — ou agende o diagnóstico
              direto. Ele é gratuito e aponta o caminho certo para o seu momento.
            </p>
            <ButtonLink href="/diagnostico" size="lg">Agendar diagnóstico</ButtonLink>
          </div>
        </Block>

        <SelectionBar />
      </SelectionProvider>
    </main>
  );
}
