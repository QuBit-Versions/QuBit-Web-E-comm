import Link from "next/link";
import { Mail } from "lucide-react";
import { site, socials } from "@/content/copy";
import { Wordmark } from "@/components/brand/Wordmark";

// Ícones de marca em SVG próprio (lucide removeu os de marca por trademark).
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden className={className}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231zm-1.16 17.52h1.833L7.084 4.126H5.117l11.967 15.644z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  );
}

const socialIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: InstagramIcon,
  x: XIcon,
  linkedin: LinkedinIcon,
  email: Mail,
};

const footerLinks = [
  { href: "/#solucao", label: "Solução" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/servicos", label: "Serviços" },
  { href: "/universo", label: "Universo" },
  { href: "/diagnostico", label: "Diagnóstico" },
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos" },
];

export function Footer() {
  return (
    <footer className="border-t border-line px-6 py-12">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div>
          <Link href="/" aria-label="QuBit — página inicial" className="inline-block mb-4">
            <Wordmark className="h-6 w-auto text-paper" />
          </Link>
          <p className="text-sm text-text-3">{site.city}</p>
          <p className="text-sm text-text-3 mb-5">CNPJ {site.cnpj}</p>

          <ul className="flex items-center gap-3" aria-label="Redes sociais">
            {socials.map((s) => {
              const Icon = socialIcon[s.id];
              const external = s.href.startsWith("http");
              return (
                <li key={s.id}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    title={s.label}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="w-10 h-10 inline-flex items-center justify-center rounded-xl surface-glass text-text-2 hover:text-text-1 hover:border-brand-text hover:[box-shadow:var(--glow-brand)] transition-all"
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <nav aria-label="Rodapé" className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-text-2">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-text-1 transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-mono-label text-text-3 self-end">{site.footerSignature}</p>
      </div>
    </footer>
  );
}
