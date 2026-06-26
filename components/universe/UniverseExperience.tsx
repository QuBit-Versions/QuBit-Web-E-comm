"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { UniverseFallback } from "./UniverseFallback";
import { universe_copy } from "@/content/universe";

// Canvas pesado: carrega só no cliente, nunca no SSR.
const UniverseCanvas = dynamic(() => import("./UniverseCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="w-12 h-12 rounded-full border-2 border-line border-t-brand-text animate-spin" />
    </div>
  ),
});

export function UniverseExperience() {
  // Começa como fallback (igual ao SSR) e só habilita o Canvas após o mount,
  // evitando mismatch de hidratação. Detecta suporte a WebGL no cliente.
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setEnabled(ok);
    } catch {
      setEnabled(false);
    }
  }, []);

  if (!enabled) {
    // Sem JS / sem WebGL / antes do mount → fallback visível e plenamente acessível.
    return <UniverseFallback className="py-12" />;
  }

  return (
    <div className="relative w-full h-[70vh] min-h-[520px] rounded-xl overflow-hidden border border-line">
      <UniverseCanvas />

      {/* Fallback continua no DOM como camada acessível (sr-only) para leitores de tela e SEO */}
      <UniverseFallback className="sr-only" />

      {/* Dica de interação */}
      <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-text-3 pointer-events-none select-none">
        {universe_copy.hint}
      </p>
    </div>
  );
}
