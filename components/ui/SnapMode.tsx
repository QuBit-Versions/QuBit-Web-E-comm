"use client";

import { useEffect } from "react";

/**
 * Liga o snap por blocos (classe `.snap-page` no <html>) só enquanto a rota que
 * monta este componente estiver ativa. Mantém o scroll da janela — e o warp das
 * partículas. Removido ao sair da rota.
 */
export function SnapMode({ soft = false }: { soft?: boolean }) {
  useEffect(() => {
    const html = document.documentElement;
    const cls = soft ? "snap-page-soft" : "snap-page";
    html.classList.add(cls);
    return () => html.classList.remove(cls);
  }, [soft]);
  return null;
}
