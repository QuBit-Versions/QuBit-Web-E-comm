import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Wordmark } from "@/components/brand/Wordmark";
import { site } from "@/content/copy";

export const metadata: Metadata = {
  title: `Entrar — ${site.name}`,
  description: "Acesse o portal de parceiros da QuBit.",
  robots: { index: false },
};

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string }>;
}) {
  const sp = await searchParams;
  const proximo = sp.proximo ?? "/painel";

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center px-6 py-32">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" aria-label="QuBit — início" className="inline-block">
            <Wordmark className="h-8 w-auto text-paper mx-auto" />
          </Link>
          <p className="font-sans text-mono-label text-brand-text mt-6 mb-2">Portal de parceiros</p>
          <h1 className="text-h2 text-text-1">Entrar</h1>
        </div>

        <div className="surface-glass glow-aurora rounded-2xl p-8 md:p-10">
          <LoginForm proximo={proximo} />
        </div>

        {/* Única porta para /cadastro: ele saiu do header por não ser CTA de venda. */}
        <p className="font-sans text-sm text-text-3 text-center mt-6">
          Ainda não tem acesso?{" "}
          <Link href="/cadastro" className="text-brand-text hover:underline">
            Criar conta da empresa
          </Link>
        </p>
      </div>
    </main>
  );
}
