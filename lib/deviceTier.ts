// Detecção de capacidade do aparelho → escolhe a qualidade do fundo 3D.
//  high   = campo completo (6000 partículas, meteoros)
//  medium = campo magro   (2500, sem meteoros, dpr menor)
//  low    = sem 3D, fundo estático em CSS (GPU por software, pouca RAM/CPU,
//           Save-Data, sem WebGL) — garante desempenho onde mais importa.
export type DeviceTier = "high" | "medium" | "low";

export function detectDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "high";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  // Economia de dados → o mais leve possível
  if (nav.connection?.saveData) return "low";

  // Sem WebGL ou GPU por software (SwiftShader/llvmpipe/headless) → estático
  const gpu = readGpu();
  if (gpu === "none" || gpu === "software") return "low";

  const mem = nav.deviceMemory ?? 4; // GB (Chrome; default conservador 4)
  const cores = navigator.hardwareConcurrency ?? 4;
  const mobile = window.matchMedia("(max-width: 767px)").matches;

  if (mem <= 2 || cores <= 2) return "low";
  if (mobile || mem <= 4 || cores <= 4) return "medium";
  return "high";
}

function readGpu(): "none" | "software" | "hardware" {
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return "none";
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (!dbg) return "hardware"; // sem info → assume hardware (não penaliza)
    const renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "").toLowerCase();
    return /swiftshader|llvmpipe|software|basic render|microsoft basic|mesa offscreen/.test(renderer)
      ? "software"
      : "hardware";
  } catch {
    return "hardware";
  }
}
