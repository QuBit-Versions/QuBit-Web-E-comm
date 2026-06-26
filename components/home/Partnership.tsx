import { partnership } from "@/content/copy";

export function Partnership() {
  return (
    <section id="parceria" className="section-y px-6">
      <div className="max-w-3xl mx-auto surface-glass glow-aurora rounded-2xl p-8 md:p-12">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{partnership.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-6" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{partnership.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-8" style={{ ["--i" as string]: 2 } as React.CSSProperties}>{partnership.body}</p>
        <ul className="space-y-3" aria-label="Diferenciais da parceria">
          {partnership.bullets.map((b, i) => (
            <li
              key={b}
              style={{ ["--i" as string]: i + 3 } as React.CSSProperties}
              className="b-item flex items-center gap-3 text-text-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-text shrink-0" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
