"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Sistema de partículas (GPU) reutilizável — a base visual do universo QuBit.
 *
 * PROFUNDIDADE por paralaxe de movimento (warp suave): cada partícula viaja em
 * direção à câmera e RECICLA no fundo (wraparound) — as próximas correm e crescem,
 * as distantes mal se mexem. A reciclagem é feita no vertex shader (sem laço de
 * CPU): guardamos a distância inicial em `position.z` e ela "anda" com o tempo.
 *
 * Além disso, cada partícula carrega `aShape` (alvo de uma FORMA). O shader
 * interpola disperso↔forma por `uMorph` → "as partículas formam a marca".
 *
 * - tamanho por perspectiva (perto = grande, longe = minúsculo) + cintilação;
 * - `fog` + fade nas bordas do volume dissolvem near/far → sem "pop" ao reciclar;
 * - cores vêm dos tokens (--paper / --brand).
 *
 * `shapeSrc` (PNG/SVG) é amostrado em pontos no cliente p/ formar a arte da marca.
 */

const NEAR_D = 16; // distância mínima da câmera (perto)
const FAR_D = 150; // distância máxima (longe, some no fog)

const VERT = /* glsl */ `
  uniform float uTime;
  uniform float uTravel;
  uniform float uMorph;
  uniform float uSize;
  uniform float uNearD;
  uniform float uFarD;
  uniform float uCameraZ;
  uniform float uFogNear;
  uniform float uFogFar;

  attribute vec3 aShape;   // alvo de forma (marca)
  attribute float aScale;
  attribute float aSeed;
  attribute vec3 aColor;

  varying vec3 vColor;
  varying float vFog;
  varying float vTw;
  varying float vFade;

  void main() {
    vColor = aColor;

    // position.xy = posição no mundo (fixa); position.z = distância inicial.
    // uTravel (distância acumulada na CPU) "anda" e recicla via mod() → warp.
    // Como uTravel integra a velocidade atual, o scroll pode acelerar/reverter sem saltos.
    float range = uFarD - uNearD;
    float dist = uNearD + mod(position.z - uTravel - uNearD, range);

    // morph reduz a viagem (forma estável) e puxa para o alvo
    float m = smoothstep(0.0, 1.0, uMorph);
    vec3 amb = vec3(position.x, position.y, uCameraZ - dist);
    vec3 p = mix(amb, aShape, m);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float vdist = -mv.z;

    float ps = uSize * aScale * (140.0 / max(vdist, 1.0));
    gl_PointSize = clamp(ps, 0.5, 18.0);

    vFog = clamp((uFogFar - vdist) / (uFogFar - uFogNear), 0.0, 1.0);
    vTw = 0.6 + 0.4 * sin(uTime * 2.0 + aSeed * 30.0);
    // fade de entrada (perto do fundo) e saída (perto da câmera) p/ não pipocar
    vFade = smoothstep(uNearD, uNearD + 12.0, dist) * (1.0 - smoothstep(uFarD - 28.0, uFarD, dist));
    // durante o morph, ignora o fade da viagem
    vFade = mix(vFade, 1.0, m);

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vFog;
  varying float vTw;
  varying float vFade;

  void main() {
    // ponto NÍTIDO (não borrão): falloff concentrado no centro
    float d = length(gl_PointCoord - vec2(0.5));
    float a = pow(smoothstep(0.5, 0.0, d), 2.5);
    if (a <= 0.002) discard;
    gl_FragColor = vec4(vColor * vFog, a * uOpacity * vFog * vTw * vFade);
  }
`;

export type Props = {
  count?: number;
  shapeSrc?: string; // imagem amostrada p/ a forma (marca)
  shapeSize?: number; // largura aprox. da forma em unidades de cena
  morph?: number; // alvo de morph (0..1) — interpolado internamente
  animate?: boolean;
  size?: number;
  opacity?: number; // brilho de cada partícula (additive)
  speed?: number; // velocidade do warp (unidades/s) — 0 = parado
  speedRef?: React.MutableRefObject<number>; // velocidade dinâmica (ex.: scroll) — sobrepõe `speed`
  fog?: [near: number, far: number];
  cameraZ?: number; // Z da câmera (p/ encher o frustum)
  fov?: number; // campo de visão vertical da câmera (graus)
};

