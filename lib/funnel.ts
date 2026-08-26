// Funil de contratação — CAMINHO ÚNICO, 3 etapas.
// 1 Serviços (escolher) → 2 Contato (4 campos) → 3 Pronto (confirmação).
//
// Regra: NÃO existe segundo caminho de aquisição. /cadastro e /entrar são a porta
// do PORTAL, para quem já é cliente — nunca CTA de venda. Um cliente novo jamais
// deve topar com uma senha antes de falar com a QuBit.
export const funnelSteps = [
  { id: "servicos", label: "Serviços", path: "/servicos" },
  { id: "registro", label: "Contato", path: "/diagnostico" },
  { id: "pronto", label: "Pronto", path: "/obrigado" },
] as const;

export type FunnelStepId = (typeof funnelSteps)[number]["id"];

/** Início do funil — para onde apontam TODOS os CTAs de venda. */
export const FUNNEL_START = funnelSteps[0].path;

/** Etapa de contato — destino de quem já escolheu o que quer. */
export const FUNNEL_CONTACT = funnelSteps[1].path;
