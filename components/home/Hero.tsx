import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { OctopusMark } from "@/components/brand/OctopusMark";
import { SplitText } from "@/components/ui/SplitText";
import { hero, site } from "@/content/copy";
import { partners } from "@/content/partners";

export function Hero() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-6">
      {/* coluna de texto mais larga que a do visual — §5.1 */}
      <div className="max-w-[1320px] mx-auto w-full grid md:grid-cols-[1.15fr_0.85fr] gap-16 items-center flex-1 py-12">
        <div>
          <p className="b-item text-mono-label text-brand-text mb-6" style={{ ["--i" as string]: 0 } as React.CSSProperties}>
            {hero.eyebrow}
          </p>
          <SplitText as="h1" text={hero.h1} className="text-display text-text-1 mb-6 block" start={2} />
          <p className="b-item text-body-lg text-text-2 mb-10 max-w-lg" style={{ ["--i" as string]: 14 } as React.CSSProperties}>
            {hero.sub}
          </p>
          <div className="b-item flex flex-wrap gap-4 mb-8" style={{ ["--i" as string]: 16 } as React.CSSProperties}>
            <ButtonLink href="/servicos" size="lg">
              {hero.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              {hero.ctaSecondary}
            </ButtonLink>
          </div>
          <p className="b-item text-sm text-text-3" style={{ ["--i" as string]: 18 } as React.CSSProperties}>
            {hero.microcopy}
          </p>

          {/* Micro-compromisso: 1 clique por objetivo → abre /servicos no pilar */}
          <div className="b-item mt-8" style={{ ["--i" as string]: 20 } as React.CSSProperties}>
            <p className="text-sm text-text-2 mb-3">{hero.objectivesLabel}</p>
            <div className="flex flex-wrap gap-2">
              {hero.objectives.map((o) => (
                <Link
                  key={o.pillar}
                  href={`/servicos#pillar-${o.pillar}`}
                  className="font-sans surface-glass rounded-full px-4 min-h-[44px] inline-flex items-center text-sm text-text-1 hover:border-brand-text hover:[box-shadow:var(--glow-brand)] transition-all duration-fast"
                >
                  {o.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Visual-herói: polvo-qubit em pixels (código) flutuando, halo aurora
            e a órbita do fóton girando devagar — composição, não app-icon jogado. */}
        <div className="relative hidden md:flex items-center justify-center aspect-square" aria-hidden>
          {/* halo aurora atrás do polvo */}
          <div
            className="absolute w-72 h-72 rounded-full blur-[90px] opacity-30"
            style={{ background: "var(--grad)" }}
          />

          {/* órbita do fóton — elíptica, inclinada, girando devagar */}
          <svg viewBox="-200 -200 400 400" className="absolute w-[30rem] h-[30rem] animate-spin-slow">
            <g transform="rotate(-24)">
              <ellipse rx="188" ry="86" fill="none" stroke="var(--line)" strokeWidth="1" />
              <circle cx="188" cy="0" r="5" fill="var(--brand)" />
            </g>
          </svg>

          {/* polvo-qubit em pixels (SVG via código), flutuando */}
          <OctopusMark animated className="relative w-64 h-64 animate-float [filter:drop-shadow(0_0_36px_rgba(43,77,255,0.28))]" />
        </div>
      </div>

      {/* Faixa parceiros — no fluxo (robusta de 320px a ultrawide, sem absolute) */}
      <div className="max-w-[1320px] mx-auto w-full mt-8">
        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
          <span className="text-mono-label text-text-3">{hero.partnersLabel}</span>
          {partners.slice(0, 5).map((p) => (
            <span key={p.id} className="text-sm text-text-2 surface-glass px-3.5 py-1.5 rounded-full">
              {p.name}
            </span>
          ))}
          <Link href="/universo" className="text-sm text-brand-text hover:underline ml-1">
            {hero.partnersLink}
          </Link>
        </div>
      </div>
    </section>
  );
}
