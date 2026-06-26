import { Layers, ShieldCheck, LineChart, Eye } from "lucide-react";
import { porque, howItWorks } from "@/content/copy";

const icons: Record<string, typeof Layers> = {
  layers: Layers,
  shield: ShieldCheck,
  chart: LineChart,
  eye: Eye,
};

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

/**
 * "Por que a QuBit" — bloco UNIFICADO que consolida o que antes vivia espalhado
 * (problema, solução, incentivos, transparência) em 4 chunks escaneáveis, mais
 * "como funciona" como mini-passos embutidos. Menos fragmentação = menos carga
 * cognitiva. Mantém as âncoras #solucao e #como-funciona da navegação.
 */
export function PorQue() {
  const n = porque.reasons.length;
  const c = (n - 1) / 2;

  return (
    <section id="solucao" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={st(0)}>{porque.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-4 max-w-2xl" style={st(1)}>{porque.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-12 max-w-2xl" style={st(2)}>{porque.body}</p>

        {/* 4 motivos em chunks (ícone + título curto + 2 linhas) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {porque.reasons.map((r, i) => {
            const Icon = icons[r.icon] ?? Layers;
            return (
              <div
                key={r.id}
                style={st(i + 3, i < c ? -1 : i > c ? 1 : 0)}
                className="b-spread surface-glass rounded-2xl p-7 transition-shadow duration-300 hover:[box-shadow:var(--glow-aurora-inset)]"
              >
                <Icon className="w-6 h-6 text-brand-text mb-4" aria-hidden strokeWidth={1.5} />
                <h3 className="text-h3 text-text-1 mb-2">{r.title}</h3>
                <p className="text-text-2 text-sm">{r.text}</p>
              </div>
            );
          })}
        </div>

        {/* "Como funciona" — mini-passos embutidos (mantém a âncora) */}
        <div id="como-funciona" className="b-item mt-14 surface-glass rounded-2xl p-7 md:p-8" style={st(7)}>
          <p className="text-mono-label text-text-3 mb-6">{porque.stepsLabel}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-5">
            {howItWorks.steps.map((s) => (
              <div key={s.number} className="flex items-start gap-3">
                <span className="font-sans shrink-0 w-8 h-8 rounded-lg bg-brand/15 text-brand-text text-sm flex items-center justify-center [box-shadow:var(--glow-brand)]">
                  {s.number}
                </span>
                <div>
                  <p className="text-text-1 font-medium text-sm">{s.title}</p>
                  <p className="text-text-3 text-xs mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
