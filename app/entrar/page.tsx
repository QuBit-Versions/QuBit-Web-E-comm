import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
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
  searchParams: Promise<{ proximo?: string; confirmado?: string; erro?: string }>;
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

        {sp.confirmado && (
          <div className="flex items-center gap-2 p-4 mb-5 rounded-xl border border-success/30 bg-success/5 text-sm text-text-2">
            <CheckCircle2 className="w-5 h-5 text-success-strong shrink-0" aria-hidden />
            E-mail confirmado! Agora é só entrar.
          </div>
        )}
        {sp.erro && (
          <div className="flex items-center gap-2 p-4 mb-5 rounded-xl border border-danger/30 bg-danger/5 text-sm text-text-2">
            <AlertCircle className="w-5 h-5 text-danger shrink-0" aria-hidden />
            Não conseguimos confirmar o link. Tente entrar ou refaça o cadastro.
          </div>
        )}

        <div className="surface-glass glow-aurora rounded-2xl p-8 md:p-10">
          <LoginForm proximo={proximo} />
        </div>
      </div>
    </main>
  );
}
