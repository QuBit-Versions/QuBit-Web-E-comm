"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Orbit, ImagePlus, Check, Loader2, Link2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * Controles do ADMIN em cada card de empresa:
 * - "Em órbita": liga/desliga a presença na constelação do site.
 * - "Solicitar logo": marca o pedido (banner no painel da empresa) e já ativa
 *   a órbita — quando a logo chegar, a empresa aparece no átomo sozinha.
 * - Link do logo: para onde o clique no logo (na órbita) leva — o site da empresa.
 */
export function OrbitaControls({
  empresaId,
  emOrbita,
  temLogo,
  logoSolicitada,
  siteUrl,
}: {
  empresaId: string;
  emOrbita: boolean;
  temLogo: boolean;
  logoSolicitada: boolean;
  siteUrl: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"orbita" | "logo" | "url" | null>(null);
  const [pedidoEnviado, setPedidoEnviado] = useState(false);
  const [url, setUrl] = useState(siteUrl);
  const [urlSalva, setUrlSalva] = useState(false);

  const toggleOrbita = async () => {
    setBusy("orbita");
    try {
      await fetch(`/api/painel/empresas/${empresaId}/orbita`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ em_orbita: !emOrbita }),
      });
    } catch {}
    setBusy(null);
    router.refresh();
  };

  const solicitarLogo = async () => {
    setBusy("logo");
    try {
      const res = await fetch(`/api/painel/empresas/${empresaId}/solicitar-logo`, { method: "POST" });
      if (res.ok) setPedidoEnviado(true);
    } catch {}
    setBusy(null);
    router.refresh();
  };

  const salvarUrl = async () => {
    setBusy("url");
    setUrlSalva(false);
    try {
      const res = await fetch(`/api/painel/empresas/${empresaId}/orbita`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site_url: url }),
      });
      if (res.ok) {
        const data = (await res.json().catch(() => null)) as { site_url?: string | null } | null;
        if (data && "site_url" in data) setUrl(data.site_url ?? "");
        setUrlSalva(true);
      }
    } catch {}
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="pt-4 mt-4 border-t border-line">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant={emOrbita ? "primary" : "secondary"} size="sm" loading={busy === "orbita"} onClick={toggleOrbita}>
          <Orbit className="w-3.5 h-3.5" aria-hidden />
          {emOrbita ? "Em órbita" : "Pôr em órbita"}
        </Button>

        {!temLogo && (
          <Button variant="secondary" size="sm" loading={busy === "logo"} onClick={solicitarLogo} disabled={pedidoEnviado}>
            {pedidoEnviado ? <Check className="w-3.5 h-3.5" aria-hidden /> : <ImagePlus className="w-3.5 h-3.5" aria-hidden />}
            {pedidoEnviado ? "Logo solicitada" : logoSolicitada ? "Solicitar de novo" : "Solicitar logo"}
          </Button>
        )}

        <span className="font-sans text-[11px] text-text-3 ml-auto inline-flex items-center gap-1">
          {emOrbita && temLogo ? (
            <>
              <Orbit className="w-3 h-3 text-brand-text" aria-hidden /> visível no site
            </>
          ) : emOrbita && !temLogo ? (
            logoSolicitada || pedidoEnviado ? (
              <>
                <Loader2 className="w-3 h-3" aria-hidden /> aguardando logo
              </>
            ) : (
              "sem logo — não aparece"
            )
          ) : (
            "fora da órbita"
          )}
        </span>
      </div>

      {/* Link do logo na órbita: para onde o clique leva (o site da empresa). */}
      {emOrbita && (
        <div className="flex items-center gap-2 mt-3">
          <Link2 className="w-3.5 h-3.5 text-text-3 shrink-0" aria-hidden />
          <input
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setUrlSalva(false);
            }}
            placeholder="site da empresa — ex.: economicon.com.br"
            aria-label="Endereço do site da empresa (link do logo na órbita)"
            className="min-h-11 flex-1 min-w-0 rounded-lg bg-surface-2 border border-line px-3 font-sans text-sm text-text-1 placeholder:text-text-3 focus:outline-none focus:border-brand-text"
          />
          <Button variant="secondary" size="sm" loading={busy === "url"} onClick={salvarUrl}>
            {urlSalva ? <Check className="w-3.5 h-3.5" aria-hidden /> : <Link2 className="w-3.5 h-3.5" aria-hidden />}
            {urlSalva ? "Salvo" : "Salvar link"}
          </Button>
        </div>
      )}
    </div>
  );
}
