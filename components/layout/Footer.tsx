import Link from "next/link";
import { site } from "@/content/copy";
import { Wordmark } from "@/components/brand/Wordmark";

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
          <p className="text-sm text-text-3">CNPJ {site.cnpj}</p>
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
