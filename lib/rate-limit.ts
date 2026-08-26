import sql from "@/lib/db";

/**
 * Rate limit do login, persistido no banco.
 *
 * Por que no banco e não em memória: o Cloud Run roda N instâncias e escala a
 * zero. Um contador em processo zeraria a cada cold start e seria contornável
 * distribuindo as tentativas entre instâncias.
 *
 * Duas chaves independentes por tentativa:
 *  - email:<email> → protege UMA conta de ataque de dicionário;
 *  - ip:<addr>     → protege o cadastro inteiro de varredura de credenciais.
 * Se qualquer uma estourar, o login é bloqueado pela janela.
 */

const JANELA_MIN = 15;
const MAX_POR_EMAIL = 5;
const MAX_POR_IP = 20;

export interface RateLimitResult {
  bloqueado: boolean;
  esperaSegundos: number;
}

/** IP do cliente atrás do proxy do Cloud Run. */
export function getClientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip")?.trim() || "desconhecido";
}

/** Consulta (sem registrar) se email ou IP já estouraram a janela. */
export async function checarLoginRateLimit(email: string, ip: string): Promise<RateLimitResult> {
  try {
    const rows = await sql<{ chave: string; total: number; mais_antiga: Date }[]>`
      select chave, count(*)::int as total, min(criado_em) as mais_antiga
        from login_tentativas
       where chave in (${`email:${email}`}, ${`ip:${ip}`})
         and criado_em > now() - ${`${JANELA_MIN} minutes`}::interval
       group by chave`;

    for (const r of rows) {
      const teto = r.chave.startsWith("email:") ? MAX_POR_EMAIL : MAX_POR_IP;
      if (r.total >= teto) {
        const liberaEm = new Date(r.mais_antiga).getTime() + JANELA_MIN * 60_000;
        return {
          bloqueado: true,
          esperaSegundos: Math.max(1, Math.ceil((liberaEm - Date.now()) / 1000)),
        };
      }
    }
    return { bloqueado: false, esperaSegundos: 0 };
  } catch (e) {
    // Banco indisponível não pode virar negação de serviço no login.
    console.error("[rate-limit] consulta falhou, liberando:", e);
    return { bloqueado: false, esperaSegundos: 0 };
  }
}

/** Registra uma tentativa MALSUCEDIDA e aproveita para podar as expiradas. */
export async function registrarFalhaLogin(email: string, ip: string): Promise<void> {
  try {
    await sql`
      insert into login_tentativas (chave)
      values (${`email:${email}`}), (${`ip:${ip}`})`;
    // Poda oportunista (~5% das falhas) — evita a tabela crescer sem limite.
    if (Math.random() < 0.05) {
      await sql`delete from login_tentativas where criado_em < now() - ${`${JANELA_MIN} minutes`}::interval`;
    }
  } catch (e) {
    console.error("[rate-limit] registro falhou:", e);
  }
}

/** Login bem-sucedido zera o contador daquele e-mail. */
export async function limparFalhasLogin(email: string): Promise<void> {
  try {
    await sql`delete from login_tentativas where chave = ${`email:${email}`}`;
  } catch (e) {
    console.error("[rate-limit] limpeza falhou:", e);
  }
}
