// Funil de contratação (3 etapas) — fonte única do fluxo e do stepper.
// 1 Serviços (escolher) → 2 Registro (dados + envio) → 3 Pronto (confirmação).
export const funnelSteps = [
  { id: "servicos", label: "Serviços", path: "/servicos" },
  { id: "registro", label: "Registro", path: "/diagnostico" },
  { id: "pronto", label: "Pronto", path: "/obrigado" },
] as const;

export type FunnelStepId = (typeof funnelSteps)[number]["id"];

/** Início do funil — para onde os CTAs "Agendar diagnóstico" apontam. */
export const FUNNEL_START = funnelSteps[0].path;
