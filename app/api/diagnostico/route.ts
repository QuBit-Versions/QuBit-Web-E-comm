import { NextRequest, NextResponse } from "next/server";
import { diagnosticoSchema } from "@/lib/validation";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
  }

  const parsed = diagnosticoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos", issues: parsed.error.issues }, { status: 400 });
  }

  const data = parsed.data;
  const webhook = process.env.FORM_SUBMISSION_WEBHOOK;

  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, _source: "diagnostico", _at: new Date().toISOString() }),
    });
    if (!res.ok) {
      console.error("[diagnostico] webhook respondeu", res.status);
      return NextResponse.json({ error: "Falha ao registrar pedido" }, { status: 502 });
    }
  } else {
    // Sem webhook configurado: só loga (ambiente de desenvolvimento)
    console.log("[diagnostico] novo lead:", JSON.stringify(data, null, 2));
  }

  return NextResponse.json({ ok: true });
}
