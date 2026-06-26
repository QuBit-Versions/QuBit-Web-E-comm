"use client";

import { useEffect, useState } from "react";
import { UniverseFallback } from "./UniverseFallback";

/**
 * Mantém a camada semântica de parceiros (UniverseFallback) sempre no DOM para
 * SEO e leitores de tela. Quando há WebGL, os planetas do canvas global provêm
 * os links visíveis, então o fallback fica `sr-only`. Sem WebGL (ou antes do
 * mount), ele aparece visível — nunca um vácuo.
 */
export function UniverseFallbackGate() {
  const [webgl, setWebgl] = useState(false);

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      setWebgl(
        !!(
          window.WebGLRenderingContext &&
          (c.getContext("webgl") || c.getContext("experimental-webgl"))
        )
      );
    } catch {
      setWebgl(false);
    }
  }, []);

  return <UniverseFallback className={webgl ? "sr-only" : "py-12 pointer-events-auto"} />;
}
