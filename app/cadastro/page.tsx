import type { Metadata } from "next";
import Link from "next/link";
import { CadastroForm } from "@/components/auth/CadastroForm";
import { Wordmark } from "@/components/brand/Wordmark";
import { site } from "@/content/copy";
import { services } from "@/content/services";

export const metadata: Metadata = {
  title: `Cadastro de parceiro — ${site.name}`,
  description: "Crie a conta da sua empresa no portal de parceiros da QuBit.",
  robots: { index: false },
};

export default async function CadastroPage({
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
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <Link href="/" aria-label="QuBit — início" className="inline-block">
            <Wordmark className="h-8 w-auto text-paper mx-auto" />
          </Link>
          <p className="font-sans text-mono-label text-brand-text mt-6 mb-2">Portal de parceiros</p>
          <h1 className="text-h2 text-text-1 mb-2">Crie a conta da sua empresa</h1>
          <p className="text-text-2">Para enviar e acompanhar suas demandas com a QuBit.</p>
        </div>

        {interesses.length > 0 && (
          <div className="surface-glass rounded-2xl p-5 mb-6">
            <p className="font-sans text-mono-label text-text-3 mb-3">
              {interesses.length} {interesses.length === 1 ? "solução escolhida" : "soluções escolhidas"} — vão junto com sua conta
            </p>
            <ul className="flex flex-wrap gap-2">
              {interesses.map((i) => (
                <li
                  key={i.id}
                  className="font-sans text-xs border border-brand/30 text-brand-text rounded-full px-3 py-1"
                >
                  {i.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="surface-glass glow-aurora rounded-2xl p-8 md:p-10">
          <CadastroForm interesseIds={interesses.map((i) => i.id)} />
        </div>
      </div>
    </main>
  );
}
