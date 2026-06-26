type LegalContent = {
  title: string;
  updatedAt: string;
  placeholder?: boolean;
  intro: string;
  sections: { heading: string; body: string }[];
};

export function LegalPage({ content }: { content: LegalContent }) {
  return (
    <main id="main-content" className="min-h-screen pt-32 pb-24 px-6">
      <article className="max-w-2xl mx-auto surface-glass rounded-2xl p-8 md:p-12">
        <h1 className="text-h1 text-text-1 mb-2">{content.title}</h1>
        <p className="text-sm text-text-3 mb-10">{content.updatedAt}</p>

        {content.placeholder && (
          <div role="note" className="mb-10 p-4 rounded-xl border border-brand/30 bg-brand/5 [box-shadow:var(--glow-brand)]">
            <p className="text-sm text-text-2">
              <span className="text-brand-text font-medium">Conteúdo provisório.</span>{" "}
              Este texto é um rascunho e será substituído pela versão jurídica definitiva.
            </p>
          </div>
        )}

        <p className="text-body-lg text-text-2 mb-12">{content.intro}</p>

        <div className="space-y-10">
          {content.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-h3 text-text-1 mb-3">{s.heading}</h2>
              <p className="text-text-2">{s.body}</p>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
