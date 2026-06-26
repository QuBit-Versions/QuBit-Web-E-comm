import { Check, Minus } from "lucide-react";
import { transparency } from "@/content/services";

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

/**
 * Honestidade como gatilho de confiança: "o que prometemos / o que não
 * prometemos" trazido para a home (desarma o medo do "vendedor de milagre").
 */
export function Transparency() {
  return (
    <section id="transparencia" className="section-y px-6">
      <div className="max-w-4xl mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={st(0)}>Sem promessa vazia</p>
        <h2 className="b-item text-h1 text-text-1 mb-4 max-w-2xl" style={st(1)}>{transparency.title}</h2>
        <p className="b-item text-body-lg text-text-2 mb-12 max-w-2xl" style={st(2)}>{transparency.intro}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="b-spread surface-glass rounded-2xl p-7" style={st(3, -1)}>
            <p className="text-mono-label text-success-strong mb-4">prometemos</p>
            <ul className="space-y-3">
              {transparency.promise.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-text-2">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-success-strong" aria-hidden strokeWidth={2} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="b-spread surface-glass rounded-2xl p-7" style={st(4, 1)}>
            <p className="text-mono-label text-text-3 mb-4">não prometemos</p>
            <ul className="space-y-3">
              {transparency.notPromise.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-text-3">
                  <Minus className="w-4 h-4 shrink-0 mt-0.5" aria-hidden strokeWidth={2} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
