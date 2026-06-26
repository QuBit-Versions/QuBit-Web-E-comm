import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Inbox, ShieldCheck } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { Wordmark } from "@/components/brand/Wordmark";

export const metadata: Metadata = {
  title: "Painel — QuBit",
  robots: { index: false },
};

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, nome_empresa, responsavel")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";
  const nome = profile?.nome_empresa || profile?.responsavel || "parceiro";

  return (
    <main id="main-content" className="min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-[1320px] mx-auto">
        <header className="flex items-center justify-between mb-12">
          <Link href="/" aria-label="QuBit — início">
            <Wordmark className="h-7 w-auto text-paper" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-sans text-mono-label text-text-3 hidden sm:inline">
              {isAdmin ? "admin" : "empresa parceira"}
            </span>
            <LogoutButton />
          </div>
        </header>

        <h1 className="text-h1 text-text-1 mb-2">Olá, {nome}.</h1>
        <p className="text-body-lg text-text-2 mb-12">
          {isAdmin
            ? "Aqui você vai acompanhar as demandas de todas as empresas parceiras."
            : "Aqui você vai enviar e acompanhar suas demandas com a QuBit."}
        </p>

        <div className="surface-glass glow-aurora rounded-2xl p-8 md:p-12 max-w-2xl">
          <div className="w-12 h-12 rounded-xl bg-brand/15 border border-brand/30 flex items-center justify-center mb-5">
            {isAdmin ? (
              <ShieldCheck className="w-6 h-6 text-brand-text" aria-hidden />
            ) : (
              <Inbox className="w-6 h-6 text-brand-text" aria-hidden />
            )}
          </div>
          <h2 className="text-h3 text-text-1 mb-2">
            {isAdmin ? "Demandas das empresas" : "Suas demandas"}
          </h2>
          <p className="text-text-2">
            Em breve aqui — estamos montando esta área. {isAdmin ? "Você verá tudo em um só lugar." : "Você poderá abrir uma demanda e acompanhar o status."}
          </p>
        </div>
      </div>
    </main>
  );
}
