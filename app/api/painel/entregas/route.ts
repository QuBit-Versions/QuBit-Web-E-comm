import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

const criarSchema = z.object({
  empresa_id: z.string().uuid(),
  titulo: z.string().trim().min(3, "Dê um título para a entrega"),
  descricao: z.string().trim().max(2000).optional(),
  // admin pode cadastrar algo JÁ entregue (histórico) ou planejado
  status: z.enum(["planejada", "em_andamento", "entregue"]).default("planejada"),
});

/** Só o admin cadastra entregas (o que foi/será entregue para a empresa). */
export async function POST(req: NextRequest) {
  const eu = await getEmpresaLogada();
  if (!eu) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  if (eu.role !== "admin") return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = criarSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
  }
  const d = parsed.data;

  await sql`
    insert into entregas (empresa_id, titulo, descricao, status, entregue_em)
    values (${d.empresa_id}, ${d.titulo}, ${d.descricao ?? null}, ${d.status},
            ${d.status === "entregue" ? new Date() : null})`;
  return NextResponse.json({ ok: true }, { status: 201 });
}
