import type { Metadata } from "next";
import { UniverseFallbackGate } from "@/components/universe/UniverseFallbackGate";
import { ButtonLink } from "@/components/ui/Button";
import { universe_copy } from "@/content/universe";
import { site } from "@/content/copy";

export const metadata: Metadata = {
  title: `${universe_copy.fallbackTitle} — ${site.name}`,
  description: universe_copy.sub,
};

const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

export default function UniversoPage() {
  // O universo 3D é o próprio fundo global (canvas em layout.tsx), que no /universo
  // vira interativo e ganha os planetas. O conteúdo flutua por cima em z-10 e é
  // pointer-events-none, deixando o arraste passar para o canvas; só os links e
  // botões reativam o ponteiro.
  return (
    <main
      id="main-content"
      className="relative z-10 min-h-screen pt-32 pb-24 px-6 pointer-events-none flex flex-col"
    >
      <div className="max-w-[1320px] mx-auto w-full">
        <header className="max-w-2xl mb-6">
          <p className="text-mono-label text-brand-text mb-4">{universe_copy.eyebrow}</p>
          <h1 className="text-h1 text-text-1 mb-6">{universe_copy.h1}</h1>
          <p className="text-body-lg text-text-2">{universe_copy.sub}</p>
          <p className="mt-4 text-xs text-text-3">{universe_copy.hint}</p>
        </header>

        {/* Espaço aberto onde os planetas orbitam (o canvas global está atrás) */}
        <div className="min-h-[46vh]" aria-hidden />

        <section className="mt-12 max-w-2xl pointer-events-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <ButtonLink href="/diagnostico" size="lg">
              {universe_copy.ctaPrimary}
            </ButtonLink>
            <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
              Falar no WhatsApp
            </ButtonLink>
          </div>
        </section>

        {/* Camada semântica acessível (sr-only com WebGL; visível sem WebGL) */}
        <UniverseFallbackGate />
      </div>
    </main>
  );
}
