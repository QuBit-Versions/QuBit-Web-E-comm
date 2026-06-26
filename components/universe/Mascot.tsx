"use client";

import { useEffect, useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

/**
 * Mascote polvo — modelo 3D real (mascote_qubit.glb), modelado/riggado no Blender.
 * Clipes disponíveis no GLB: "idle" (flutua calmo), "swim" (propulsão), "spin", "blink".
 * Por padrão toca "idle" em loop; pisca de tempos em tempos sobre o idle.
 */
export function Mascot({ animate = true }: { animate?: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF("/mascote_qubit.glb");
  const { actions } = useAnimations(animations, group);
  const baseY = 2.4;

  // idle em loop (ou pose estática quando reduced-motion)
  useEffect(() => {
    const idle = actions["idle"];
    if (!idle) return;
    if (animate) {
      idle.reset().fadeIn(0.4).play();
    } else {
      // reduced-motion: congela na pose de descanso
      idle.reset().play();
      idle.paused = true;
    }
    return () => {
      idle.fadeOut(0.2);
    };
  }, [actions, animate]);

  // piscada ocasional sobre o idle (crossfade curto e volta)
  useEffect(() => {
    if (!animate) return;
    const blink = actions["blink"];
    const idle = actions["idle"];
    if (!blink || !idle) return;

    let timeout: ReturnType<typeof setTimeout>;
    let back: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timeout = setTimeout(() => {
        blink.reset();
        blink.setLoop(THREE.LoopOnce, 1);
        blink.clampWhenFinished = false;
        blink.play();
        blink.crossFadeFrom(idle, 0.25, false);
        back = setTimeout(() => {
          idle.reset().play();
          idle.crossFadeFrom(blink, 0.25, false);
        }, blink.getClip().duration * 1000);
        schedule();
      }, 4500 + Math.random() * 4000);
    };
    schedule();

    return () => {
      clearTimeout(timeout);
      clearTimeout(back);
    };
  }, [actions, animate]);

  return (
    <group ref={group} position={[0, baseY, 2]} scale={0.7}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/mascote_qubit.glb");
