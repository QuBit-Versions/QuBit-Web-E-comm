"use client";

import { createContext, useCallback, useContext, useState } from "react";

type SelectionValue = {
  selected: string[];
  toggle: (id: string) => void;
  isSelected: (id: string) => boolean;
  clear: () => void;
};

const SelectionCtx = createContext<SelectionValue | null>(null);

/** Guarda quais serviços o cliente marcou como de interesse na /servicos. */
export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isSelected = useCallback((id: string) => selected.includes(id), [selected]);
  const clear = useCallback(() => setSelected([]), []);

  return (
    <SelectionCtx.Provider value={{ selected, toggle, isSelected, clear }}>
      {children}
    </SelectionCtx.Provider>
  );
}

/** Retorna o contexto de seleção, ou null fora do provider (ex.: /proposta). */
export function useSelection() {
  return useContext(SelectionCtx);
}
