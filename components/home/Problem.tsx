import { problem } from "@/content/copy";

export function Problem() {
  return (
    <section id="problema" className="section-y px-6">
      <div className="max-w-[1320px] mx-auto">
        <p className="b-item text-mono-label text-brand-text mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{problem.eyebrow}</p>
        <h2 className="b-item text-h1 text-text-1 mb-6 max-w-2xl" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{problem.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-16 max-w-2xl" style={{ ["--i" as string]: 2 } as React.CSSProperties}>{problem.body}</p>
        <div className="grid md:grid-cols-3 gap-6">
          {problem.pains.map((p, i) => {
            const c = (problem.pains.length - 1) / 2;
            const dir = i < c ? -1 : i > c ? 1 : 0;
            return (
            <div
              key={p.id}
              style={{ ["--i" as string]: i + 3, ["--dir" as string]: dir } as React.CSSProperties}
              className="b-spread surface-glass rounded-2xl p-7 transition-shadow duration-300 hover:[box-shadow:var(--glow-aurora-inset)]"
            >
              <h3 className="text-h3 text-text-1 mb-3">{p.title}</h3>
              <p className="text-text-2">{p.description}</p>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
