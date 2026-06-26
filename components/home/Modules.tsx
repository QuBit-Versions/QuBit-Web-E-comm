import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { modules_copy } from "@/content/copy";
import { pillars } from "@/content/services";

/**
 * Vitrine (camada 1 da revelação progressiva): os 4 pilares com tagline, o medo
 * que resolvem e o preço-âncora de entrada. O detalhe vive em /servicos.
 */
export function Modules() {
  const main = pillars.filter((p) => !p.transversal);
  const continuity = pillars.find((p) => p.transversal);

  return (
    <section id="precos" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{modules_copy.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-4 max-w-2xl" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{modules_copy.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-16 max-w-xl" style={{ ["--i" as string]: 2 } as React.CSSProperties}>{modules_copy.sub}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {main.map((p, i) => {
            const c = (main.length - 1) / 2;
            const dir = i < c ? -1 : i > c ? 1 : 0;
            return (
              <Link
                key={p.id}
                href={`/servicos#pillar-${p.id}`}
                style={{ ["--i" as string]: i + 3, ["--dir" as string]: dir } as React.CSSProperties}
                className="b-spread surface-glass rounded-2xl p-8 flex flex-col group transition-shadow duration-300 hover:[box-shadow:var(--glow-aurora-inset)]"
              >
                <h3 className="text-h3 text-text-1 mb-2">{p.name}</h3>
                <p className="text-text-2 mb-4">{p.tagline}</p>
                <p className="text-sm text-text-3 border-l-2 border-brand/40 pl-3 mb-6 italic">“{p.fear}”</p>
                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="font-sans text-lg text-text-1">{p.entry}</span>
                  <span className="font-sans text-sm text-brand-text inline-flex items-center gap-1">
                    ver serviços
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {continuity && (
          <Link
            href={`/servicos#pillar-${continuity.id}`}
            style={{ ["--i" as string]: 7 } as React.CSSProperties}
            className="b-item mt-6 surface-glass rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 group hover:[box-shadow:var(--glow-aurora-inset)] transition-shadow duration-300"
          >
            <span className="text-text-2">
              <span className="text-text-1 font-medium">{continuity.name}.</span> {continuity.tagline}
            </span>
            <span className="font-sans text-text-1 inline-flex items-center gap-2">
              {continuity.entry}
              <ArrowRight className="w-4 h-4 text-brand-text transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        )}

        <p className="b-item text-sm text-text-3 mt-8" style={{ ["--i" as string]: 8 } as React.CSSProperties}>{modules_copy.note}</p>
      </div>
    </section>
  );
}
