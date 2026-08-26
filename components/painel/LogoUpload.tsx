"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/** Envio da logo da empresa para o Cloud Storage (via /api/painel/logo). */
export function LogoUpload({ logoUrl }: { logoUrl?: string | null }) {
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
    try {
      const fd = new FormData();
      fd.append("logo", file);
      const res = await fetch("/api/painel/logo", { method: "POST", body: fd });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Falha ao enviar. Tente de novo.");
        setBusy(false);
        return;
      }
      setPreview(data.url);
    } catch {
      setError("Falha ao enviar. Tente de novo.");
      setBusy(false);
      return;
    }
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
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={onFile} />
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
