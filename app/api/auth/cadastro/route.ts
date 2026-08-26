import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { hashSenha, criarSessao } from "@/lib/auth";
import { cadastroSchema } from "@/lib/auth-validation";

const bodySchema = cadastroSchema.extend({
  interesses: z.array(z.string()).optional(),
});

/** Cria a conta da empresa (sem confirmação de e-mail) e já entra. */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;
  const email = d.email.toLowerCase();
  // O e-mail do dono vira admin ao se cadastrar (padrão Economicon).
  const role = process.env.OWNER_EMAIL && email === process.env.OWNER_EMAIL.toLowerCase() ? "admin" : "empresa";

  try {
    const [empresa] = await sql<{ id: string }[]>`
      insert into empresas (email, senha_hash, role, nome_fantasia, cnpj, responsavel, area, regiao, telefone, interesses_pendentes)
      values (${email}, ${hashSenha(d.senha)}, ${role}, ${d.nome_fantasia}, ${d.cnpj ?? null},
              ${d.responsavel}, ${d.area}, ${d.regiao}, ${d.telefone}, ${d.interesses ?? null})
      returning id`;
    await criarSessao(empresa.id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    const pgCode = (e as { code?: string }).code;
    if (pgCode === "23505") {
      return NextResponse.json({ error: "Esse e-mail já tem uma conta. Tente entrar." }, { status: 409 });
    }
    console.error("[cadastro] erro:", e);
    return NextResponse.json({ error: "Não conseguimos criar a conta agora. Tente de novo." }, { status: 500 });
  }
}
