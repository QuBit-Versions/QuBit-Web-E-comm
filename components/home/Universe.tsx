import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { partners, type Partner } from "@/content/partners";

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

// Constelação elástica: anéis concêntricos com capacidade ~proporcional ao raio.
// Cresce de 1 até 4 anéis; nós e rótulos encolhem com a densidade. Gargalo ~43.
const RINGS = [
  { r: 44, cap: 18 },
  { r: 32, cap: 13 },
  { r: 21, cap: 8 },
  { r: 11, cap: 4 },
];
const RY = 0.84; // anéis quase circulares → distribuição visual uniforme
const MAX = RINGS.reduce((s, r) => s + r.cap, 0); // 43

type Item = { kind: "partner"; partner: Partner } | { kind: "more"; count: number };
type Placed = Item & { x: number; y: number };

// Escolhe quantos anéis e distribui os nós de forma BALANCEADA (proporcional ao
// raio de cada anel), respeitando o teto de cada um.
function chooseRings(total: number) {
  let k = 1;
  let cum = 0;
  for (let i = 0; i < RINGS.length; i++) {
    cum += RINGS[i].cap;
    k = i + 1;
    if (cum >= total) break;
  }
  const rings = RINGS.slice(0, k);
  const sumR = rings.reduce((s, r) => s + r.r, 0);
  const counts = rings.map((r) => Math.min(r.cap, Math.max(1, Math.round((total * r.r) / sumR))));
  let diff = total - counts.reduce((a, b) => a + b, 0);
  for (let pass = 0; diff !== 0 && pass < 12; pass++) {
    for (let i = 0; i < rings.length && diff > 0; i++) if (counts[i] < rings[i].cap) (counts[i]++, diff--);
    for (let i = rings.length - 1; i >= 0 && diff < 0; i--) if (counts[i] > 1) (counts[i]--, diff++);
  }
  return rings.map((r, i) => ({ r: r.r, count: counts[i], start: -90 + i * 25 }));
}

function build() {
  const overflow = partners.length > MAX ? partners.length - (MAX - 1) : 0;
  const shown = partners.slice(0, overflow > 0 ? MAX - 1 : Math.min(partners.length, MAX));
  const items: Item[] = shown.map((partner) => ({ kind: "partner", partner }));
  if (overflow > 0) items.push({ kind: "more", count: overflow });
  const total = items.length;

  const ringsUsed = chooseRings(total);

  // Posiciona os itens nos anéis.
  const placed: Placed[] = [];
  let idx = 0;
  for (const ring of ringsUsed) {
    for (let j = 0; j < ring.count; j++) {
      const a = ((ring.start + (j * 360) / ring.count) * Math.PI) / 180;
      placed.push({ ...items[idx++], x: 50 + ring.r * Math.cos(a), y: 50 + ring.r * RY * Math.sin(a) });
    }
  }

  // Tamanho do nó e rótulos conforme a densidade.
  const size = total <= 10 ? 52 : total <= 18 ? 42 : total <= 28 ? 34 : 28;
  return { placed, ringsUsed, size, showLabels: total <= 12, showLines: total <= 10 };
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
 * Prova social = o universo QuBit (2º bloco). F-pattern, chunking, hierarquia e
 * white space. Cada parceiro é um LINK (logo ou iniciais). A constelação se
 * AUTOAJUSTA ao número de parceiros (1–4 anéis, nós menores conforme cresce) até
 * ~43; além disso, um nó "+N" leva ao /universo (3D sem limite).
 */
export function Universe() {
  const { placed, ringsUsed, size, showLabels, showLines } = build();

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

        {/* Constelação elástica */}
        <div className="b-item relative aspect-square w-full max-w-xl mx-auto" style={st(2)}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
            {showLines &&
              placed.map((node, i) => (
                <line key={i} x1="50" y1="50" x2={node.x} y2={node.y} stroke="var(--line)" strokeWidth="0.25" />
              ))}
            <g className="animate-spin-slow" style={{ transformOrigin: "50px 50px" }}>
              {ringsUsed.map((r, i) => (
                <ellipse key={i} cx="50" cy="50" rx={r.r} ry={r.r * RY} fill="none" stroke="var(--line)" strokeWidth="0.4" />
              ))}
            </g>
          </svg>

          {/* núcleo QuBit */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full surface-glass-strong [box-shadow:var(--glow-brand-strong)] flex items-center justify-center"
            aria-hidden
          >
            <span className="font-sans text-mono-label text-brand-text">QuBit</span>
          </div>

          {/* nós */}
          {placed.map((node, i) => {
            const pos = { left: `${node.x}%`, top: `${node.y}%` } as React.CSSProperties;
            const badge: React.CSSProperties = { width: size, height: size };

            if (node.kind === "more") {
              return (
                <Link
                  key={`more-${i}`}
                  href="/universo"
                  aria-label={`Mais ${node.count} empresas — explorar o universo`}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                  style={pos}
                >
                  <span
                    style={badge}
                    className="rounded-full surface-glass flex items-center justify-center font-sans font-medium text-brand-text group-hover:border-brand-text group-hover:[box-shadow:var(--glow-brand)] transition-all"
                  >
                    +{node.count}
                  </span>
                  {showLabels && <span className="font-sans text-[10px] text-text-3">ver todos</span>}
                </Link>
              );
            }

            const p = node.partner;
            const external = p.url.startsWith("http");
            return (
              <a
                key={p.id}
                href={external ? p.url : "/universo"}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                aria-label={`${p.name} — ${p.sector}`}
                title={p.name}
                className="group absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1"
                style={pos}
              >
                <span
                  style={badge}
                  className="rounded-full surface-glass flex items-center justify-center overflow-hidden group-hover:border-brand-text group-hover:[box-shadow:var(--glow-brand)] transition-all"
                >
                  {p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt="" className="w-3/4 h-3/4 object-contain" />
                  ) : (
                    <span className="font-sans font-medium text-text-1" style={{ fontSize: Math.round(size * 0.32) }}>
                      {initials(p.name)}
                    </span>
                  )}
                </span>
                {showLabels && <span className="font-sans text-[10px] text-text-3 whitespace-nowrap">{p.name}</span>}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
