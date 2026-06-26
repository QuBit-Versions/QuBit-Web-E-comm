"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Plus } from "lucide-react";
import { Field, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { createSupabaseBrowser } from "@/lib/supabaseBrowser";
import { demandaSchema, type DemandaData } from "@/lib/auth-validation";

export function NovaDemandaForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<DemandaData>({ resolver: zodResolver(demandaSchema), mode: "onBlur" });

  const onSubmit = async (data: DemandaData) => {
    const supabase = createSupabaseBrowser();
    const { error } = await supabase
      .from("demandas")
      .insert({ empresa_id: userId, titulo: data.titulo, descricao: data.descricao ?? null });
    if (error) {
      setError("root", { message: "Não foi possível enviar a demanda. Tente de novo." });
      return;
    }
    reset();
    setOpen(false);
    router.refresh();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="lg">
        <Plus className="w-4 h-4" aria-hidden strokeWidth={2.5} /> Nova demanda
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="surface-glass rounded-2xl p-6 md:p-7 space-y-5" aria-label="Nova demanda">
      <Field label="Título" placeholder="Ex.: Integrar pagamento na loja" required error={errors.titulo?.message} {...register("titulo")} />
      <Textarea
        label="Descrição"
        hint="Opcional — quanto mais contexto, melhor."
        placeholder="O que você precisa, onde está hoje, prazos…"
        rows={4}
        error={errors.descricao?.message}
        {...register("descricao")}
      />
      {errors.root && (
        <div role="alert" className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
          {errors.root.message}
        </div>
      )}
      <div className="flex gap-3">
        <Button type="submit" loading={isSubmitting}>
          Enviar demanda
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
