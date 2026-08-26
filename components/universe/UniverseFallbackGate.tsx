"use client";

import { useSyncExternalStore } from "react";
import type { Partner } from "@/content/partners";
import { UniverseFallback } from "./UniverseFallback";

/**
 * Mantém a camada semântica de parceiros (UniverseFallback) sempre no DOM para
 * SEO e leitores de tela. Quando há WebGL, os planetas do canvas global provêm
 * os links visíveis, então o fallback fica `sr-only`. Sem WebGL (ou antes do
 * mount), ele aparece visível — nunca um vácuo.
 */

/** A capacidade não muda durante a sessão: detecta uma vez e guarda. */
let cache: boolean | null = null;

function detectaWebgl(): boolean {
  if (cache !== null) return cache;
  try {
    const c = document.createElement("canvas");
    cache = !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    cache = false;
  }
  return cache;
}

// Capacidade do aparelho não emite eventos — nada a assinar.
const semAssinatura = () => () => {};

/** No servidor assume "sem WebGL": o fallback vai visível no HTML (bom para SEO). */
const noServidor = () => false;

export function UniverseFallbackGate({ partners = [] }: { partners?: Partner[] }) {
  const webgl = useSyncExternalStore(semAssinatura, detectaWebgl, noServidor);

  return <UniverseFallback partners={partners} className={webgl ? "sr-only" : "py-12 pointer-events-auto"} />;
}
