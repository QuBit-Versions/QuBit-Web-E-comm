"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Plus, X, Loader2 } from "lucide-react";

export type EntregaItem = {
  id: string;
  titulo: string;
  status: "planejada" | "em_andamento" | "entregue";
  entregue_em: string | Date | null;
};

const STATUS_OPTIONS = [
  { value: "planejada", label: "Planejada" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "entregue", label: "Entregue" },
] as const;

const RING: Record<string, string> = {
  planejada: "border-line text-text-2",
  em_andamento: "border-warning/30 text-warning",
  entregue: "border-success/30 text-success-strong",
};

const selectBase =
  "font-sans text-xs rounded-full border bg-[var(--glass-bg)] backdrop-blur-md pl-2.5 pr-6 py-0.5 min-h-8 cursor-pointer appearance-none transition-all duration-fast focus:outline-none focus:border-brand-text disabled:opacity-60";

/**
 * Gestor de entregas do ADMIN dentro do card da empresa: cadastrar o que já
 * foi entregue e o que vai ser entregue, e mover o status — a empresa vê o
 * acompanhamento no painel dela na hora.
 */
export function EntregasAdmin({ empresaId, entregas }: { empresaId: string; entregas: EntregaItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(entregas.length > 0);
  const [titulo, setTitulo] = useState("");
  const [statusNovo, setStatusNovo] = useState<"planejada" | "entregue">("planejada");
  const [busy, setBusy] = useState<string | null>(null);

  const adicionar = async () => {
    if (titulo.trim().length < 3) return;
    setBusy("add");
    try {
      await fetch("/api/painel/entregas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ empresa_id: empresaId, titulo: titulo.trim(), status: statusNovo }),
      });
      setTitulo("");
    } catch {}
    setBusy(null);
    router.refresh();
  };

  const mudarStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await fetch(`/api/painel/entregas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    } catch {}
    setBusy(null);
    router.refresh();
  };

  const remover = async (id: string) => {
    setBusy(id);
    try {
      await fetch(`/api/painel/entregas/${id}`, { method: "DELETE" });
    } catch {}
    setBusy(null);
    router.refresh();
  };

  const entreguesCount = entregas.filter((e) => e.status === "entregue").length;

  return (
    <div className="pt-4 mt-4 border-t border-line">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="font-sans w-full min-h-9 flex items-center gap-2 text-sm text-text-2 hover:text-text-1 transition-colors"
      >
        <Package className="w-4 h-4 text-brand-text" aria-hidden />
        Entregas do projeto
        <span className="text-xs text-text-3">
          {entregas.length === 0 ? "nenhuma" : `${entreguesCount}/${entregas.length} entregues`}
        </span>
        <span className="ml-auto text-text-3" aria-hidden>{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-2">
          {entregas.map((e) => (
            <div key={e.id} className="flex items-center gap-2">
              <span className="relative inline-flex items-center shrink-0">
                <select
                  aria-label={`Status da entrega ${e.titulo}`}
                  value={e.status}
                  disabled={busy === e.id}
                  onChange={(ev) => mudarStatus(e.id, ev.target.value)}
                  className={`${selectBase} ${RING[e.status] ?? RING.planejada}`}
                >
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value} className="bg-surface-2 text-text-1">
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2 text-current/70 text-[10px]" aria-hidden>▾</span>
              </span>
              <span className="text-sm text-text-1 truncate flex-1" title={e.titulo}>{e.titulo}</span>
              {busy === e.id && <Loader2 className="w-3.5 h-3.5 text-text-3 animate-spin shrink-0" aria-hidden />}
              <button
                type="button"
                aria-label={`Remover entrega ${e.titulo}`}
                onClick={() => remover(e.id)}
                className="min-w-8 min-h-8 flex items-center justify-center rounded-full text-text-3 hover:text-danger transition-colors shrink-0"
              >
                <X className="w-3.5 h-3.5" aria-hidden />
              </button>
            </div>
          ))}
          {entregas.length === 0 && <p className="text-xs text-text-3">Cadastre o que já foi ou vai ser entregue.</p>}

          {/* adicionar */}
          <div className="flex items-center gap-2 pt-1">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && adicionar()}
              placeholder="Nova entrega — ex.: Integração de pagamento"
              aria-label="Título da nova entrega"
              className="font-sans flex-1 min-w-0 bg-[var(--glass-bg)] border border-line rounded-xl px-3 py-1.5 min-h-9 text-sm text-text-1 focus:outline-none focus:border-brand-text"
            />
            <span className="relative inline-flex items-center shrink-0">
              <select
                aria-label="Status inicial da nova entrega"
                value={statusNovo}
                onChange={(e) => setStatusNovo(e.target.value as "planejada" | "entregue")}
                className={`${selectBase} ${RING[statusNovo]}`}
              >
                <option value="planejada" className="bg-surface-2 text-text-1">Planejada</option>
                <option value="entregue" className="bg-surface-2 text-text-1">Já entregue</option>
              </select>
              <span className="pointer-events-none absolute right-2 text-current/70 text-[10px]" aria-hidden>▾</span>
            </span>
            <button
              type="button"
              onClick={adicionar}
              disabled={busy === "add" || titulo.trim().length < 3}
              aria-label="Adicionar entrega"
              className="min-w-9 min-h-9 flex items-center justify-center rounded-xl border border-line text-brand-text hover:border-brand-text transition-colors disabled:opacity-50 shrink-0"
            >
              {busy === "add" ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden /> : <Plus className="w-4 h-4" aria-hidden />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
