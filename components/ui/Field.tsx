import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";
import { AlertCircle } from "lucide-react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

type InputFieldProps = FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "id">;
type TextareaFieldProps = FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id">;

// Aurora Glass: input de vidro translúcido; foco acende o halo de marca.
const inputBase =
  "font-sans w-full bg-[var(--glass-bg)] backdrop-blur-md border border-line rounded-xl px-4 py-3 min-h-12 text-text-1 placeholder:text-text-3 transition-all duration-fast focus:outline-none focus:border-brand-text focus:[box-shadow:var(--glow-brand)] aria-[invalid=true]:border-danger aria-[invalid=true]:focus:[box-shadow:0_0_24px_-2px_color-mix(in_srgb,var(--danger)_55%,transparent)]";

/** Label compartilhado. */
function FieldLabel({ id, label, required }: { id: string; label: string; required?: boolean }) {
  return (
    <label htmlFor={id} className="text-sm font-medium text-text-1">
      {label}
      {required && <span className="text-brand-text ml-1" aria-hidden>*</span>}
    </label>
  );
}

/** Erro: token --danger + ícone (cor nunca sozinha — §3.2). */
function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} role="alert" className="flex items-center gap-1.5 text-xs text-danger mt-0.5">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  );
}

export const Field = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, hint, error, className = "", required, ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <FieldLabel id={id} label={label} required={required} />
        {hint && <p id={hintId} className="text-xs text-text-3">{hint}</p>}
        <input
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          className={inputBase}
          {...props}
        />
        {error && <FieldError id={errorId} message={error} />}
      </div>
    );
  }
);
Field.displayName = "Field";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaFieldProps>(
  ({ label, hint, error, className = "", required, ...props }, ref) => {
    const id = useId();
    const errorId = `${id}-error`;
    const hintId = `${id}-hint`;
    const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <FieldLabel id={id} label={label} required={required} />
        {hint && <p id={hintId} className="text-xs text-text-3">{hint}</p>}
        <textarea
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          aria-required={required}
          className={`${inputBase} resize-y min-h-[120px]`}
          {...props}
        />
        {error && <FieldError id={errorId} message={error} />}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
