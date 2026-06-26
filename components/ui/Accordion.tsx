"use client";

import { createContext, useContext, useState, useId, ReactNode } from "react";

interface AccordionContextValue {
  openId: string | null;
  toggle: (id: string) => void;
  prefix: string;
}

const AccordionCtx = createContext<AccordionContextValue | null>(null);

interface AccordionProps {
  children: ReactNode;
  defaultOpen?: string;
  className?: string;
}

export function Accordion({ children, defaultOpen, className = "" }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpen ?? null);
  const prefix = useId();
  return (
    <AccordionCtx.Provider value={{ openId, toggle: (id) => setOpenId((prev) => (prev === id ? null : id)), prefix }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionCtx.Provider>
  );
}

interface AccordionItemProps {
  id: string;
  question: ReactNode;
  children: ReactNode;
}

export function AccordionItem({ id, question, children }: AccordionItemProps) {
  const ctx = useContext(AccordionCtx);
  if (!ctx) throw new Error("AccordionItem must be inside Accordion");
  const { openId, toggle, prefix } = ctx;
  const isOpen = openId === id;
  const triggerId = `${prefix}-trigger-${id}`;
  const panelId = `${prefix}-panel-${id}`;

  return (
    <div
      className={`surface-glass rounded-2xl overflow-hidden transition-shadow duration-300 ${
        isOpen ? "glow-aurora" : ""
      }`}
    >
      <h3>
        <button
          id={triggerId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => toggle(id)}
          className="w-full flex items-center justify-between px-6 py-5 text-left text-text-1 font-medium cursor-pointer hover:[background:var(--glass-bg-strong)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-text"
        >
          <span>{question}</span>
          <span
            className="shrink-0 ml-4 text-text-3 text-xl transition-transform duration-200"
            style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
            aria-hidden
          >
            +
          </span>
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className="px-6 pb-5 text-text-2"
      >
        {children}
      </div>
    </div>
  );
}
