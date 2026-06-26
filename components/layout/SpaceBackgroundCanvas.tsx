"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { ParticleField } from "@/components/universe/ParticleField";
import { UniverseLayer } from "@/components/universe/UniverseLayer";

const CAMERA_HOME = new THREE.Vector3(0, 0, 60);

/**
 * Fundo de universo global — cena Three.js (R3F) atrás de todo o conteúdo.
 *
 * A base é a `ParticleField` (sistema de partículas em shader, com morph). Aqui
 * ela roda no estado disperso (nuvem viva, giro lento, profundidade por fog), e
 * por cima passam estrelas cadentes 3D. A MESMA `ParticleField` é a base do
 * /universo — lá ela forma a marca e ganha planetas/núcleo (sem canvas separado).
 *
 * Carregado via dynamic import (ssr:false). prefers-reduced-motion → frameloop
 * "demand" (estático); aba oculta → "never" (não gasta GPU em background).
 */

const MAX_METEORS = 5;

type Palette = { paper: THREE.Color; brand: THREE.Color };

/** Sprite circular suave para a cabeça luminosa dos meteoros. */
function makeStarTexture(): THREE.Texture {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

type Meteor = {
  active: boolean;
  head: THREE.Vector3;
  dir: THREE.Vector3;
  speed: number;
  len: number;
  age: number;
  ttl: number;
  color: THREE.Color;
};

/** Estrelas cadentes 3D: rastro (lineSegments) + cabeça brilhante (points). */
function Meteors({ palette, texture, animate }: { palette: Palette; texture: THREE.Texture; animate: boolean }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const headRef = useRef<THREE.Points>(null);
  const timer = useRef(1 + Math.random() * 2.5);

  const meteors = useMemo<Meteor[]>(
    () =>
      Array.from({ length: MAX_METEORS }, () => ({
        active: false,
        head: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        speed: 0,
        len: 0,
        age: 0,
        ttl: 0,
        color: new THREE.Color(),
      })),
    []
  );

  const { linePos, lineCol, headPos, headCol } = useMemo(
    () => ({
      linePos: new Float32Array(MAX_METEORS * 2 * 3),
      lineCol: new Float32Array(MAX_METEORS * 2 * 3),
      headPos: new Float32Array(MAX_METEORS * 3),
      headCol: new Float32Array(MAX_METEORS * 3),
    }),
    []
  );

  const spawn = (m: Meteor) => {
    m.active = true;
    m.age = 0;
    m.ttl = 0.7 + Math.random() * 0.7;
    m.speed = 34 + Math.random() * 30;
    m.len = 7 + Math.random() * 12;
    // perto da câmera (z alto) p/ ficar nítido; cruza o céu na diagonal
    m.head.set((Math.random() * 2 - 1) * 38, 20 + Math.random() * 14, 36 + Math.random() * 14);
    const sideways = Math.random() < 0.5 ? -1 : 1;
    m.dir.set(sideways * (0.7 + Math.random() * 0.4), -(0.5 + Math.random() * 0.4), 0.1).normalize();
    m.color.copy(Math.random() < 0.2 ? palette.brand : palette.paper);
  };

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);

    if (animate) {
      timer.current -= d;
      if (timer.current <= 0) {
        const free = meteors.find((m) => !m.active);
        if (free) spawn(free);
        timer.current = 2.2 + Math.random() * 4.5;
      }
    }

    meteors.forEach((m, i) => {
      let env = 0;
      if (m.active && animate) {
        m.age += d;
        if (m.age >= m.ttl) m.active = false;
        else {
          m.head.addScaledVector(m.dir, m.speed * d);
          env = Math.sin((m.age / m.ttl) * Math.PI);
        }
      }
      const tail = m.head.clone().addScaledVector(m.dir, -m.len);
      linePos.set([m.head.x, m.head.y, m.head.z, tail.x, tail.y, tail.z], i * 6);
      lineCol.set([m.color.r * env, m.color.g * env, m.color.b * env, 0, 0, 0], i * 6);
      headPos.set([m.head.x, m.head.y, m.head.z], i * 3);
      const he = env * 1.2;
      headCol.set([m.color.r * he, m.color.g * he, m.color.b * he], i * 3);
    });

    if (lineRef.current) {
      const g = lineRef.current.geometry;
      (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (g.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (headRef.current) {
      const g = headRef.current.geometry;
      (g.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (g.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
  });

  return (
    <group>
      <lineSegments ref={lineRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[lineCol, 3]} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent depthWrite={false} toneMapped={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <points ref={headRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[headPos, 3]} />
          <bufferAttribute attach="attributes-color" args={[headCol, 3]} />
        </bufferGeometry>
        <pointsMaterial size={2.2} map={texture} vertexColors transparent depthWrite={false} sizeAttenuation toneMapped={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

/** Paralaxe de ponteiro: desloca o grupo levemente conforme o mouse. */
function ParallaxRig({ children, animate }: { children: React.ReactNode; animate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const tx = animate ? state.pointer.x * 3 : 0;
    const ty = animate ? state.pointer.y * 2 : 0;
    ref.current.position.x += (tx - ref.current.position.x) * 0.03;
    ref.current.position.y += (ty - ref.current.position.y) * 0.03;
  });
  return <group ref={ref}>{children}</group>;
}

/** Volta a câmera para a posição-base quando NÃO está no /universo (OrbitControls cede). */
function CameraHome({ active }: { active: boolean }) {
  useFrame(({ camera }) => {
    if (!active) return;
    camera.position.lerp(CAMERA_HOME, 0.06);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

const WARP_BASE = 14; // velocidade-base do warp (motion contínuo perceptível)

/**
 * Converte o SCROLL em velocidade do warp (escrita em `speedRef`, lida pela
 * ParticleField): rolar pra baixo faz as estrelas AVANÇAREM (mergulho pra frente),
 * pra cima as faz RECUAR. O impulso decai de volta à base quando o scroll para.
 *
 * Transladar um campo uniforme na vertical é quase invisível (sem estrutura p/
 * rastrear); modular o warp dá motion claramente perceptível e direcional.
 */
function ScrollWarp({
  active,
  impulseRef,
  speedRef,
}: {
  active: boolean;
  impulseRef: React.MutableRefObject<number>;
  speedRef: React.MutableRefObject<number>;
}) {
  const boost = useRef(0);
  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05);
    if (active) {
      boost.current += impulseRef.current * 0.5; // px de scroll → impulso de velocidade
      impulseRef.current = 0;
      boost.current *= Math.exp(-3.0 * d); // decai de volta à base
      boost.current = Math.max(-30, Math.min(70, boost.current));
    } else {
      boost.current += (0 - boost.current) * 0.1;
    }
    speedRef.current = WARP_BASE + boost.current;
  });
  return null;
}

export default function SpaceBackgroundCanvas({ tier = "high" }: { tier?: "medium" | "high" }) {
  const reduced = useReducedMotion();
  const animate = !reduced;
  const [tabActive, setTabActive] = useState(true);
  // Qualidade por capacidade do aparelho (lib/deviceTier)
  const heavy = tier === "high";
  const count = heavy ? 6000 : 2500;
  const pathname = usePathname();
  const universe = pathname === "/universo";

  // Motion por scroll na home: o delta de scroll alimenta o ScrollWarp, que
  // modula a velocidade do warp (estrelas avançam/recuam conforme o scroll).
  const scrollImpulse = useRef(0);
  const warpSpeed = useRef(WARP_BASE);
  useEffect(() => {
    if (pathname !== "/") return;
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      scrollImpulse.current += y - lastY; // delta de scroll → impulso
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const palette = useMemo<Palette>(() => {
    const css = getComputedStyle(document.documentElement);
    return {
      paper: new THREE.Color(css.getPropertyValue("--paper").trim() || "#F5F1E8"),
      brand: new THREE.Color(css.getPropertyValue("--brand").trim() || "#2B4DFF"),
    };
  }, []);
  const texture = useMemo(() => makeStarTexture(), []);

  useEffect(() => {
    const onVis = () => setTabActive(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const frameloop = reduced ? "demand" : tabActive ? "always" : "never";

  return (
    <Canvas
      frameloop={frameloop}
      camera={{ position: [0, 0, 60], fov: 60, near: 0.1, far: 160 }}
      gl={{ antialias: heavy, alpha: true, powerPreference: "low-power" }}
      dpr={heavy ? [1, 2] : [1, 1.5]}
    >
      <ScrollWarp active={!universe && animate} impulseRef={scrollImpulse} speedRef={warpSpeed} />
      <ParallaxRig animate={animate && !universe}>
        <ParticleField animate={animate} count={count} speedRef={warpSpeed} />
        {heavy && <Meteors palette={palette} texture={texture} animate={animate} />}
      </ParallaxRig>

      {/* No /universo, os planetas/núcleo entram NESTE mesmo canvas (sem canvas separado). */}
      {universe && <UniverseLayer animate={animate} />}
      <CameraHome active={!universe} />
    </Canvas>
  );
}
