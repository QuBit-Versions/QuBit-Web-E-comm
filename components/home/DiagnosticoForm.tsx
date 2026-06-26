"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { AlertCircle, X } from "lucide-react";
import { Field, Textarea } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import { diagnosticoSchema, segmentos, type DiagnosticoData } from "@/lib/validation";
import { diagnostico_page, site } from "@/content/copy";

const selectBase =
  "font-sans w-full bg-[var(--glass-bg)] backdrop-blur-md border border-line rounded-xl px-4 py-3 min-h-12 text-text-1 transition-all duration-fast focus:outline-none focus:border-brand-text focus:[box-shadow:var(--glow-brand)] aria-[invalid=true]:border-danger appearance-none cursor-pointer";

type Interesse = { id: string; name: string };

export function DiagnosticoForm({ interesses = [] }: { interesses?: Interesse[] }) {
  const router = useRouter();
  const [chosen, setChosen] = useState<Interesse[]>(interesses);
  const whatsappUrl = `https://wa.me/${site.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(site.whatsappMessage)}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<DiagnosticoData>({
    resolver: zodResolver(diagnosticoSchema),
    mode: "onBlur", // validação inline no blur — §8
  });

  const onSubmit = async (data: DiagnosticoData) => {
    try {
      const payload = chosen.length ? { ...data, interesses: chosen.map((c) => c.name) } : data;
      const res = await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("server");
      router.push(diagnostico_page.successRedirect);
    } catch {
      // mantém os dados preenchidos e oferece retry + WhatsApp — §8
      setError("root", { message: diagnostico_page.errorMessage });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6" aria-label="Formulário de diagnóstico">
      {chosen.length > 0 && (
        <div className="surface-glass rounded-2xl p-5 [box-shadow:var(--glow-aurora-inset)]">
          <p className="text-sm text-text-2 mb-3">
            <span className="text-text-1 font-medium">Você marcou interesse em:</span> já vamos preparados.
          </p>
          <ul className="flex flex-wrap gap-2">
            {chosen.map((c) => (
              <li
                key={c.id}
                className="font-sans inline-flex items-center gap-1 text-sm bg-brand/10 border border-brand/30 text-brand-text rounded-full pl-3 pr-1 py-1"
              >
                {c.name}
                <button
                  type="button"
                  onClick={() => setChosen((s) => s.filter((x) => x.id !== c.id))}
                  aria-label={`Remover ${c.name}`}
                  className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-brand/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Field
        label="Seu nome"
        placeholder="Como podemos te chamar?"
        autoComplete="name"
        required
        error={errors.nome?.message}
        {...register("nome")}
      />

      <div className="grid sm:grid-cols-2 gap-6">
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

      {/* Segmento do negócio (select) — §5.3 */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="segmento" className="text-sm font-medium text-text-1">
          Segmento do negócio <span className="text-brand-text ml-1" aria-hidden>*</span>
        </label>
        <div className="relative">
          <select
            id="segmento"
            aria-invalid={errors.segmento ? true : undefined}
            aria-required
            defaultValue=""
            className={selectBase}
            {...register("segmento")}
          >
            <option value="" disabled>Escolha o ramo…</option>
            {segmentos.map((s) => (
              <option key={s.value} value={s.value} className="bg-surface-2">
                {s.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-3" aria-hidden>▾</span>
        </div>
        {errors.segmento && (
          <p role="alert" className="flex items-center gap-1.5 text-xs text-danger mt-0.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
            {errors.segmento.message}
          </p>
        )}
      </div>

      <Textarea
        label="Conta um pouco sobre o seu negócio"
        hint="Opcional — mas ajuda a gente a chegar mais preparado."
        placeholder="O que você vende, onde está hoje, o que gostaria de melhorar…"
        rows={4}
        error={errors.mensagem?.message}
        {...register("mensagem")}
      />

      {errors.root && (
        <div role="alert" className="flex items-start gap-3 p-4 border border-danger/30 bg-danger/5 rounded-lg">
          <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" aria-hidden />
          <p className="text-sm text-text-2 flex-1">{errors.root.message}</p>
          <ButtonLink
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="ghost"
            size="sm"
            className="shrink-0 text-brand-text"
          >
            WhatsApp →
          </ButtonLink>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Button type="submit" size="lg" loading={isSubmitting} disabled={isSubmitSuccessful} className="sm:flex-1">
          {diagnostico_page.submitLabel}
        </Button>
        <ButtonLink
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="ghost"
          size="lg"
          className="text-brand-text justify-center"
        >
          {diagnostico_page.whatsappFallback}
        </ButtonLink>
      </div>
    </form>
  );
}
