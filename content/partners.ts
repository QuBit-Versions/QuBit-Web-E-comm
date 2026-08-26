export type Partner = {
  id: string;
  name: string;
  sector: string;
  url: string;
  logo?: string;
};

// Os parceiros agora vêm do BANCO (empresas com em_orbita + logo_url):
// - servidor: lib/orbita.ts (getOrbitPartners)
// - cliente:  GET /api/orbita
// Este arquivo mantém apenas o tipo compartilhado.
