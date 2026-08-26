"use client";

import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useSelection } from "./SelectionContext";
import { FUNNEL_CONTACT } from "@/lib/funnel";

/**
 * Barra flutuante: aparece quando há serviços marcados e leva à etapa de CONTATO
 * já com as escolhas (via ?interesse=ids). Nunca para criação de conta — pedir
 * senha e CNPJ antes da primeira conversa é o atrito que matava este funil.
 */
export function SelectionBar() {
  const sel = useSelection();
  if (!sel || sel.selected.length === 0) return null;

  const n = sel.selected.length;
  const href = `${FUNNEL_CONTACT}?interesse=${encodeURIComponent(sel.selected.join(","))}`;

  return (
    <div className="fixed bottom-safe-raised sm:bottom-safe left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 font-sans">
      <div className="surface-glass-strong rounded-2xl [box-shadow:var(--elev-2)] flex items-center gap-3 sm:gap-4 p-3 pl-5">
        <p className="text-sm text-text-1">
          <span className="font-medium">{n}</span> {n === 1 ? "solução" : "soluções"} de interesse
        </p>
        <button
          type="button"
          onClick={sel.clear}
          aria-label="Limpar seleção"
          className="text-text-3 hover:text-text-1 transition-colors w-11 h-11 inline-flex items-center justify-center rounded-lg"
        >
          <X className="w-4 h-4" aria-hidden />
        </button>
        <Link
          href={href}
          className="inline-flex items-center gap-2 bg-brand text-paper rounded-xl px-5 min-h-[44px] text-sm font-medium [box-shadow:var(--glow-brand)] hover:[box-shadow:var(--glow-brand-strong)] transition-all"
        >
          Continuar
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
