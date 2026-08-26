import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";
import { demandaSchema } from "@/lib/auth-validation";

/** Empresa logada cria uma demanda. */
export async function POST(req: NextRequest) {
  const empresa = await getEmpresaLogada();
  if (!empresa) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }
  const parsed = demandaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
  }

  await sql`
    insert into demandas (empresa_id, titulo, descricao)
    values (${empresa.id}, ${parsed.data.titulo}, ${parsed.data.descricao ?? null})`;
  return NextResponse.json({ ok: true }, { status: 201 });
}
