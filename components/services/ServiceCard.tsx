"use client";

import { useState } from "react";
import { Check, Minus, ChevronDown, Plus } from "lucide-react";
import type { Service } from "@/content/services";
import { useSelection } from "./SelectionContext";

/**
 * Card de serviço em DOIS NÍVEIS (revelação progressiva).
 *
 * Nível 1 — bater o olho. O cliente não é técnico e não compra "entregáveis":
 * compra a saída de um incômodo. Então a vitrine é o PORQUÊ, não a ficha técnica —
 * o desgaste de hoje, o resultado depois, e o preço. Nada de jargão aqui.
 *
 * Nível 2 — clicou em "Ver detalhes". Aí sim a ficha: para quem é, o que muda o
 * valor, o que inclui e o que NÃO inclui, faixas, pré-requisitos e notas.
 *
 * Por que assim: 11 serviços × 8 blocos de informação no estado fechado era mais
 * texto do que qualquer pessoa lê para escolher. Densidade é o inimigo da escolha.
 */
export function ServiceCard({
  service: s,
  defaultOpen = false,
  selectable = false,
}: {
  service: Service;
  defaultOpen?: boolean;
  selectable?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const sel = useSelection();
  const canSelect = selectable && !!sel;
  const selected = canSelect ? sel!.isSelected(s.id) : false;

  return (
    <div
      className={`surface-glass rounded-2xl p-7 flex flex-col transition-shadow duration-300 ${
        selected
          ? "ring-2 ring-brand [box-shadow:var(--glow-brand-strong)]"
          : s.recommended
            ? "ring-1 ring-brand/40 [box-shadow:var(--glow-brand)]"
            : "hover:[box-shadow:var(--glow-aurora-inset)]"
      }`}
    >
      {s.recommended && <span className="text-mono-label text-brand-text mb-3">recomendado</span>}

      {/* ── Nível 1 — o porquê. Hoje dói assim; depois fica assim; custa isto. ── */}
      <h3 className="text-h3 text-text-1 mb-4">{s.name}</h3>

      <p className="text-sm text-text-3 mb-3">
        <span className="font-sans text-mono-label text-text-3 block mb-1">hoje</span>
        {s.pain}
      </p>
      <p className="text-sm text-text-1 mb-5 border-l-2 border-brand/50 pl-3">
        <span className="font-sans text-mono-label text-brand-text block mb-1">depois</span>
        {s.outcome}
      </p>

      <p className="font-sans text-2xl font-medium text-text-1 mb-5">{s.price}</p>

      <div className="mt-auto pt-2">
        {canSelect && (
          <button
            type="button"
            onClick={() => sel!.toggle(s.id)}
            aria-pressed={selected}
            className={`font-sans w-full min-h-[44px] mb-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all duration-fast ${
              selected
                ? "bg-brand text-paper [box-shadow:var(--glow-brand)]"
                : "border border-line text-text-1 hover:border-brand-text"
            }`}
          >
            {selected ? (
              <>
                <Check className="w-4 h-4" aria-hidden strokeWidth={2.5} /> Selecionado
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" aria-hidden strokeWidth={2.5} /> Tenho interesse
              </>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="font-sans inline-flex items-center gap-1.5 text-sm text-brand-text hover:underline min-h-[44px]"
        >
          {open ? "Ocultar detalhes" : "Ver detalhes"}
          <ChevronDown className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </div>

      {open && (
        <div className="mt-2 pt-5 border-t border-line space-y-6 text-sm">
          {/* Ficha técnica. O porquê já foi dado na vitrine — aqui não se repete. */}
          <Section title="Para quem é">
            <p className="text-text-2">{s.forWho}</p>
          </Section>

          {s.priceDriver && (
            <Section title="O que muda o valor">
              <p className="text-text-2">{s.priceDriver}</p>
            </Section>
          )}

          {s.tiers && s.tiers.length > 0 && (
            <Section title="Faixas de escopo">
              <ul className="space-y-1.5">
                {s.tiers.map((t) => (
                  <li key={t.label} className="flex justify-between gap-4">
                    <span className="text-text-2">{t.label}</span>
                    {(t.price ?? t.note) && (
                      <span className="font-sans text-text-1 shrink-0">{t.price ?? t.note}</span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {s.includes.length > 0 && (
            <Section title="Inclui">
              <ul className="space-y-1.5">
                {s.includes.map((item) => (
                  <li key={item} className="flex gap-2 text-text-2">
                    <Check className="w-4 h-4 shrink-0 mt-0.5 text-brand-text" aria-hidden strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {s.excludes && (
            <Section title="Não inclui">
              <ul className="space-y-1.5">
                {s.excludes.map((item) => (
                  <li key={item} className="flex gap-2 text-text-3">
                    <Minus className="w-4 h-4 shrink-0 mt-0.5" aria-hidden strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {s.prerequisites && (
            <Section title="Pré-requisitos do cliente">
              <ul className="list-disc pl-5 space-y-1 text-text-2 marker:text-brand-text/60">
                {s.prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}

          {s.notes && (
            <Section title="Observações">
              <ul className="space-y-1.5 text-text-3">
                {s.notes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-mono-label text-text-3 mb-2">{title}</p>
      {children}
    </div>
  );
}
