import { partners, type Partner } from "@/content/partners";

export type OrbitBody = {
  partner: Partner;
  /** raio horizontal da elipse (X) */
  radiusX: number;
  /** raio de profundidade da elipse (Z) */
  radiusZ: number;
  /** velocidade angular (rad/s) — menor = mais lento */
  speed: number;
  /** ângulo inicial (rad) para espalhar os planetas */
  phase: number;
  /** inclinação vertical da órbita (Y) */
  tilt: number;
  /** tamanho do planeta */
  size: number;
  /** cor do planeta (acento do setor) */
  color: string;
};

const sectorColors: Record<string, string> = {
  Moda: "#FF6FB5",
  Suplementos: "#5BE3A6",
  Petshop: "#FFB454",
  "Eletrônicos": "#6FA8FF",
  Beleza: "#FF8AD4",
  "Café & Alimentos": "#C98A4B",
  Papelaria: "#8AA0FF",
  "Casa & Decoração": "#E3C65B",
  Fitness: "#5BD6E3",
  "Educação": "#B98AFF",
};

/** Distribui os parceiros em órbitas elípticas escalonadas ao redor do núcleo QuBit. */
export const orbits: OrbitBody[] = partners.map((partner, i) => {
  const ring = Math.floor(i / 3); // 3 planetas por anel
  const baseRadius = 4 + ring * 2.6;
  return {
    partner,
    radiusX: baseRadius + (i % 3) * 0.6,
    radiusZ: baseRadius * 0.7 + (i % 3) * 0.4,
    speed: 0.12 - ring * 0.02,
    phase: (i / partners.length) * Math.PI * 2,
    tilt: ((i % 4) - 1.5) * 0.4,
    size: 0.34 + (i % 3) * 0.06,
    color: sectorColors[partner.sector] ?? "#8AA0FF",
  };
});

export const universe_copy = {
  eyebrow: "O universo QuBit",
  h1: "Empresas que já orbitam a QuBit.",
  sub: "Cada planeta é um negócio que cresce com a gente. Passe o mouse, explore, e veja onde a sua marca pode entrar.",
  fallbackTitle: "Parceiros QuBit",
  ctaPrimary: "Quero fazer parte",
  hint: "Arraste para girar · passe o mouse nos planetas",
  invite: "Sua marca pode orbitar aqui →",
  inviteSub: "Agende um diagnóstico e entre no universo.",
};
