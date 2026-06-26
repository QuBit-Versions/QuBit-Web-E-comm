import { z } from "zod";

// Mensagens humanas (mesmo tom do formulário de diagnóstico).
export const cadastroSchema = z.object({
  nome_empresa: z.string().trim().min(2, "Qual o nome da sua empresa?"),
  cnpj: z.string().trim().optional(),
  responsavel: z.string().trim().min(2, "Quem é o responsável pelo contato?"),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Deixe um WhatsApp para a gente falar com você")
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
