import { howItWorks } from "@/content/copy";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{howItWorks.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-16 max-w-2xl" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{howItWorks.h2}</h2>
        <div className="grid md:grid-cols-4 gap-6">
          {howItWorks.steps.map((s, i) => (
            <div
              key={s.number}
              style={{ ["--i" as string]: i + 2, ["--dir" as string]: i < (howItWorks.steps.length - 1) / 2 ? -1 : i > (howItWorks.steps.length - 1) / 2 ? 1 : 0 } as React.CSSProperties}
              className="b-spread surface-glass rounded-2xl p-7 transition-shadow duration-300 hover:[box-shadow:var(--glow-aurora-inset)]"
            >
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand/15 text-brand-text font-mono text-sm mb-4 [box-shadow:var(--glow-brand)]">
                {s.number}
              </span>
              <h3 className="text-h3 text-text-1 mb-3">{s.title}</h3>
              <p className="text-text-2 text-sm">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
