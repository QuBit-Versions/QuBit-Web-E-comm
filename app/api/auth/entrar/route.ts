import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { verificaSenha, criarSessao } from "@/lib/auth";
import { loginSchema } from "@/lib/auth-validation";
import {
  checarLoginRateLimit,
  registrarFalhaLogin,
  limparFalhasLogin,
  getClientIp,
} from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }
  const email = parsed.data.email.toLowerCase();
  const ip = getClientIp(req);

  // Trava de força bruta ANTES de tocar o banco de senhas (o scrypt é caro de
  // propósito; deixá-lo rodar sem teto é também um vetor de exaustão de CPU).
  const limite = await checarLoginRateLimit(email, ip);
  if (limite.bloqueado) {
    const min = Math.ceil(limite.esperaSegundos / 60);
    return NextResponse.json(
      {
        error: `Muitas tentativas. Tente de novo em ${min} ${min === 1 ? "minuto" : "minutos"}.`,
      },
      { status: 429, headers: { "Retry-After": String(limite.esperaSegundos) } },
    );
  }

  const rows = await sql<{ id: string; senha_hash: string }[]>`
    select id, senha_hash from empresas where email = ${email} limit 1`;
  const empresa = rows[0];
  // Mensagem única para e-mail inexistente e senha errada (não vaza cadastro).
  if (!empresa || !verificaSenha(parsed.data.senha, empresa.senha_hash)) {
    await registrarFalhaLogin(email, ip);
    return NextResponse.json({ error: "E-mail ou senha incorretos." }, { status: 401 });
  }

  await limparFalhasLogin(email);
  await criarSessao(empresa.id);
  return NextResponse.json({ ok: true });
}
