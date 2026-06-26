import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { partners } from "@/content/partners";

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

// 6 parceiros em destaque, posicionados numa órbita (hexágono).
const featured = partners.slice(0, 6).map((p, i) => {
  const a = (-90 + i * 60) * (Math.PI / 180);
  return { ...p, x: 50 + 38 * Math.cos(a), y: 50 + 36 * Math.sin(a) };
});

/**
 * Prova social = o universo QuBit (2º bloco, logo após o hero — onde o olho
 * busca validação cedo). Aplica F-pattern (palavras-chave à esquerda/topo),
 * chunking (stats curtas), hierarquia tipográfica e white space generoso.
 * É um teaser leve (SVG/CSS) que leva à experiência 3D completa em /universo.
 */
export function Universe() {
  return (
    <section id="universo-prova" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
        {/* Texto — palavras-chave primeiro (F-pattern) */}
        <div>
          <p className="b-item text-mono-label text-brand-text mb-4" style={st(0)}>Prova social</p>
          <h2 className="b-item text-h1 text-text-1 mb-6 max-w-xl" style={st(1)}>
            Empresas que já orbitam a QuBit.
          </h2>
          <p className="b-item text-body-lg text-text-2 mb-10 max-w-md" style={st(2)}>
            Cada planeta é um negócio que cresce com a gente — de moda a educação.
          </p>

          {/* Chunk de prova: números curtos, fáceis de escanear */}
          <div className="b-item flex gap-10 mb-10" style={st(3)}>
            <div>
              <p className="font-sans text-3xl font-medium text-text-1">10+</p>
              <p className="text-sm text-text-3">negócios em órbita</p>
            </div>
            <div>
              <p className="font-sans text-3xl font-medium text-text-1">9</p>
              <p className="text-sm text-text-3">setores diferentes</p>
            </div>
          </div>

          <Link
            href="/universo"
            className="b-item font-sans inline-flex items-center gap-2 surface-glass rounded-xl px-6 min-h-12 text-text-1 hover:border-brand-text hover:[box-shadow:var(--glow-brand)] transition-all group"
            style={st(4)}
          >
            Explorar o universo
            <ArrowRight className="w-4 h-4 text-brand-text transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        {/* Constelação de parceiros (teaser leve do /universo) */}
        <div className="b-item relative aspect-square w-full max-w-xl mx-auto" style={st(2)} aria-hidden>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {/* linhas até o núcleo */}
            {featured.map((p) => (
              <line key={p.id} x1="50" y1="50" x2={p.x} y2={p.y} stroke="var(--line)" strokeWidth="0.3" />
            ))}
            {/* órbitas girando devagar */}
            <g className="animate-spin-slow" style={{ transformOrigin: "50px 50px" }}>
              <ellipse cx="50" cy="50" rx="42" ry="28" fill="none" stroke="var(--line)" strokeWidth="0.4" />
              <ellipse cx="50" cy="50" rx="28" ry="42" fill="none" stroke="var(--line)" strokeWidth="0.4" />
            </g>
          </svg>

          {/* núcleo QuBit */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full surface-glass-strong [box-shadow:var(--glow-brand-strong)] flex items-center justify-center">
            <span className="font-sans text-mono-label text-brand-text">QuBit</span>
          </div>

          {/* chips dos parceiros */}
          {featured.map((p) => (
            <div
              key={p.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 surface-glass rounded-full px-3 py-1.5 text-center whitespace-nowrap"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              <span className="block text-xs text-text-1 font-medium">{p.name}</span>
              <span className="block text-[10px] text-text-3">{p.sector}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
