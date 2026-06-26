export type Partner = {
  id: string;
  name: string;
  sector: string;
  url: string;
  logo?: string; // TODO: substituir pelos logos reais
};

// TODO: substituir por parceiros reais com logos e URLs definitivos
export const partners: Partner[] = [
  { id: "veran",    name: "Verán Moda",       sector: "Moda",            url: "#" },
  { id: "nutri",    name: "NutriPeak",         sector: "Suplementos",     url: "#" },
  { id: "pata",     name: "Patapronto",        sector: "Petshop",         url: "#" },
  { id: "voltz",    name: "Voltz",             sector: "Eletrônicos",     url: "#" },
  { id: "lavi",     name: "Lavï Cosméticos",   sector: "Beleza",          url: "#" },
  { id: "grao",     name: "Grão Nobre",        sector: "Café & Alimentos",url: "#" },
  { id: "papel",    name: "Papel&Co",          sector: "Papelaria",       url: "#" },
  { id: "lumen",    name: "Casa Lúmen",        sector: "Casa & Decoração", url: "#" },
  { id: "proforma", name: "ProForma Fit",      sector: "Fitness",         url: "#" },
  { id: "mentor",   name: "Mentor Lab",        sector: "Educação",        url: "#" },
];
