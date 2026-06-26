"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente Supabase para o NAVEGADOR (auth do portal de parceiros).
 * Sessão por cookie via @supabase/ssr → funciona com server components e
 * middleware de proteção de rota.
 */
export function createSupabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
