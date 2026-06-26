"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Bloco full-screen do scrollytelling. Ocupa a tela, encaixa no snap e marca
 * `data-active` quando entra na viewport — o que dispara (e reverte) as animações
 * em cascata dos filhos marcados com `.b-item` / `.b-spread` / `.b-char`.
 *
 * Reversível: ao voltar para o bloco anterior, ele reativa e os itens reentram;
 * ao sair, revertem (transição CSS, não keyframe).
 */
export function Block({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio >= 0.45),
      { threshold: [0, 0.45, 0.7, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      data-active={active}
      className={`snap-block min-h-screen flex flex-col justify-center ${className}`}
    >
      {children}
    </div>
  );
}
