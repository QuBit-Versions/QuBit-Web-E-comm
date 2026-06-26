"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { Field } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { loginSchema, type LoginData } from "@/lib/auth-validation";

function traduz(msg: string) {
  const m = msg.toLowerCase();
  if (m.includes("invalid")) return "E-mail ou senha incorretos.";
  if (m.includes("not confirmed") || m.includes("confirm")) return "Confirme seu e-mail antes de entrar.";
  return "Não foi possível entrar agora. Tente de novo.";
}

export function LoginForm({ proximo = "/painel" }: { proximo?: string }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema), mode: "onBlur" });

  const onSubmit = async (data: LoginData) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email: data.email, password: data.senha });
    if (error) {
      setError("root", { message: traduz(error.message) });
      return;
    }
    router.push(proximo);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-label="Entrar no portal">
      <Field
        label="E-mail"
        type="email"
        placeholder="voce@empresa.com.br"
        autoComplete="email"
        required
        error={errors.email?.message}
        {...register("email")}
      />
      <Field
        label="Senha"
        type="password"
        autoComplete="current-password"
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
        Entrar
      </Button>

      <p className="text-sm text-text-3 text-center">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="text-brand-text hover:underline">
          Cadastrar empresa
        </Link>
      </p>
    </form>
  );
}
