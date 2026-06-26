"use client";

import { useEffect, useMemo, useRef } from "react";
import { OCTOPUS_CELLS, OCTOPUS_PALETTE, OCTOPUS_SIZE } from "@/content/octopus";

type Cell = [number, number, number];

/**
 * Polvo-qubit em pixels — SVG via código. Estático por padrão; com `animated`
 * ele "respira física quântica":
 *  - ANIMAÇÃO POR FRAMES DE PIXEL (~10fps): os tentáculos são redesenhados em
 *    células NOVAS do grid a cada quadro (offset inteiro, estilo pixel-art),
 *    com a onda viajando até as pontas — não um wobble borrado;
 *  - ACENO: de tempos em tempos os tentáculos de um lado se LEVANTAM e balançam;
 *  - pupilas seguem o ponteiro e o corpo inclina de leve (suaves);
 *  - cromatóforos cintilam; olhos piscam.
 * Respeita prefers-reduced-motion (congela tudo).
 */
export function OctopusMark({
  className = "",
  animated = false,
  title = "Polvo-qubit — a mascote da QuBit",
}: {
  className?: string;
  animated?: boolean;
  title?: string;
}) {
  const n = OCTOPUS_SIZE;
  const ref = useRef<SVGSVGElement>(null);
  const leanRef = useRef<SVGGElement>(null);
  const pointer = useRef({ x: 0, y: 0 });

  // Papéis: branco do olho (c6) · pupila (c5 junto do branco) · corpo/tentáculo.
  const { cells, whites, pupils } = useMemo(() => {
    const creams = OCTOPUS_CELLS.filter(([, , c]) => c === 6);
    const nearEye = ([x, y]: Cell) => creams.some(([ex, ey]) => Math.abs(ex - x) <= 1 && Math.abs(ey - y) <= 1);
    const cells: Cell[] = [];
    const whites: Cell[] = [];
    const pupils: Cell[] = [];
    for (const cell of OCTOPUS_CELLS) {
      const [, , c] = cell;
      if (c === 6) whites.push(cell);
      else if (c === 5 && nearEye(cell)) pupils.push(cell);
      else cells.push(cell);
    }
    return { cells, whites, pupils };
  }, []);

  useEffect(() => {
    if (!animated || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = ref.current;
    const FPS = 10; // pixel-art: passos discretos, propositalmente "chunky"

    const items = Array.from(root.querySelectorAll<SVGRectElement>(".oct-cell")).map((el) => {
      const x = Number(el.getAttribute("x"));
      const y = Number(el.getAttribute("y"));
      // amplitude da DEFORMAÇÃO por-pixel: 0 na cabeça (não rasga) → forte nas pontas.
      // O movimento da cabeça vem da deriva suave do corpo inteiro (leanRef).
      const amp = Math.min(3.2, Math.max(0, y - 13) * 0.2);
      return { el, x, y, amp, base: el.dataset.base ? Number(el.dataset.base) : -1 };
    });
    const shim = items.filter((i) => i.base >= 0);
    const pupilEls = Array.from(root.querySelectorAll<SVGRectElement>(".oct-pupil"));

    const onMove = (e: MouseEvent) => {
      const r = root.getBoundingClientRect();
      pointer.current.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      pointer.current.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let raf = 0;
    let frame = 0;
    let lastStep = 0;
    let lastShim = 0;
    let nextGesture = performance.now() + 4000;
    let gStart = -1;
    let gSide = 1;
    let leanX = 0;
    let leanY = 0;
    const timers: number[] = [];

    // Redesenha um quadro de pixels (offsets INTEIROS em células)
    const drawFrame = (t: number) => {
      frame++;
      const ph = frame * 0.38; // mais lento = ondulação calma

      if (t > nextGesture) {
        gStart = t;
        gSide = Math.random() < 0.5 ? -1 : 1;
        nextGesture = t + 7000 + Math.random() * 4000;
      }
      const gp = gStart >= 0 ? (t - gStart) / 2200 : 2; // 0..1 durante o aceno (~2.2s)
      const gOn = gp < 1;
      // envelope com PLATÔ: sobe (0–0.22), fica em cima acenando (0.22–0.78), desce
      const gEnv = !gOn ? 0 : gp < 0.22 ? gp / 0.22 : gp > 0.78 ? (1 - gp) / 0.22 : 1;

      for (const it of items) {
        // o tentáculo EXTERNO do lado do aceno: sobe COESO como um braço + balança a ponta
        const outer = gSide > 0 ? it.x >= n - 9 : it.x <= 8;
        let ox: number;
        let oy: number;
        if (gOn && it.y >= 15 && outer) {
          oy = -Math.round(gEnv * 8); // braço sobe (mesmo p/ todo o tentáculo)
          const tip = Math.max(0, it.y - 18);
          ox = Math.round(gEnv * (1 + tip * 0.5) * Math.sin(frame * 0.8)); // acena
        } else {
          ox = Math.round(it.amp * Math.sin(ph + it.y * 0.5 + it.x * 0.16));
          oy = Math.round(it.amp * 0.5 * Math.cos(ph + it.y * 0.45));
        }
        it.el.setAttribute("transform", `translate(${ox} ${oy})`);
      }

      // cromatóforos
      if (t - lastShim > 220) {
        lastShim = t;
        for (let k = 0; k < 7; k++) {
          const c = shim[(Math.random() * shim.length) | 0];
          if (!c) continue;
          const ni = Math.max(0, Math.min(4, c.base + (Math.random() < 0.5 ? -1 : 1)));
          c.el.setAttribute("fill", OCTOPUS_PALETTE[ni]);
          timers.push(window.setTimeout(() => c.el.setAttribute("fill", OCTOPUS_PALETTE[c.base]), 650));
        }
      }
    };

    const loop = (t: number) => {
      // corpo em frames discretos (~10fps)
      if (t - lastStep >= 1000 / FPS) {
        lastStep = t;
        drawFrame(t);
      }
      // deriva suave do corpo inteiro (cabeça inclusa) + inclinação p/ o ponteiro
      const ts = t * 0.001;
      const swayX = 0.9 * Math.sin(ts * 0.7);
      const swayY = 0.6 * Math.sin(ts * 0.55 + 1);
      leanX += (pointer.current.x * 0.8 - leanX) * 0.06;
      leanY += (pointer.current.y * 0.5 - leanY) * 0.06;
      if (leanRef.current)
        leanRef.current.setAttribute("transform", `translate(${(leanX + swayX).toFixed(2)} ${(leanY + swayY).toFixed(2)})`);

      // pupilas seguem o ponteiro
      const pdx = (pointer.current.x * 0.5).toFixed(2);
      const pdy = (pointer.current.y * 0.4).toFixed(2);
      for (const el of pupilEls) el.setAttribute("transform", `translate(${pdx} ${pdy})`);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      timers.forEach(clearTimeout);
    };
  }, [animated, n]);

  const cell = (key: string, x: number, y: number, c: number, cls?: string, base?: number) => (
    <rect key={key} x={x} y={y} width={1.04} height={1.04} fill={OCTOPUS_PALETTE[c]} className={cls} data-base={base} />
  );

  return (
    <svg ref={ref} viewBox={`0 0 ${n} ${n}`} className={className} role="img" aria-label={title} shapeRendering="crispEdges">
      <g ref={leanRef}>
        {cells.map(([x, y, c], i) => {
          const shimmer = animated && c <= 4;
          return cell(`c${i}`, x, y, c, animated ? `oct-cell${shimmer ? " oct-shimmer" : ""}` : undefined, shimmer ? c : undefined);
        })}
        {whites.map(([x, y, c], i) => cell(`w${i}`, x, y, c, animated ? "oct-eye" : undefined))}
        {pupils.map(([x, y, c], i) => cell(`p${i}`, x, y, c, animated ? "oct-pupil" : undefined))}
      </g>
    </svg>
  );
}
