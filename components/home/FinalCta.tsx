import { ButtonLink } from "@/components/ui/Button";
import { cta_final, site } from "@/content/copy";

export function FinalCta() {
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

  return (
    <section id="contato" className="section-y px-6">
      <div className="max-w-3xl mx-auto text-center surface-glass glow-aurora rounded-2xl p-10 md:p-16">
        <h2 className="b-item text-h1 text-text-1 mb-4" style={{ ["--i" as string]: 0 } as React.CSSProperties}>{cta_final.h2}</h2>
        <p className="b-item text-body-lg text-text-2 mb-10" style={{ ["--i" as string]: 1 } as React.CSSProperties}>{cta_final.sub}</p>
        <div className="b-item flex flex-wrap justify-center gap-4" style={{ ["--i" as string]: 2 } as React.CSSProperties}>
          <ButtonLink href="/servicos" size="lg">
            {cta_final.ctaPrimary}
          </ButtonLink>
          <ButtonLink href={whatsappUrl} target="_blank" rel="noopener noreferrer" variant="secondary" size="lg">
            {cta_final.ctaSecondary}
          </ButtonLink>
        </div>
        <p className="b-item font-sans text-xs text-text-3 mt-5" style={{ ["--i" as string]: 3 } as React.CSSProperties}>
          {cta_final.microcopy}
        </p>
      </div>
    </section>
  );
}
