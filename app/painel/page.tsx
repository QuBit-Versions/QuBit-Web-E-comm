import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, MapPin, Phone, Mail, ShieldCheck } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabaseServer";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { LogoUpload } from "@/components/painel/LogoUpload";
import { NovaDemandaForm } from "@/components/painel/NovaDemandaForm";
import { Wordmark } from "@/components/brand/Wordmark";
import { areas } from "@/lib/auth-validation";

export const metadata: Metadata = { title: "Painel — QuBit", robots: { index: false } };

const STATUS: Record<string, { label: string; cls: string }> = {
  nova: { label: "Nova", cls: "bg-brand/15 text-brand-text border-brand/30" },
  em_analise: { label: "Em análise", cls: "bg-warning/15 text-warning border-warning/30" },
  em_andamento: { label: "Em andamento", cls: "bg-info/15 text-brand-text border-brand/30" },
  concluida: { label: "Concluída", cls: "bg-success/15 text-success-strong border-success/30" },
};

const areaLabel = (v?: string | null) => areas.find((a) => a.value === v)?.label ?? v ?? "—";
const fmt = (d: string) => new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.nova;
  return <span className={`font-sans text-xs border rounded-full px-2.5 py-0.5 ${s.cls}`}>{s.label}</span>;
}

type Demanda = {
  id: string;
  created_at: string;
  titulo: string;
  descricao: string | null;
  status: string;
  profiles?: { nome_fantasia: string | null; area: string | null; regiao: string | null } | null;
};

export default async function PainelPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  const { data: demandas } = isAdmin
    ? await supabase
        .from("demandas")
        .select("*, profiles(nome_fantasia, area, regiao)")
        .order("created_at", { ascending: false })
    : await supabase.from("demandas").select("*").eq("empresa_id", user.id).order("created_at", { ascending: false });

  const lista = (demandas ?? []) as Demanda[];

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

        {isAdmin ? (
          /* ── Admin: todas as demandas ── */
          <>
            <h1 className="text-h1 text-text-1 mb-2 flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-brand-text" aria-hidden /> Demandas das empresas
            </h1>
            <p className="text-body-lg text-text-2 mb-10">
              {lista.length} {lista.length === 1 ? "demanda" : "demandas"} no total.
            </p>

            <div className="grid gap-4">
              {lista.map((d) => (
                <div key={d.id} className="surface-glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-text-1 font-medium">{d.titulo}</h3>
                      <StatusBadge status={d.status} />
                    </div>
                    {d.descricao && <p className="text-text-2 text-sm mb-2">{d.descricao}</p>}
                    <p className="font-sans text-xs text-text-3">
                      {d.profiles?.nome_fantasia ?? "—"} · {areaLabel(d.profiles?.area)} · {d.profiles?.regiao ?? "—"}
                    </p>
                  </div>
                  <span className="font-sans text-xs text-text-3 shrink-0">{fmt(d.created_at)}</span>
                </div>
              ))}
              {lista.length === 0 && <p className="text-text-3">Nenhuma demanda ainda.</p>}
            </div>
          </>
        ) : (
          /* ── Empresa: perfil + nova demanda + suas demandas ── */
          <>
            <h1 className="text-h1 text-text-1 mb-8">Olá, {profile?.nome_fantasia || "parceiro"}.</h1>

            {/* Perfil */}
            <div className="surface-glass glow-aurora rounded-2xl p-6 md:p-8 mb-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <p className="flex items-center gap-2 text-text-2"><Briefcase className="w-4 h-4 text-text-3" aria-hidden /> {areaLabel(profile?.area)}</p>
                <p className="flex items-center gap-2 text-text-2"><MapPin className="w-4 h-4 text-text-3" aria-hidden /> {profile?.regiao ?? "—"}</p>
                <p className="flex items-center gap-2 text-text-2"><Phone className="w-4 h-4 text-text-3" aria-hidden /> {profile?.telefone ?? "—"}</p>
                <p className="flex items-center gap-2 text-text-2"><Mail className="w-4 h-4 text-text-3" aria-hidden /> {profile?.email ?? "—"}</p>
              </div>
              <LogoUpload userId={user.id} logoUrl={profile?.logo_url} />
            </div>

            {/* Nova demanda */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 text-text-1">Suas demandas</h2>
              <NovaDemandaForm userId={user.id} />
            </div>

            <div className="grid gap-4">
              {lista.map((d) => (
                <div key={d.id} className="surface-glass rounded-2xl p-6 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-text-1 font-medium">{d.titulo}</h3>
                      <StatusBadge status={d.status} />
                    </div>
                    {d.descricao && <p className="text-text-2 text-sm">{d.descricao}</p>}
                  </div>
                  <span className="font-sans text-xs text-text-3 shrink-0">{fmt(d.created_at)}</span>
                </div>
              ))}
              {lista.length === 0 && (
                <div className="surface-glass rounded-2xl p-8 text-center">
                  <p className="text-text-2">Você ainda não enviou nenhuma demanda.</p>
                  <p className="text-text-3 text-sm mt-1">Clique em “Nova demanda” para começar.</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
