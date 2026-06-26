import { z } from "zod";
import { segmentos } from "@/lib/validation";

// "Área da empresa" reaproveita a lista de segmentos do diagnóstico.
export const areas = segmentos;

export const cadastroSchema = z.object({
  nome_fantasia: z.string().trim().min(2, "Qual o nome fantasia da empresa?"),
  cnpj: z.string().trim().optional(),
  responsavel: z.string().trim().min(2, "Quem é o responsável pelo contato?"),
  area: z.string().trim().min(1, "Qual a área da empresa?"),
  regiao: z.string().trim().min(2, "De qual cidade/estado?"),
  telefone: z
    .string()
    .trim()
    .min(1, "Deixe um telefone para a gente falar com você")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Parece faltar um número — inclua o DDD"),
  email: z.string().trim().min(1, "Em qual e-mail você acessa?").email("Esse e-mail parece incompleto"),
  senha: z.string().min(8, "Use ao menos 8 caracteres"),
});

export type CadastroData = z.infer<typeof cadastroSchema>;

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Seu e-mail").email("E-mail incompleto"),
  senha: z.string().min(1, "Sua senha"),
});

export type LoginData = z.infer<typeof loginSchema>;

export const demandaSchema = z.object({
  titulo: z.string().trim().min(3, "Dê um título para a demanda"),
  descricao: z.string().trim().max(2000, "Descrição um pouco longa demais").optional(),
});

export type DemandaData = z.infer<typeof demandaSchema>;
