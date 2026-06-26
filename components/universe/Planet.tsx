"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitBody } from "@/content/universe";

interface PlanetProps {
  body: OrbitBody;
  animate?: boolean;
  /** posição angular fixa quando não anima (reduced motion) */
}

export function Planet({ body, animate = true }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const angleRef = useRef(body.phase);
  const [hovered, setHovered] = useState(false);

  // posição inicial estática (usada no primeiro frame e no modo reduzido)
  const setPosition = (angle: number) => {
    if (!groupRef.current) return;
    groupRef.current.position.set(
      Math.cos(angle) * body.radiusX,
      Math.sin(angle) * body.tilt,
      Math.sin(angle) * body.radiusZ
    );
  };

  setPosition(angleRef.current);

  useFrame((_, delta) => {
    if (animate) {
      angleRef.current += delta * body.speed;
      setPosition(angleRef.current);
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      const target = hovered ? 1.35 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
  });

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
      >
        <icosahedronGeometry args={[body.size, 1]} />
        <meshStandardMaterial
          color={body.color}
          emissive={body.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.5}
          metalness={0.2}
          flatShading
        />
      </mesh>

      {/* Rótulo HTML — link real, focável, acessível */}
      <Html
        center
        distanceFactor={10}
        position={[0, body.size + 0.5, 0]}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: hovered ? "auto" : "none" }}
      >
        <a
          href={body.partner.url}
          target={body.partner.url.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          aria-label={`${body.partner.name} — ${body.partner.sector}`}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
          className={`block whitespace-nowrap px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-200 ${
            hovered
              ? "bg-ink/95 border-line text-text-1 opacity-100"
              : "bg-ink/70 border-transparent text-text-2 opacity-0"
          }`}
          style={{ pointerEvents: "auto" }}
        >
          {body.partner.name}
          <span className="block text-[10px] text-text-3 font-normal">{body.partner.sector}</span>
        </a>
      </Html>
    </group>
  );
}
