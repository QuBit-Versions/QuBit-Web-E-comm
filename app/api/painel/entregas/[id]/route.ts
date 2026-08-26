import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["planejada", "em_andamento", "entregue"]).optional(),
  titulo: z.string().trim().min(3).optional(),
  descricao: z.string().trim().max(2000).nullable().optional(),
});

/** Admin move o status (planejada → em andamento → entregue) ou edita a entrega. */
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
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  const d = parsed.data;
  const { id } = await ctx.params;

  const rows = await sql`
    update entregas set
      titulo      = coalesce(${d.titulo ?? null}, titulo),
      descricao   = ${d.descricao === undefined ? sql`descricao` : d.descricao},
      status      = coalesce(${d.status ?? null}, status),
      entregue_em = case
                      when ${d.status ?? null} = 'entregue' then coalesce(entregue_em, now())
                      when ${d.status ?? null} is null then entregue_em
                      else null
                    end
    where id = ${id}
    returning id`;
  if (rows.length === 0) return NextResponse.json({ error: "Entrega não encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const eu = await getEmpresaLogada();
  if (!eu) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (eu.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const { id } = await ctx.params;
  await sql`delete from entregas where id = ${id}`;
  return NextResponse.json({ ok: true }, { status: 200 });
}
