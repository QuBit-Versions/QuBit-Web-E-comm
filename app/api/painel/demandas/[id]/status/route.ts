import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

const statusSchema = z.object({
  status: z.enum(["nova", "em_analise", "em_andamento", "concluida"]),
});

/** Só o admin muda o status de uma demanda. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const empresa = await getEmpresaLogada();
  if (!empresa) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (empresa.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Status inválido" }, { status: 400 });

  const { id } = await ctx.params;
  const rows = await sql`update demandas set status = ${parsed.data.status} where id = ${id} returning id`;
  if (rows.length === 0) return NextResponse.json({ error: "Demanda não encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
