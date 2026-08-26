import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

/**
 * Admin solicita a logo da empresa. Marca o pedido (banner no painel dela) e já
 * ativa em_orbita: assim que a empresa ENVIAR a logo, ela entra na órbita do
 * site automaticamente (a órbita só exibe quem tem em_orbita + logo_url).
 */
export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const eu = await getEmpresaLogada();
  if (!eu) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (eu.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await ctx.params;
  const rows = await sql`
    update empresas
       set logo_solicitada_em = now(), em_orbita = true
     where id = ${id}
     returning id`;
  if (rows.length === 0) return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
