import { solution } from "@/content/copy";

export function Solution() {
  return (
    <section id="solucao" className="section-y px-6">
      <div className="max-w-3xl mx-auto surface-glass glow-aurora rounded-2xl p-8 md:p-12">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{solution.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-6" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{solution.h2}</h2>
        <p className="b-item text-body-lg text-text-2" style={{ ["--i" as string]: 2 } as React.CSSProperties}>{solution.body}</p>
      </div>
    </section>
  );
}
