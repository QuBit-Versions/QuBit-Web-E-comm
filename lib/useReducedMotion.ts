"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Preferência de movimento reduzido do sistema.
 *
 * Usa `useSyncExternalStore` em vez de useState+useEffect: a media query é uma
 * fonte de verdade EXTERNA ao React. Com efeito, o primeiro render sempre saía
 * como `false` e só no segundo virava o valor real — um frame de animação que
 * escapava justamente para quem pediu para não ter animação.
 */
function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/** No servidor não há preferência declarada; assume movimento normal. */
function getServerSnapshot(): boolean {
  return false;
}

export function useReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
