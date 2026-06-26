import Link from "next/link";
import { Check } from "lucide-react";
import { funnelSteps, type FunnelStepId } from "@/lib/funnel";

/**
 * Indicador de etapa do funil (1—2—3), fixo no topo abaixo do header.
 * Etapas concluídas e a atual são links (permitem voltar); futuras ficam inertes.
 */
export function Stepper({ current }: { current: FunnelStepId }) {
  const currentIndex = funnelSteps.findIndex((s) => s.id === current);

  return (
    <div className="fixed top-16 inset-x-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        aria-label="Etapas da contratação"
        className="font-sans pointer-events-auto mt-3 surface-glass-strong rounded-2xl [box-shadow:var(--elev-1)] px-4 sm:px-5 py-2.5"
      >
        <ol className="flex items-center gap-2 sm:gap-3 text-sm">
          {funnelSteps.map((step, i) => {
            const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
            const circle =
              state === "current"
                ? "bg-brand text-paper [box-shadow:var(--glow-brand)]"
                : state === "done"
                  ? "bg-brand/15 border border-brand/50 text-brand-text"
                  : "border border-line text-text-3";
            const label =
              state === "current"
                ? "text-text-1 font-medium"
                : state === "done"
                  ? "text-text-2"
                  : "text-text-3";

            const body = (
              <span className="flex items-center gap-2">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${circle}`}>
                  {state === "done" ? <Check className="w-3.5 h-3.5" aria-hidden strokeWidth={2.5} /> : i + 1}
                </span>
                <span className={`hidden sm:inline ${label}`}>{step.label}</span>
              </span>
            );

            return (
              <li key={step.id} className="flex items-center gap-2 sm:gap-3">
                {state === "upcoming" ? (
                  body
                ) : (
                  <Link
                    href={step.path}
                    aria-label={`Etapa ${i + 1}: ${step.label}`}
                    aria-current={state === "current" ? "step" : undefined}
                    className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text"
                  >
                    {body}
                  </Link>
                )}
                {i < funnelSteps.length - 1 && (
                  <span
                    aria-hidden
                    className={`w-5 sm:w-8 h-px ${i < currentIndex ? "bg-brand/50" : "bg-line"}`}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
