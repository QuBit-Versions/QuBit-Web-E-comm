"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MailCheck } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { cadastroSchema, type CadastroData } from "@/lib/auth-validation";

function traduzErro(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists"))
    return "Esse e-mail já tem uma conta. Tente entrar.";
  if (m.includes("password")) return "Senha muito curta — use ao menos 8 caracteres.";
  if (m.includes("rate") || m.includes("too many")) return "Muitas tentativas. Aguarde um instante e tente de novo.";
  return "Não conseguimos criar a conta agora. Tente de novo em instantes.";
}

export function CadastroForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CadastroData>({ resolver: zodResolver(cadastroSchema), mode: "onBlur" });

  const onSubmit = async (data: CadastroData) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.senha,
      options: {
        data: {
          nome_empresa: data.nome_empresa,
          cnpj: data.cnpj ?? "",
          responsavel: data.responsavel,
          whatsapp: data.whatsapp,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/painel`,
      },
    });
    if (error) {
      setError("root", { message: traduzErro(error.message) });
      return;
    }
    setSentTo(data.email);
  };

  if (sentTo) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center mx-auto mb-6 [box-shadow:var(--glow-brand)]">
          <MailCheck className="w-8 h-8 text-brand-text" aria-hidden />
        </div>
        <h2 className="text-h3 text-text-1 mb-3">Confirme seu e-mail</h2>
        <p className="text-text-2 mb-2">
          Enviamos um link de ativação para <span className="text-text-1 font-medium">{sentTo}</span>.
        </p>
        <p className="text-sm text-text-3">
          Clique no link para ativar a conta e acessar o portal. Não chegou? Veja a caixa de spam.
        </p>
        <p className="text-sm text-text-3 mt-6">
          Já confirmou?{" "}
          <Link href="/entrar" className="text-brand-text hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-label="Cadastro de empresa parceira">
      <Field
        label="Nome da empresa"
        placeholder="Como sua empresa se chama?"
        autoComplete="organization"
        required
        error={errors.nome_empresa?.message}
        {...register("nome_empresa")}
      />

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="CNPJ" hint="Opcional" placeholder="00.000.000/0001-00" error={errors.cnpj?.message} {...register("cnpj")} />
        <Field
          label="Responsável"
          placeholder="Com quem falamos?"
          autoComplete="name"
          required
          error={errors.responsavel?.message}
          {...register("responsavel")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="WhatsApp"
          type="tel"
          placeholder="(21) 99999-9999"
          autoComplete="tel"
          required
          error={errors.whatsapp?.message}
          {...register("whatsapp")}
        />
        <Field
          label="E-mail"
          type="email"
          placeholder="voce@empresa.com.br"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <Field
        label="Senha"
        type="password"
        hint="Mínimo de 8 caracteres"
        autoComplete="new-password"
        required
        error={errors.senha?.message}
        {...register("senha")}
      />

      {errors.root && (
        <div role="alert" className="flex items-start gap-3 p-4 border border-danger/30 bg-danger/5 rounded-xl">
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-text-2">{errors.root.message}</p>
        </div>
      )}

      <Button type="submit" size="lg" loading={isSubmitting} className="w-full justify-center">
        Criar conta da empresa
      </Button>

      <p className="text-sm text-text-3 text-center">
        Já tem conta?{" "}
        <Link href="/entrar" className="text-brand-text hover:underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
