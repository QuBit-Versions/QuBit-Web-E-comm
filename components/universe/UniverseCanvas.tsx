"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { orbits } from "@/content/universe";
import { Starfield } from "./Starfield";
import { Core } from "./Core";
import { Planet } from "./Planet";
import { Mascot } from "./Mascot";

export default function UniverseCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [inViewport, setInViewport] = useState(true);
  const [tabActive, setTabActive] = useState(true);
  const reduced = useReducedMotion();
  const animate = !reduced;

  // Pausa o render-loop quando a cena sai da viewport (economia de CPU/GPU) — §6.3
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pausa também quando a aba perde o foco (visibilitychange) — §6.3 / §11
  useEffect(() => {
    const onVis = () => setTabActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // reduced → "demand" (só renderiza em interação);
  // fora da viewport OU aba oculta → "never"; senão → "always"
  const frameloop = reduced ? "demand" : inViewport && tabActive ? "always" : "never";

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        frameloop={frameloop}
        camera={{ position: [0, 3, 16], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#141312"]} />
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />

        <Starfield animate={animate} />
        <Core animate={animate} />
        {orbits.map((body) => (
          <Planet key={body.partner.id} body={body} animate={animate} />
        ))}
        <Mascot animate={animate} />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          rotateSpeed={0.4}
          autoRotate={animate}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
