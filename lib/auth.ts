import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import sql from "@/lib/db";

/**
 * Auth própria do portal de parceiros (substitui o Supabase Auth).
 * - Senha: scrypt do node:crypto (sem libs externas), formato "scrypt:salt:hash".
 * - Sessão: token aleatório em cookie httpOnly + linha na tabela sessoes.
 * Mesmo padrão do Economicon.
 */

const COOKIE = "qubit_sessao";
const DIAS_SESSAO = 30;

export interface Empresa {
  id: string;
  created_at: Date;
  email: string;
  role: "empresa" | "admin";
  nome_fantasia: string;
  cnpj: string | null;
  responsavel: string | null;
  area: string | null;
  regiao: string | null;
  telefone: string | null;
  logo_url: string | null;
  interesses_pendentes: string[] | null;
  em_orbita: boolean;
  logo_solicitada_em: Date | null;
  site_url: string | null;
  contrato_url: string | null;
}

export function hashSenha(senha: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(senha, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verificaSenha(senha: string, guardado: string): boolean {
  const [alg, salt, hash] = guardado.split(":");
  if (alg !== "scrypt" || !salt || !hash) return false;
  const calc = scryptSync(senha, salt, 64);
  const ref = Buffer.from(hash, "hex");
  return calc.length === ref.length && timingSafeEqual(calc, ref);
}

/** Cria a sessão no banco e grava o cookie. Chamar APENAS de route handlers. */
export async function criarSessao(empresaId: string): Promise<void> {
  const token = randomBytes(32).toString("hex");
  const expira = new Date(Date.now() + DIAS_SESSAO * 24 * 60 * 60 * 1000);
  // Poda as sessões já vencidas desta empresa. Sem isto a tabela só cresce: cada
  // login deixava uma linha morta viva por 30 dias.
  await sql`delete from sessoes where empresa_id = ${empresaId} and expires_at <= now()`;
  await sql`insert into sessoes (token, empresa_id, expires_at) values (${token}, ${empresaId}, ${expira})`;
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expira,
  });
}

/** Empresa da sessão atual (ou null). Seguro em server components e handlers. */
export async function getEmpresaLogada(): Promise<Empresa | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const rows = await sql<Empresa[]>`
    select e.id, e.created_at, e.email, e.role, e.nome_fantasia, e.cnpj,
           e.responsavel, e.area, e.regiao, e.telefone, e.logo_url, e.interesses_pendentes,
           e.em_orbita, e.logo_solicitada_em, e.site_url, e.contrato_url
      from sessoes s
      join empresas e on e.id = s.empresa_id
     where s.token = ${token} and s.expires_at > now()
     limit 1`;
  return rows[0] ?? null;
}

/** Apaga a sessão do banco e limpa o cookie. Chamar APENAS de route handlers. */
export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await sql`delete from sessoes where token = ${token}`;
  store.delete(COOKIE);
}
