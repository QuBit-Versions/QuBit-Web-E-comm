import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase (publishable/anon key). Usado no servidor para gravar leads.
 * A key é pública por design; o que protege os dados é o RLS (insert-only para
 * anon, sem SELECT). Retorna null se as variáveis não estiverem configuradas,
 * para não quebrar build/dev quando o Supabase ainda não foi ligado.
 */
let cached: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  cached = url && key ? createClient(url, key, { auth: { persistSession: false } }) : null;
  return cached;
}
