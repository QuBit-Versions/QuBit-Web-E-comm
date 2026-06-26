import { ShieldCheck, Layers, LineChart, Eye } from "lucide-react";
import { proof } from "@/content/copy";

// §5.1(6) — bloco de método/transparência (placeholder de prova social).
// TODO: substituir/complementar por depoimentos + números quando o cliente fornecer.
const icons: Record<string, typeof Layers> = {
  ecossistema: Layers,
  incentivo: ShieldCheck,
  dados: LineChart,
  "caixa-preta": Eye,
};

export function Proof() {
  return (
    <section id="prova" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{proof.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-6 max-w-2xl" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{proof.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-16 max-w-2xl" style={{ ["--i" as string]: 2 } as React.CSSProperties}>{proof.body}</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {proof.pillars.map((pillar, i) => {
            const Icon = icons[pillar.id] ?? Layers;
            return (
              <div
                key={pillar.id}
                style={{ ["--i" as string]: i + 3, ["--dir" as string]: i < (proof.pillars.length - 1) / 2 ? -1 : i > (proof.pillars.length - 1) / 2 ? 1 : 0 } as React.CSSProperties}
                className="b-spread surface-glass rounded-2xl p-7 transition-shadow duration-300 hover:[box-shadow:var(--glow-aurora-inset)]"
              >
                <Icon className="w-6 h-6 text-brand-text mb-4" aria-hidden strokeWidth={1.5} />
                <h3 className="text-h3 text-text-1 mb-3">{pillar.title}</h3>
                <p className="text-text-2 text-sm">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
