import { Quote } from "lucide-react";
import Link from "next/link";
import { depoimentos } from "@/content/copy";

const st = (i: number, dir = 0) => ({ ["--i" as string]: i, ["--dir" as string]: dir } as React.CSSProperties);

/**
 * Depoimentos — sem cases reais ainda. Estado "em breve" HONESTO: cards-fantasma
 * (skeleton) que mostram o layout futuro sem inventar citações. Coerente com a
 * transparência da marca; trocamos pelos reais quando o cliente fornecer.
 */
export function Depoimentos() {
  return (
    <section id="depoimentos" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={st(0)}>{depoimentos.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-4 max-w-2xl" style={st(1)}>{depoimentos.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-12 max-w-xl" style={st(2)}>{depoimentos.empty}</p>

        <div className="grid md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={st(i + 3, i < 1 ? -1 : i > 1 ? 1 : 0)}
              className="b-spread surface-glass rounded-2xl p-7 flex flex-col gap-5"
            >
              <div className="flex items-center justify-between">
                <Quote className="w-7 h-7 text-brand-text/50" aria-hidden />
                <span className="font-sans text-[10px] text-text-3 border border-line rounded-full px-2 py-0.5">em breve</span>
              </div>
              {/* linhas-fantasma (não há citação real — não inventamos) */}
              <div className="space-y-2.5" aria-hidden>
                <div className="h-3 rounded-full bg-line w-full" />
                <div className="h-3 rounded-full bg-line w-11/12" />
                <div className="h-3 rounded-full bg-line w-3/4" />
              </div>
              <div className="mt-auto flex items-center gap-3 pt-2" aria-hidden>
                <div className="w-9 h-9 rounded-full bg-line shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-2.5 w-24 rounded-full bg-line" />
                  <div className="h-2 w-16 rounded-full bg-line/60" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="b-item mt-10 text-text-3 text-sm" style={st(6)}>
          {depoimentos.cta}{" "}
          <Link href="/diagnostico" className="text-brand-text hover:underline">
            Começar agora →
          </Link>
        </p>
      </div>
    </section>
  );
}
