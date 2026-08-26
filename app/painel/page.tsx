import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, MapPin, Phone, Mail, ShieldCheck, Building2, ImagePlus, CheckCircle2, CircleDashed, Loader2, Package, FileText, ExternalLink } from "lucide-react";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { EntregasAdmin, type EntregaItem } from "@/components/painel/EntregasAdmin";
import { LogoUpload } from "@/components/painel/LogoUpload";
import { NovaDemandaForm } from "@/components/painel/NovaDemandaForm";
import { OrbitaControls } from "@/components/painel/OrbitaControls";
import { StatusSelect } from "@/components/painel/StatusSelect";
import { Wordmark } from "@/components/brand/Wordmark";
import { areas } from "@/lib/auth-validation";
import { services } from "@/content/services";

export const metadata: Metadata = { title: "Painel — QuBit", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; cls: string }> = {
  nova: { label: "Nova", cls: "bg-brand/15 text-brand-text border-brand/30" },
  em_analise: { label: "Em análise", cls: "bg-warning/15 text-warning border-warning/30" },
  em_andamento: { label: "Em andamento", cls: "bg-info/15 text-brand-text border-brand/30" },
  concluida: { label: "Concluída", cls: "bg-success/15 text-success-strong border-success/30" },
};

const areaLabel = (v?: string | null) => areas.find((a) => a.value === v)?.label ?? v ?? "—";
const fmt = (d: Date | string) =>
  new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? STATUS.nova;
  return <span className={`font-sans text-xs border rounded-full px-2.5 py-0.5 ${s.cls}`}>{s.label}</span>;
}

type Demanda = {
  id: string;
  created_at: Date;
  titulo: string;
  descricao: string | null;
  status: string;
  empresa_nome?: string | null;
  empresa_area?: string | null;
  empresa_regiao?: string | null;
};

type Entrega = {
  id: string;
  empresa_id: string;
  titulo: string;
  descricao: string | null;
  status: "planejada" | "em_andamento" | "entregue";
  entregue_em: Date | null;
};

type Empresa = {
  id: string;
  created_at: Date;
  nome_fantasia: string | null;
  cnpj: string | null;
  responsavel: string | null;
  area: string | null;
  regiao: string | null;
  telefone: string | null;
  email: string | null;
  logo_url: string | null;
  em_orbita: boolean;
  logo_solicitada_em: Date | null;
  site_url: string | null;
};

