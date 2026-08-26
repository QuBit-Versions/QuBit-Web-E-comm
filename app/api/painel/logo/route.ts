import { NextRequest, NextResponse } from "next/server";
import { Storage } from "@google-cloud/storage";
import sql from "@/lib/db";
import { getEmpresaLogada } from "@/lib/auth";

/**
 * Upload da logo da empresa para o Google Cloud Storage (substitui o
 * Supabase Storage). Bucket público de leitura; o caminho é {empresaId}/logo.ext.
 * No Cloud Run a autenticação é automática (Application Default Credentials).
 */
const MAX_BYTES = 2 * 1024 * 1024; // 2MB

/**
 * Allowlist de formatos. SVG fica DE FORA de propósito: é um documento XML que
 * pode conter <script>, e o bucket serve os arquivos com o content-type que
 * recebe. Logo vetorial de parceiro entra como PNG/WebP exportado.
 */
const TIPOS_ACEITOS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const storage = new Storage();

export async function POST(req: NextRequest) {
  const empresa = await getEmpresaLogada();
  if (!empresa) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const bucketName = process.env.LOGOS_BUCKET;
  if (!bucketName) return NextResponse.json({ error: "Storage não configurado" }, { status: 500 });

  const form = await req.formData();
  const file = form.get("logo");
  if (!(file instanceof File)) return NextResponse.json({ error: "Arquivo ausente" }, { status: 400 });
  const ext = TIPOS_ACEITOS[file.type];
  if (!ext) {
    return NextResponse.json(
      { error: "Envie a logo em PNG, JPG, WebP ou GIF." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "Imagem muito grande (máx. 2MB)." }, { status: 400 });

  // Extensão vem da allowlist, nunca do nome do arquivo enviado pelo usuário.
  const dest = `${empresa.id}/logo.${ext}`;

  try {
    const buf = Buffer.from(await file.arrayBuffer());
    await storage.bucket(bucketName).file(dest).save(buf, {
      contentType: file.type,
      resumable: false,
      metadata: { cacheControl: "public, max-age=300" },
    });
    const url = `https://storage.googleapis.com/${bucketName}/${dest}?v=${Date.now()}`;
    await sql`update empresas set logo_url = ${url} where id = ${empresa.id}`;
    return NextResponse.json({ ok: true, url });
  } catch (e) {
    console.error("[logo] upload falhou:", e);
    return NextResponse.json({ error: "Falha ao enviar. Tente de novo." }, { status: 502 });
  }
}
