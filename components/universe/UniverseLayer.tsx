"use client";

import { OrbitControls } from "@react-three/drei";
import { orbits } from "@/content/universe";
import { Core } from "./Core";
import { Planet } from "./Planet";

/**
 * Camada de conteúdo do /universo — entra DENTRO do mesmo canvas global das
 * partículas (sem canvas separado). Os planetas/núcleo são escalados para a
 * câmera afastada do fundo (z≈60), orbitando dentro da nuvem de partículas.
 */
export function UniverseLayer({ animate }: { animate: boolean }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={0.7} />

      <group scale={2.2}>
        <Core animate={animate} />
        {orbits.map((body) => (
          <Planet key={body.partner.id} body={body} animate={animate} />
        ))}
      </group>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
        rotateSpeed={0.4}
        autoRotate={animate}
        autoRotateSpeed={0.3}
      />
    </>
  );
}
