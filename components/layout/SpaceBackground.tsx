"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { StaticSpaceBackground } from "./StaticSpaceBackground";
import { detectDeviceTier, type DeviceTier } from "@/lib/deviceTier";

/**
 * Fundo de universo global. Camada fixa atrás de todo o conteúdo.
 *
 * Adaptativo por CAPACIDADE do aparelho (lib/deviceTier):
 *  - low    → só o fundo estático em CSS (sem WebGL) — GPU fraca, Save-Data, etc.;
 *  - medium → canvas magro (2500 partículas, sem meteoros);
 *  - high   → canvas completo (6000 + meteoros).
 * O estático é sempre a base; o canvas (medium/high) entra por cima, adiado para
 * depois do conteúdo crítico (requestIdleCallback) → melhora LCP/TBT.
 */
const SpaceBackgroundCanvas = dynamic(() => import("./SpaceBackgroundCanvas"), {
  ssr: false,
});

export function SpaceBackground() {
  const pathname = usePathname();
  const universe = pathname === "/universo";
  const [tier, setTier] = useState<DeviceTier | null>(null);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    // interruptor de teste: ?no3d força o estático
    const forcaEstatico = /[?&]no3d/.test(window.location.search);
    const t = forcaEstatico ? "low" : detectDeviceTier();

    // TUDO passa pelo agendador — inclusive o "low". Decidir de forma síncrona
    // aqui dispararia um render em cascata sem ganho: o fundo estático já está
    // na tela e o tier só controla se o canvas chega a montar.
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const id = schedule(() => setTier(t));
    return () => (w.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);

  return (
    <div
      aria-hidden
      className={
        universe
          ? "fixed inset-0 z-0 pointer-events-auto"
          : "fixed inset-0 -z-10 pointer-events-none"
      }
    >
      <StaticSpaceBackground />
      {(tier === "medium" || tier === "high") && <SpaceBackgroundCanvas tier={tier} />}
    </div>
  );
}
