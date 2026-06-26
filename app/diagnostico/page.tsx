import type { Metadata } from "next";
import { DiagnosticoForm } from "@/components/home/DiagnosticoForm";
import { diagnostico_page, site } from "@/content/copy";
import { ButtonLink } from "@/components/ui/Button";
import { Stepper } from "@/components/funnel/Stepper";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: `Diagnóstico gratuito — ${site.name}`,
  description: diagnostico_page.sub,
  robots: { index: false },
};

export default async function DiagnosticoPage({
  searchParams,
}: {
  searchParams: Promise<{ interesse?: string }>;
}) {
  const { interesse } = await searchParams;
  // ids vindos de /servicos → nomes legíveis (ignora ids inexistentes)
  const interesses = (interesse ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .map((id) => services.find((s) => s.id === id))
    .filter((s): s is (typeof services)[number] => Boolean(s))
    .map((s) => ({ id: s.id, name: s.name }));

  return (
    <main id="main-content" className="min-h-screen pt-32 pb-24 px-6">
      <Stepper current="registro" />
      <div className="max-w-2xl mx-auto">
        <p className="text-mono-label text-brand-text mb-4">{diagnostico_page.eyebrow}</p>
        <h1 className="text-h1 text-text-1 mb-4">{diagnostico_page.h1}</h1>
        <p className="text-body-lg text-text-2 mb-12">{diagnostico_page.sub}</p>
        <DiagnosticoForm interesses={interesses} />
        <p className="text-xs text-text-3 mt-8 text-center">
          Seus dados são usados apenas para entrar em contato.{" "}
          <ButtonLink href="/privacidade" variant="ghost" size="sm" className="text-xs text-brand-text p-0 h-auto">
            Política de privacidade
          </ButtonLink>
        </p>
      </div>
    </main>
  );
}
