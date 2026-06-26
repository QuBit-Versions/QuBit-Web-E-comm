"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Core({ animate = true }: { animate?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (!animate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.15;
  });

  return (
    <group ref={groupRef}>
      {/* núcleo */}
      <mesh>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#2B4DFF"
          emissive="#2B4DFF"
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.4}
          flatShading
        />
      </mesh>
      {/* halo */}
      <mesh>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshBasicMaterial color="#8AA0FF" transparent opacity={0.08} />
      </mesh>
      {/* luz emitida pelo núcleo */}
      <pointLight color="#6FA8FF" intensity={3} distance={30} />
    </group>
  );
}
