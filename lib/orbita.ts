import sql from "@/lib/db";
import { areas } from "@/lib/auth-validation";
import type { Partner } from "@/content/partners";

/**
 * Empresas em órbita (constelação da home e /universo).
 * Regra: em_orbita = true E logo enviada → aparece automaticamente.
 * Resiliente: sem banco (ex.: build no Cloud Build) devolve [] e a página
 * se corrige na primeira revalidação em runtime.
 */
export async function getOrbitPartners(): Promise<Partner[]> {
  try {
    const rows = await sql<
      { id: string; nome_fantasia: string; area: string | null; logo_url: string | null; site_url: string | null }[]
    >`
      select id, nome_fantasia, area, logo_url, site_url
        from empresas
       where em_orbita = true and logo_url is not null
       order by created_at asc`;
    return rows.map((r) => ({
      id: r.id,
      name: r.nome_fantasia,
      sector: areas.find((a) => a.value === r.area)?.label ?? "Parceiro",
      url: r.site_url ?? "#",
      logo: r.logo_url ?? undefined,
    }));
  } catch (e) {
    console.error("[orbita] consulta falhou (build sem banco é esperado):", e);
    return [];
  }
}
