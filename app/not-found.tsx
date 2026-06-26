import { ButtonLink } from "@/components/ui/Button";
import { OctopusMark } from "@/components/brand/OctopusMark";
import { not_found_page } from "@/content/copy";

export default function NotFound() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="max-w-lg text-center">
        {/* Polvo vivo "perdido no espaço" — mascote em código (não imagem) */}
        <div className="relative w-40 h-40 mx-auto mb-10 flex items-center justify-center" aria-hidden>
          <div
            className="absolute w-32 h-32 rounded-full blur-[60px] opacity-30"
            style={{ background: "var(--grad)" }}
          />
          <OctopusMark animated className="relative w-36 h-36 animate-float [filter:drop-shadow(0_0_28px_rgba(43,77,255,0.25))]" />
        </div>

        <p className="text-mono-label text-brand-text mb-4">{not_found_page.code}</p>
        <h1 className="text-h1 text-text-1 mb-4">{not_found_page.h1}</h1>
        <p className="text-body-lg text-text-2 mb-10">{not_found_page.sub}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonLink href="/" size="lg">
            {not_found_page.ctaPrimary}
          </ButtonLink>
          <ButtonLink href="/universo" variant="secondary" size="lg">
            {not_found_page.ctaSecondary}
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
