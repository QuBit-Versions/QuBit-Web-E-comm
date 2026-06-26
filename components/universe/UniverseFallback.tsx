import Link from "next/link";
import { partners } from "@/content/partners";
import { universe_copy } from "@/content/universe";

/**
 * Tier 3 — camada semântica acessível (SSR, SEO, sem JS, sem WebGL).
 * É a fonte de verdade dos links de parceiros. Quando o Canvas 3D carrega,
 * esta camada vira `sr-only` (continua no DOM para leitores de tela e busca).
 */
export function UniverseFallback({ className = "" }: { className?: string }) {
  return (
    <section className={className} aria-label={universe_copy.fallbackTitle}>
      <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1320px] mx-auto px-6">
        {partners.map((p) => (
          <li key={p.id}>
            <a
              href={p.url}
              target={p.url.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex flex-col gap-1 p-5 rounded-lg border border-line bg-surface-1 hover:border-text-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text"
            >
              <span className="text-text-1 font-medium">{p.name}</span>
              <span className="text-xs text-text-3">{p.sector}</span>
            </a>
          </li>
        ))}

        {/* Convite "sua marca pode orbitar aqui" — §6.4 (nunca um vácuo triste) */}
        <li>
          <Link
            href="/diagnostico"
            className="flex flex-col gap-1 p-5 rounded-lg border border-dashed border-brand/40 bg-brand/5 hover:border-brand/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text h-full justify-center"
          >
            <span className="text-brand-text font-medium">{universe_copy.invite}</span>
            <span className="text-xs text-text-3">{universe_copy.inviteSub}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
