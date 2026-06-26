import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Stepper } from "@/components/funnel/Stepper";
import { obrigado_page, site } from "@/content/copy";

export const metadata: Metadata = {
  title: `Pedido recebido — ${site.name}`,
  robots: { index: false },
};

const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

export default function ObrigadoPage() {
  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6">
      <Stepper current="pronto" />
      <div className="max-w-lg text-center surface-glass glow-aurora rounded-2xl p-10 md:p-12">
        <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mx-auto mb-8 [box-shadow:var(--glow-brand)]" aria-hidden>
          <svg className="w-8 h-8 text-brand-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-h1 text-text-1 mb-4">{obrigado_page.h1}</h1>
        <p className="text-body-lg text-text-2 mb-8">{obrigado_page.sub}</p>

        {/* Próximos passos — mata a ansiedade pós-envio (define o que vem) */}
        <div className="text-left max-w-sm mx-auto mb-10 surface-glass rounded-2xl p-5">
          <p className="text-mono-label text-text-3 mb-4">{obrigado_page.nextStepsTitle}</p>
          <ol className="space-y-3">
            {obrigado_page.nextSteps.map((step, i) => (
              <li key={i} className="flex gap-3 items-start text-sm text-text-2">
                <span className="font-sans shrink-0 w-6 h-6 rounded-full bg-brand/15 border border-brand/40 text-brand-text text-xs flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
          >
            {obrigado_page.cta}
          </ButtonLink>
          <ButtonLink href="/" variant="secondary" size="lg">
            Voltar para o início
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
