import type { Metadata } from "next";
import Link from "next/link";
import { CadastroForm } from "@/components/auth/CadastroForm";
import { Wordmark } from "@/components/brand/Wordmark";
import { site } from "@/content/copy";

export const metadata: Metadata = {
  title: `Cadastro de parceiro — ${site.name}`,
  description: "Crie a conta da sua empresa no portal de parceiros da QuBit.",
  robots: { index: false },
};

export default function CadastroPage() {
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

        <div className="surface-glass glow-aurora rounded-2xl p-8 md:p-10">
          <CadastroForm />
        </div>
      </div>
    </main>
  );
}
