import { z } from "zod";

/** Segmentos do negócio — §5.3 (select). Reflete o público diverso do §1. */
export const segmentos = [
  { value: "moda", label: "Moda & acessórios" },
  { value: "suplementos", label: "Suplementos & saúde" },
  { value: "petshop", label: "Petshop" },
  { value: "eletronicos", label: "Eletrônicos" },
  { value: "beleza", label: "Beleza & cosméticos" },
  { value: "alimentos", label: "Alimentos & bebidas" },
  { value: "casa", label: "Casa & decoração" },
  { value: "fitness", label: "Fitness & esporte" },
  { value: "educacao", label: "Educação & cursos" },
  { value: "servicos", label: "Serviços" },
  { value: "outro", label: "Outro" },
] as const;

const segmentoValues = segmentos.map((s) => s.value) as [string, ...string[]];

// Mensagens humanas (§8) — nunca "campo inválido" genérico.
export const diagnosticoSchema = z.object({
  nome: z.string().trim().min(2, "Como podemos te chamar?"),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Deixe um número para a gente falar com você")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Parece faltar um número aqui — inclua o DDD"),
  email: z
    .string()
    .trim()
    .min(1, "Em qual e-mail podemos responder?")
    .email("Esse e-mail parece incompleto"),
  segmento: z.enum(segmentoValues, { error: "Conta pra gente o ramo do seu negócio" }),
  mensagem: z.string().trim().max(1000, "Mensagem um pouco longa demais").optional(),
  // Soluções marcadas em /servicos (vêm via ?interesse=ids) — opcional.
  interesses: z.array(z.string()).optional(),
});

export type DiagnosticoData = z.infer<typeof diagnosticoSchema>;
