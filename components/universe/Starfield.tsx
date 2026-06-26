"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 600;

export function Starfield({ animate = true }: { animate?: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const stars = useMemo(() => {
    const arr: { pos: THREE.Vector3; scale: number }[] = [];
    for (let i = 0; i < COUNT; i++) {
      // distribui numa casca esférica ao redor da cena
      const r = 22 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr.push({
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi),
          r * Math.sin(phi) * Math.sin(theta)
        ),
        scale: 0.02 + Math.random() * 0.06,
      });
    }
    return arr;
  }, []);

  // posiciona as instâncias uma única vez, após o mount
  useLayoutEffect(() => {
    if (!meshRef.current) return;
    stars.forEach((s, i) => {
      dummy.position.copy(s.pos);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [stars, dummy]);

  useFrame((_, delta) => {
    if (!animate || !meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.01;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#EDE8DC" toneMapped={false} />
    </instancedMesh>
  );
}
