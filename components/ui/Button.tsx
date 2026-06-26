import { forwardRef, ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: false;
}

interface AnchorProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href: string;
}

const base =
  "font-sans relative inline-flex items-center justify-center font-medium rounded-xl transition-all duration-fast ease-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-40 select-none";

// Identidade "Aurora Glass": primário com halo de marca; secundário em vidro.
const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-paper [box-shadow:var(--glow-brand)] hover:[box-shadow:var(--glow-brand-strong)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
  secondary:
    "surface-glass text-text-1 hover:border-text-2 hover:[background:var(--glass-bg-strong)] hover:-translate-y-px active:translate-y-0 active:scale-[0.98]",
  ghost: "text-text-2 hover:text-text-1 hover:bg-surface-1 active:scale-[0.98]",
};

// Medidas baseadas em ciência de UX (alvo de toque WCAG 2.5.5 ≥44px; Material ≥48px),
// padding em escala 8pt. sm=44 (piso WCAG) · md=48 (padrão Material) · lg=56 (CTA herói).
const sizes: Record<Size, string> = {
  sm: "h-11 px-5 text-sm gap-2 min-w-[44px]",
  md: "h-12 px-6 text-[15px] gap-2 min-w-[48px]",
  lg: "h-14 px-8 text-base gap-2.5 min-w-[56px]",
};

const Spinner = () => <Loader2 className="h-4 w-4 animate-spin" aria-hidden />;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, children, className = "", ...props }, ref) => {
    const classes = [base, variants[variant], sizes[size], className].join(" ");
    return (
      <button ref={ref} disabled={disabled || loading} className={classes} {...props}>
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export const ButtonLink = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ variant = "primary", size = "md", loading, children, className = "", ...props }, ref) => {
    const classes = [base, variants[variant], sizes[size], className].join(" ");
    return (
      <a ref={ref} className={classes} {...props}>
        {loading && <Spinner />}
        {children}
      </a>
    );
  }
);
ButtonLink.displayName = "ButtonLink";
