"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/brand/Wordmark";

const navLinks = [
  { href: "/#solucao", label: "Solução" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/servicos", label: "Serviços" },
  { href: "/universo", label: "Universo" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-fast ${
          scrolled
            ? "border-line bg-[var(--glass-bg-strong)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="QuBit — página inicial" className="text-paper">
            <Wordmark className="h-9 w-auto text-paper" />
          </Link>

          <nav className="font-sans hidden md:flex items-center gap-8 text-sm text-text-2" aria-label="Principal">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-text-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink href="/servicos" size="sm" className="hidden md:inline-flex">
              Agendar diagnóstico
            </ButtonLink>
            <button
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col gap-1.5 p-2 min-w-[44px] min-h-[44px] items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-text rounded"
            >
              <span className={`block h-0.5 w-5 bg-text-1 transition-transform duration-fast ${menuOpen ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-5 bg-text-1 transition-opacity duration-fast ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-5 bg-text-1 transition-transform duration-fast ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`fixed inset-0 z-40 md:hidden transition-opacity duration-fast ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
        <nav
          aria-label="Menu móvel"
          className={`absolute top-16 left-0 right-0 bg-[var(--glass-bg-strong)] backdrop-blur-xl border-b border-line px-6 py-8 flex flex-col gap-6 transition-transform duration-fast ${
            menuOpen ? "translate-y-0" : "-translate-y-4"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-text-1 hover:text-text-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <ButtonLink href="/servicos" className="mt-2 w-full justify-center" onClick={() => setMenuOpen(false)}>
            Agendar diagnóstico
          </ButtonLink>
        </nav>
      </div>
    </>
  );
}
