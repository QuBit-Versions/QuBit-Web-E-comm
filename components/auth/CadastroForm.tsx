"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MailCheck } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { cadastroSchema, areas, type CadastroData } from "@/lib/auth-validation";

const selectBase =
  "font-sans w-full bg-[var(--glass-bg)] backdrop-blur-md border border-line rounded-xl px-4 py-3 min-h-12 text-text-1 transition-all duration-fast focus:outline-none focus:border-brand-text focus:[box-shadow:var(--glow-brand)] aria-[invalid=true]:border-danger appearance-none cursor-pointer";

function traduzErro(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("already registered") || m.includes("already exists")) return "Esse e-mail já tem uma conta. Tente entrar.";
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
          nome_fantasia: data.nome_fantasia,
          cnpj: data.cnpj ?? "",
          responsavel: data.responsavel,
          area: data.area,
          regiao: data.regiao,
          telefone: data.telefone,
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
        label="Nome fantasia"
        placeholder="Como sua empresa se chama?"
        autoComplete="organization"
        required
        error={errors.nome_fantasia?.message}
        {...register("nome_fantasia")}
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
        <div className="flex flex-col gap-1.5">
          <label htmlFor="area" className="text-sm font-medium text-text-1">
            Área da empresa <span className="text-brand-text ml-1" aria-hidden>*</span>
          </label>
          <div className="relative">
            <select id="area" defaultValue="" aria-invalid={errors.area ? true : undefined} className={selectBase} {...register("area")}>
              <option value="" disabled>Escolha a área…</option>
              {areas.map((a) => (
                <option key={a.value} value={a.value} className="bg-surface-2">
                  {a.label}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-3" aria-hidden>▾</span>
          </div>
          {errors.area && (
            <p role="alert" className="flex items-center gap-1.5 text-xs text-danger mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
              {errors.area.message}
            </p>
          )}
        </div>

        <Field
          label="Região"
          placeholder="Cidade / Estado"
          autoComplete="address-level2"
          required
          error={errors.regiao?.message}
          {...register("regiao")}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Telefone"
          type="tel"
          placeholder="(21) 99999-9999"
          autoComplete="tel"
          required
          error={errors.telefone?.message}
          {...register("telefone")}
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

      <p className="text-xs text-text-3">A logo da empresa você envia depois, já dentro do painel.</p>

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
