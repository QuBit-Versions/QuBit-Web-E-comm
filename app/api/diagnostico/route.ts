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
  let delivered = false;

  // 1) Webhook opcional (ex.: notificação no WhatsApp/Slack)
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

  // 2) Gestão API — destino primário: cria o lead no pipeline comercial (hub central)
  const gestaoUrl = process.env.GESTAO_API_URL;
  const gestaoKey = process.env.GESTAO_API_KEY;
  if (gestaoUrl && gestaoKey) {
    try {
      const detalhes = [
        data.segmento ? `Segmento: ${data.segmento}` : null,
        data.interesses?.length ? `Interesses: ${data.interesses.join(", ")}` : null,
        data.mensagem ? `Mensagem: ${data.mensagem}` : null,
      ].filter(Boolean).join(" | ");
      const res = await fetch(`${gestaoUrl}/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": gestaoKey },
        body: JSON.stringify({
          nome: data.nome,
          email: data.email,
          telefone: data.whatsapp,
          origem: "site:diagnostico",
          observacao: detalhes || undefined,
          origemExternaId: data.email ? `diag:${data.email}` : undefined,
        }),
      });
      if (res.ok) delivered = true;
      else console.error("[diagnostico] gestão respondeu", res.status);
    } catch (e) {
      console.error("[diagnostico] gestão erro:", e);
    }
  }

  // 3) Sem destino configurado → loga (dev) e considera entregue
  if (!webhook && !(gestaoUrl && gestaoKey)) {
    console.log("[diagnostico] novo lead (sem destino configurado):", JSON.stringify(data, null, 2));
    delivered = true;
  }

  if (!delivered) {
    return NextResponse.json({ error: "Falha ao registrar pedido" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