export default async function PainelPage() {
  const eu = await getEmpresaLogada();
  if (!eu) redirect("/entrar");
  const isAdmin = eu.role === "admin";

  // Semente: serviços escolhidos no cadastro viram a 1ª demanda no primeiro acesso.
  if (!isAdmin && (eu.interesses_pendentes?.length ?? 0) > 0) {
    const interesses = eu.interesses_pendentes as string[];
    const [{ count }] = await sql<{ count: number }[]>`
      select count(*)::int as count from demandas where empresa_id = ${eu.id}`;
    let seeded = count > 0;
    if (!seeded) {
      const nomes = interesses
        .map((id) => services.find((s) => s.id === id)?.name)
        .filter((n): n is string => Boolean(n));
      try {
        await sql`
          insert into demandas (empresa_id, titulo, descricao, interesses)
          values (${eu.id}, ${"Soluções de interesse"},
                  ${nomes.length ? `Selecionadas no cadastro: ${nomes.join(", ")}.` : null},
                  ${interesses})`;
        seeded = true;
      } catch {
        seeded = false;
      }
    }
    if (seeded) await sql`update empresas set interesses_pendentes = null where id = ${eu.id}`;
  }

  const lista = isAdmin
    ? await sql<Demanda[]>`
        select d.id, d.created_at, d.titulo, d.descricao, d.status,
               e.nome_fantasia as empresa_nome, e.area as empresa_area, e.regiao as empresa_regiao
          from demandas d
          join empresas e on e.id = d.empresa_id
         order by d.created_at desc`
    : await sql<Demanda[]>`
        select id, created_at, titulo, descricao, status
          from demandas
         where empresa_id = ${eu.id}
         order by created_at desc`;

  // Admin: todas as empresas cadastradas (mesmo as sem demanda).
  const empresas = isAdmin
    ? await sql<Empresa[]>`
        select id, created_at, nome_fantasia, cnpj, responsavel, area, regiao, telefone, email, logo_url,
               em_orbita, logo_solicitada_em, site_url
          from empresas
         where role = 'empresa'
         order by created_at desc`
    : [];

  // Entregas: admin vê/gerencia todas (agrupadas por empresa); empresa acompanha as suas.
  const entregas = isAdmin
    ? await sql<Entrega[]>`
        select id, empresa_id, titulo, descricao, status, entregue_em
          from entregas order by created_at asc`
    : await sql<Entrega[]>`
        select id, empresa_id, titulo, descricao, status, entregue_em
          from entregas where empresa_id = ${eu.id} order by created_at asc`;
  const entregasPorEmpresa = new Map<string, Entrega[]>();
  for (const ent of entregas) {
    const list = entregasPorEmpresa.get(ent.empresa_id) ?? [];
    list.push(ent);
    entregasPorEmpresa.set(ent.empresa_id, list);
  }
  const minhasEntregues = entregas.filter((e) => e.status === "entregue");
  const minhasAndamento = entregas.filter((e) => e.status === "em_andamento");
  const minhasPlanejadas = entregas.filter((e) => e.status === "planejada");

  return (
    <main id="main-content" className="min-h-dvh pt-28 pb-20 px-6">
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
          /* ── Admin: empresas cadastradas + todas as demandas ── */
          <>
            <h1 className="text-h1 text-text-1 mb-2 flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-brand-text" aria-hidden /> Painel da QuBit
            </h1>
            <p className="text-body-lg text-text-2 mb-12">
              {empresas.length} {empresas.length === 1 ? "empresa cadastrada" : "empresas cadastradas"} ·{" "}
              {lista.length} {lista.length === 1 ? "demanda" : "demandas"}.
            </p>

            {/* Empresas cadastradas */}
            <h2 className="text-h2 text-text-1 mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-brand-text" aria-hidden /> Empresas cadastradas
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 mb-16">
              {empresas.map((e) => (
                <div key={e.id} className="surface-glass rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {e.logo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.logo_url} alt="" className="w-11 h-11 rounded-lg object-contain bg-surface-2 shrink-0" />
                    ) : (
                      <span className="w-11 h-11 rounded-lg bg-surface-2 flex items-center justify-center text-text-3 shrink-0" aria-hidden>
                        <Building2 className="w-5 h-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      <h3 className="text-text-1 font-medium truncate">{e.nome_fantasia || "—"}</h3>
                      <p className="font-sans text-xs text-text-3 truncate">
                        {areaLabel(e.area)} · {e.regiao ?? "—"}
                      </p>
                    </div>
                  </div>
                  <dl className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2 text-text-2">
                      <Briefcase className="w-4 h-4 text-text-3 shrink-0" aria-hidden />
                      <span className="truncate">
                        {e.responsavel ?? "—"}
                        {e.cnpj ? ` · ${e.cnpj}` : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-text-2">
                      <Phone className="w-4 h-4 text-text-3 shrink-0" aria-hidden />
                      <span className="truncate">{e.telefone ?? "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-text-2">
                      <Mail className="w-4 h-4 text-text-3 shrink-0" aria-hidden />
                      {e.email ? (
                        <a href={`mailto:${e.email}`} className="truncate text-brand-text hover:underline">
                          {e.email}
                        </a>
                      ) : (
                        <span>—</span>
                      )}
                    </div>
                  </dl>
                  <OrbitaControls
                    empresaId={e.id}
                    emOrbita={e.em_orbita}
                    temLogo={!!e.logo_url}
                    logoSolicitada={!!e.logo_solicitada_em}
                    siteUrl={e.site_url ?? ""}
                  />
                  <EntregasAdmin
                    empresaId={e.id}
                    entregas={(entregasPorEmpresa.get(e.id) ?? []) as EntregaItem[]}
                  />
                </div>
              ))}
              {empresas.length === 0 && <p className="text-text-3">Nenhuma empresa cadastrada ainda.</p>}
            </div>

            {/* Demandas */}
            <h2 className="text-h2 text-text-1 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-brand-text" aria-hidden /> Demandas das empresas
            </h2>

            <div className="grid gap-4">
              {lista.map((d) => (
                <div key={d.id} className="surface-glass rounded-2xl p-6 flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-text-1 font-medium">{d.titulo}</h3>
                      <StatusSelect demandaId={d.id} status={d.status} />
                    </div>
                    {d.descricao && <p className="text-text-2 text-sm mb-2">{d.descricao}</p>}
                    <p className="font-sans text-xs text-text-3">
                      {d.empresa_nome ?? "—"} · {areaLabel(d.empresa_area)} · {d.empresa_regiao ?? "—"}
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
            <h1 className="text-h1 text-text-1 mb-8">Olá, {eu.nome_fantasia || "parceiro"}.</h1>

            {/* A QuBit pediu a logo — some sozinho assim que ela for enviada */}
            {eu.logo_solicitada_em && !eu.logo_url && (
              <div
                role="status"
                className="flex items-start gap-3 p-5 mb-6 rounded-2xl border border-brand/40 bg-brand/5"
              >
                <ImagePlus className="w-5 h-5 text-brand-text shrink-0 mt-0.5" aria-hidden />
                <div>
                  <p className="text-text-1 font-medium">A QuBit solicitou a logo da sua empresa.</p>
                  <p className="text-sm text-text-2 mt-0.5">
                    Envie no botão ao lado do seu perfil, logo abaixo — assim que chegar, sua marca entra na órbita do
                    site da QuBit automaticamente.
                  </p>
                </div>
              </div>
            )}

            {/* Perfil */}
            <div className="surface-glass glow-aurora rounded-2xl p-6 md:p-8 mb-10 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                <p className="flex items-center gap-2 text-text-2"><Briefcase className="w-4 h-4 text-text-3" aria-hidden /> {areaLabel(eu.area)}</p>
                <p className="flex items-center gap-2 text-text-2"><MapPin className="w-4 h-4 text-text-3" aria-hidden /> {eu.regiao ?? "—"}</p>
                <p className="flex items-center gap-2 text-text-2"><Phone className="w-4 h-4 text-text-3" aria-hidden /> {eu.telefone ?? "—"}</p>
                <p className="flex items-center gap-2 text-text-2"><Mail className="w-4 h-4 text-text-3" aria-hidden /> {eu.email ?? "—"}</p>
              </div>
              <LogoUpload logoUrl={eu.logo_url} />
            </div>

            {/* Contrato — espaço permanente; o arquivo é incluído pelo admin */}
            <section aria-label="Contrato" className="surface-glass rounded-2xl p-5 mb-10 flex items-center gap-3">
              <FileText className="w-5 h-5 text-brand-text shrink-0" aria-hidden />
              {eu.contrato_url ? (
                <>
                  <div className="min-w-0">
                    <p className="text-text-1 font-medium">Contrato de prestação de serviços</p>
                    <p className="font-sans text-xs text-text-3">Documento firmado entre sua empresa e a QuBit.</p>
                  </div>
                  <a
                    href={eu.contrato_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans ml-auto inline-flex items-center gap-1.5 text-sm text-brand-text hover:underline shrink-0 min-h-11"
                  >
                    Ver contrato <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                  </a>
                </>
              ) : (
                <div>
                  <p className="text-text-1 font-medium">Contrato</p>
                  <p className="font-sans text-xs text-text-3">Seu contrato será disponibilizado aqui.</p>
                </div>
              )}
            </section>

            {/* Acompanhamento do projeto — o que a QuBit já entregou e o que vem aí */}
            {entregas.length > 0 && (
              <section aria-label="Acompanhamento do projeto" className="mb-12">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-h2 text-text-1 flex items-center gap-2">
                    <Package className="w-6 h-6 text-brand-text" aria-hidden /> Acompanhamento do projeto
                  </h2>
                  <span className="font-sans text-sm text-text-2">
                    {minhasEntregues.length} de {entregas.length} {entregas.length === 1 ? "entrega" : "entregas"}
                  </span>
                </div>

                {/* progresso */}
                <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden mb-8" role="progressbar"
                  aria-valuenow={minhasEntregues.length} aria-valuemin={0} aria-valuemax={entregas.length}
                  aria-label="Progresso das entregas">
                  <div
                    className="h-full rounded-full bg-brand transition-all"
                    style={{ width: `${entregas.length ? Math.round((minhasEntregues.length / entregas.length) * 100) : 0}%` }}
                  />
                </div>

                <div className="grid gap-3">
                  {minhasAndamento.map((e) => (
                    <div key={e.id} className="surface-glass rounded-2xl p-5 flex items-start gap-3 border-warning/30">
                      <Loader2 className="w-5 h-5 text-warning shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <p className="text-text-1 font-medium">{e.titulo}</p>
                        <p className="font-sans text-xs text-warning mt-0.5">sendo feito agora</p>
                        {e.descricao && <p className="text-sm text-text-2 mt-1">{e.descricao}</p>}
                      </div>
                    </div>
                  ))}
                  {minhasPlanejadas.map((e) => (
                    <div key={e.id} className="surface-glass rounded-2xl p-5 flex items-start gap-3">
                      <CircleDashed className="w-5 h-5 text-text-3 shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <p className="text-text-1 font-medium">{e.titulo}</p>
                        <p className="font-sans text-xs text-text-3 mt-0.5">próxima entrega</p>
                        {e.descricao && <p className="text-sm text-text-2 mt-1">{e.descricao}</p>}
                      </div>
                    </div>
                  ))}
                  {minhasEntregues.map((e) => (
                    <div key={e.id} className="surface-glass rounded-2xl p-5 flex items-start gap-3 opacity-90">
                      <CheckCircle2 className="w-5 h-5 text-success-strong shrink-0 mt-0.5" aria-hidden />
                      <div>
                        <p className="text-text-1 font-medium">{e.titulo}</p>
                        <p className="font-sans text-xs text-success-strong mt-0.5">
                          entregue{e.entregue_em ? ` em ${fmt(e.entregue_em)}` : ""}
                        </p>
                        {e.descricao && <p className="text-sm text-text-2 mt-1">{e.descricao}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Nova demanda */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-h2 text-text-1">Suas demandas</h2>
              <NovaDemandaForm />
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
