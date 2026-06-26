"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

// Mesmas chaves/rótulos do painel — fonte única do ciclo de vida da demanda.
export const STATUS_OPTIONS = [
  { value: "nova", label: "Nova" },
  { value: "em_analise", label: "Em análise" },
  { value: "em_andamento", label: "Em andamento" },
  { value: "concluida", label: "Concluída" },
] as const;

// Borda/realce por status (sem cor sozinha — o rótulo no <select> sempre acompanha).
const RING: Record<string, string> = {
  nova: "border-brand/30 text-brand-text",
  em_analise: "border-warning/30 text-warning",
  em_andamento: "border-brand/30 text-brand-text",
  concluida: "border-success/30 text-success-strong",
};

const selectBase =
  "font-sans text-xs rounded-full border bg-[var(--glass-bg)] backdrop-blur-md pl-3 pr-7 py-1 min-h-9 cursor-pointer appearance-none transition-all duration-fast focus:outline-none focus:border-brand-text focus:[box-shadow:var(--glow-brand)] disabled:opacity-60";

export function StatusSelect({ demandaId, status }: { demandaId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(false);

  const onChange = async (next: string) => {
    const previous = value;
    setValue(next);
    setSaving(true);
    setError(false);
    setSaved(false);

    const supabase = createSupabaseBrowser();
    const { error: err } = await supabase.from("demandas").update({ status: next }).eq("id", demandaId);

    setSaving(false);
    if (err) {
      setValue(previous); // reverte o otimismo
      setError(true);
      return;
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
    router.refresh();
  };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative inline-flex items-center">
        <select
          aria-label="Alterar status da demanda"
          value={value}
          disabled={saving}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectBase} ${RING[value] ?? RING.nova}`}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface-2 text-text-1">
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 text-current/70" aria-hidden>
          ▾
        </span>
      </span>
      {saving && <Loader2 className="w-3.5 h-3.5 text-text-3 animate-spin" aria-hidden />}
      {saved && <Check className="w-3.5 h-3.5 text-success-strong" aria-label="Status salvo" />}
      {error && (
        <span role="alert" className="text-xs text-danger">
          Erro ao salvar
        </span>
      )}
    </span>
  );
}
