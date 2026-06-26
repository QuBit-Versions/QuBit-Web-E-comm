"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";

/** Envio da logo da empresa para o Storage (bucket "logos/{uid}/...") + salva a URL no perfil. */
export function LogoUpload({ userId, logoUrl }: { userId: string; logoUrl?: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<string | null>(logoUrl ?? null);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Envie um arquivo de imagem.");
    if (file.size > 2 * 1024 * 1024) return setError("Imagem muito grande (máx. 2MB).");

    setBusy(true);
    setError(null);
    const supabase = createSupabaseBrowser();
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const path = `${userId}/logo.${ext}`;
    const { error: upErr } = await supabase.storage.from("logos").upload(path, file, { upsert: true });
    if (upErr) {
      setError("Falha ao enviar. Tente de novo.");
      setBusy(false);
      return;
    }
    const { data: pub } = supabase.storage.from("logos").getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;
    const { error: updErr } = await supabase.from("profiles").update({ logo_url: url }).eq("id", userId);
    if (updErr) {
      setError("Enviada, mas não conseguimos salvar.");
      setBusy(false);
      return;
    }
    setPreview(url);
    setBusy(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl surface-glass flex items-center justify-center overflow-hidden shrink-0">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Logo da empresa" className="w-full h-full object-contain" />
        ) : (
          <span className="font-sans text-[10px] text-text-3">sem logo</span>
        )}
      </div>
      <div>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={onFile} />
        <Button variant="secondary" size="sm" loading={busy} onClick={() => inputRef.current?.click()}>
          {preview ? "Trocar logo" : "Enviar logo"}
        </Button>
        {error ? (
          <p className="text-xs text-danger mt-1.5">{error}</p>
        ) : (
          <p className="text-xs text-text-3 mt-1.5">PNG, SVG ou JPG · até 2MB</p>
        )}
      </div>
    </div>
  );
}