export function ParticleField({
  count = 5000,
  shapeSrc,
  shapeSize = 26,
  morph = 0,
  animate = true,
  size = 1.4,
  opacity = 0.55,
  speed = 3.5,
  speedRef,
  fog = [40, 150],
  cameraZ = 60,
  fov = 60,
}: Props) {
  const ref = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const morphTarget = useRef(morph);
  morphTarget.current = morph;

  const palette = useMemo(() => {
    const css = getComputedStyle(document.documentElement);
    return {
      paper: new THREE.Color(css.getPropertyValue("--paper").trim() || "#F5F1E8"),
      brand: new THREE.Color(css.getPropertyValue("--brand").trim() || "#2B4DFF"),
    };
  }, []);

  const { positions, shape, scales, seeds, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const shape = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const seeds = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    const aspect = typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1.7;
    const fovRad = (fov * Math.PI) / 180;

    for (let i = 0; i < count; i++) {
      // distância inicial uniforme no volume; x/y enchem o frustum ÀQUELA distância
      const dist0 = NEAR_D + Math.random() * (FAR_D - NEAR_D);
      const hh = Math.tan(fovRad / 2) * dist0;
      const hw = hh * aspect;
      positions[i * 3] = (Math.random() * 2 - 1) * hw * 1.1; // worldX (fixo)
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * hh * 1.1; // worldY (fixo)
      positions[i * 3 + 2] = dist0; // distância inicial (anda no shader)

      // alvo de forma padrão: esfera (sobrescrito por shapeSrc)
      const sr = shapeSize * 0.5;
      const st = Math.random() * Math.PI * 2;
      const sp = Math.acos(2 * Math.random() - 1);
      shape[i * 3] = sr * Math.sin(sp) * Math.cos(st);
      shape[i * 3 + 1] = sr * Math.cos(sp);
      shape[i * 3 + 2] = sr * Math.sin(sp) * Math.sin(st) * 0.6;

      scales[i] = 0.4 + Math.pow(Math.random(), 2) * 1.7; // muitas pequenas, poucas grandes
      seeds[i] = Math.random();
      const col = Math.random() < 0.1 ? palette.brand : palette.paper;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }
    return { positions, shape, scales, seeds, colors };
  }, [count, shapeSize, palette, fov]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uTravel: { value: 0 },
      uMorph: { value: morph },
      uSize: { value: size },
      uNearD: { value: NEAR_D },
      uFarD: { value: FAR_D },
      uCameraZ: { value: cameraZ },
      uOpacity: { value: opacity },
      uFogNear: { value: fog[0] },
      uFogFar: { value: fog[1] },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Amostra a imagem da marca em pontos e sobrescreve `aShape`
  useEffect(() => {
    if (!shapeSrc || !ref.current) return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = shapeSrc;
    img.onload = () => {
      if (cancelled || !ref.current) return;
      const S = 220;
      const c = document.createElement("canvas");
      c.width = c.height = S;
      const ctx = c.getContext("2d");
      if (!ctx) return;
      const ar = img.width / img.height;
      let dw = S, dh = S;
      if (ar > 1) dh = S / ar;
      else dw = S * ar;
      ctx.drawImage(img, (S - dw) / 2, (S - dh) / 2, dw, dh);
      const data = ctx.getImageData(0, 0, S, S).data;

      const hits: number[] = [];
      for (let y = 0; y < S; y += 1) {
        for (let x = 0; x < S; x += 1) {
          if (data[(y * S + x) * 4 + 3] > 130) hits.push(x, y);
        }
      }
      if (hits.length < 2) return;

      const shapeAttr = ref.current.geometry.attributes.aShape as THREE.BufferAttribute;
      const arr = shapeAttr.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const k = Math.floor(Math.random() * (hits.length / 2)) * 2;
        arr[i * 3] = (hits[k] / S - 0.5) * shapeSize;
        arr[i * 3 + 1] = -(hits[k + 1] / S - 0.5) * shapeSize;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      }
      shapeAttr.needsUpdate = true;
    };
    return () => {
      cancelled = true;
    };
  }, [shapeSrc, count, shapeSize]);

  useFrame((_, delta) => {
    // muta o objeto de uniforms DO MATERIAL (não o local) → garante upload no GPU
    const u = matRef.current?.uniforms;
    if (!u) return;
    const d = Math.min(delta, 0.05);
    // velocidade dinâmica (scroll) tem prioridade sobre a base
    const currentSpeed = speedRef ? speedRef.current : speed;
    if (animate) {
      u.uTime.value += d; // cintilação
      u.uTravel.value += d * currentSpeed; // warp (acelera/reverte com o scroll)
    }
    u.uMorph.value += (morphTarget.current - u.uMorph.value) * Math.min(1, d * 2.5);
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aShape" args={[shape, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
