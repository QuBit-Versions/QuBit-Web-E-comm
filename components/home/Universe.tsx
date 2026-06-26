import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { partners, type Partner } from "@/content/partners";

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

const CAP = 8; // máximo de nós no teaser; o resto vira "+N" → /universo

type Node =
  | { kind: "partner"; partner: Partner; x: number; y: number }
  | { kind: "more"; count: number; x: number; y: number };

// Distribui `count` pontos num anel elíptico (rx, ry), começando em startDeg.
function ring(count: number, rx: number, ry: number, startDeg: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = ((startDeg + (i * 360) / count) * Math.PI) / 180;
    return { x: 50 + rx * Math.cos(a), y: 50 + ry * Math.sin(a) };
  });
}

// Layout que escala: 1 anel até 6 nós, 2 anéis acima disso.
function layout(): { nodes: Node[]; rings: { rx: number; ry: number }[] } {
  const overflow = partners.length > CAP ? partners.length - (CAP - 1) : 0;
  const shown = overflow > 0 ? partners.slice(0, CAP - 1) : partners.slice(0, CAP);
  const total = shown.length + (overflow > 0 ? 1 : 0);

  let positions: { x: number; y: number }[];
  let rings: { rx: number; ry: number }[];
  if (total <= 6) {
    rings = [{ rx: 38, ry: 34 }];
    positions = ring(total, 38, 34, -90);
  } else {
    const outer = Math.ceil(total / 2);
    const inner = total - outer;
    rings = [
      { rx: 43, ry: 37 },
      { rx: 25, ry: 21 },
    ];
    positions = [...ring(outer, 43, 37, -90), ...ring(inner, 25, 21, -90 + 180 / Math.max(1, inner))];
  }

  const nodes: Node[] = shown.map((partner, i) => ({ kind: "partner", partner, ...positions[i] }));
  if (overflow > 0) nodes.push({ kind: "more", count: overflow, ...positions[total - 1] });
  return { nodes, rings };
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Prova social = o universo QuBit (2º bloco). F-pattern (palavras-chave à
 * esquerda), chunking (stats/badges), hierarquia e white space. Cada parceiro é
 * um LINK (logo ou iniciais); a constelação escala para N parceiros (1–2 anéis)
 * e leva à experiência 3D completa em /universo.
 */
export function Universe() {
  const { nodes, rings } = layout();

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

          <div className="b-item flex gap-10 mb-10" style={st(3)}>
            <div>
              <p className="font-sans text-3xl font-medium text-text-1">{partners.length}+</p>
              <p className="text-sm text-text-3">negócios em órbita</p>
            </div>
            <div>
              <p className="font-sans text-3xl font-medium text-text-1">
                {new Set(partners.map((p) => p.sector)).size}
              </p>
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

        {/* Constelação — escala para N parceiros, cada um é um link */}
        <div className="b-item relative aspect-square w-full max-w-xl mx-auto" style={st(2)}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            {nodes.map((node, i) => (
              <line key={i} x1="50" y1="50" x2={node.x} y2={node.y} stroke="var(--line)" strokeWidth="0.25" />
            ))}
            <g className="animate-spin-slow" style={{ transformOrigin: "50px 50px" }}>
              {rings.map((r, i) => (
                <ellipse key={i} cx="50" cy="50" rx={r.rx} ry={r.ry} fill="none" stroke="var(--line)" strokeWidth="0.4" />
              ))}
            </g>
          </svg>

          {/* núcleo QuBit */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full surface-glass-strong [box-shadow:var(--glow-brand-strong)] flex items-center justify-center"
            aria-hidden
          >
            <span className="font-sans text-mono-label text-brand-text">QuBit</span>
          </div>

          {/* nós */}
          {nodes.map((node, i) => {
            const pos = { left: `${node.x}%`, top: `${node.y}%` } as React.CSSProperties;
            if (node.kind === "more") {
              return (
                <Link
                  key={`more-${i}`}
                  href="/universo"
                  aria-label={`Mais ${node.count} empresas — explorar o universo`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                  style={pos}
                >
                  <span className="w-12 h-12 rounded-full surface-glass flex items-center justify-center font-sans text-sm font-medium text-brand-text group-hover:border-brand-text group-hover:[box-shadow:var(--glow-brand)] transition-all">
                    +{node.count}
                  </span>
                  <span className="font-sans text-[10px] text-text-3">ver todos</span>
                </Link>
              );
            }
            const p = node.partner;
            const external = p.url.startsWith("http");
            const href = external ? p.url : "/universo";
            return (
              <a
                key={p.id}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`${p.name} — ${p.sector}`}
                title={p.name}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={pos}
              >
                <span className="w-12 h-12 rounded-full surface-glass flex items-center justify-center overflow-hidden group-hover:border-brand-text group-hover:[box-shadow:var(--glow-brand)] transition-all">
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt="" width={48} height={48} className="w-9 h-9 object-contain" />
                  ) : (
                    <span className="font-sans text-sm font-medium text-text-1">{initials(p.name)}</span>
                  )}
                </span>
                <span className="font-sans text-[10px] text-text-3 whitespace-nowrap">{p.name}</span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
