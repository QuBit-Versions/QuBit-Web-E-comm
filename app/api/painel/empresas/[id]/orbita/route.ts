import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

const orbitaSchema = z
  .object({
    em_orbita: z.boolean().optional(),
    // Link do logo na órbita (para onde o clique leva). "" limpa o link.
    site_url: z.string().trim().max(300).optional(),
  })
  .refine((d) => d.em_orbita !== undefined || d.site_url !== undefined, {
    message: "Nada para atualizar",
  });

/** Normaliza para URL absoluta http(s). "" → null (limpa). Inválida → undefined (erro). */
function normalizeSiteUrl(raw: string): string | null | undefined {
  const s = raw.trim();
  if (!s) return null;
  const withScheme = /^https?:\/\//i.test(s) ? s : `https://${s}`;
  try {
    return new URL(withScheme).toString();
  } catch {
    return undefined;
  }
}

/** Só o admin coloca/tira uma empresa da órbita do site e define o link do logo. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const eu = await getEmpresaLogada();
  if (!eu) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (eu.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = orbitaSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

  const updates: Record<string, string | boolean | null> = {};
  if (parsed.data.em_orbita !== undefined) updates.em_orbita = parsed.data.em_orbita;
  if (parsed.data.site_url !== undefined) {
    const url = normalizeSiteUrl(parsed.data.site_url);
    if (url === undefined) return NextResponse.json({ error: "Endereço inválido" }, { status: 400 });
    updates.site_url = url;
  }

  const { id } = await ctx.params;
  const rows = await sql`
    update empresas set ${sql(updates)} where id = ${id} returning id`;
  if (rows.length === 0) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true, site_url: updates.site_url });
}
