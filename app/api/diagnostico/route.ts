import { NextRequest, NextResponse } from "next/server";
import { diagnosticoSchema } from "@/lib/validation";
import { getSupabase } from "@/lib/supabase";

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
  let delivered = false;

  // 1) Supabase — destino primário (tabela public.diagnosticos, RLS insert-only)
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase.from("diagnosticos").insert({
      nome: data.nome,
      whatsapp: data.whatsapp,
      email: data.email,
      segmento: data.segmento,
      mensagem: data.mensagem ?? null,
      interesses: data.interesses ?? null,
    });
    if (error) {
      console.error("[diagnostico] Supabase insert falhou:", error.message);
    } else {
      delivered = true;
    }
  }

  // 2) Webhook opcional (ex.: notificação no WhatsApp/Slack)
  const webhook = process.env.FORM_SUBMISSION_WEBHOOK;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, _source: "diagnostico", _at: new Date().toISOString() }),
      });
      if (res.ok) delivered = true;
      else console.error("[diagnostico] webhook respondeu", res.status);
    } catch (e) {
      console.error("[diagnostico] webhook erro:", e);
    }
  }

  // 3) Sem destino configurado → loga (dev) e considera entregue
  if (!supabase && !webhook) {
    console.log("[diagnostico] novo lead (sem destino configurado):", JSON.stringify(data, null, 2));
    delivered = true;
  }

  if (!delivered) {
    return NextResponse.json({ error: "Falha ao registrar pedido" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
