"use client";

import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  /** atraso em ms para escalonar elementos irmãos */
  delay?: number;
  className?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

/**
 * Revela o conteúdo ao entrar na viewport (uma vez).
 * O CSS `.reveal` já neutraliza o efeito sob prefers-reduced-motion.
 */
export function Reveal({ children, as: Tag = "div", delay = 0, className = "", ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const props: Record<string, unknown> = {
    ref,
    "data-visible": visible,
    className: `reveal ${className}`,
    style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    ...rest,
  };

  return createElement(Tag, props, children);
}
