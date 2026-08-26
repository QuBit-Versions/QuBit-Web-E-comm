import type { Metadata } from "next";
import { Block } from "@/components/ui/Block";
import { SnapMode } from "@/components/ui/SnapMode";
import { Hero } from "@/components/home/Hero";
import { Universe } from "@/components/home/Universe";
import { Depoimentos } from "@/components/home/Depoimentos";
import { PorQue } from "@/components/home/PorQue";
import { Modules } from "@/components/home/Modules";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

// A constelação (Universe) lê os parceiros do banco a CADA requisição.
// Por quê não ISR estático: o snapshot é gerado no build (Cloud Build, SEM banco),
// onde getOrbitPartners() cai no catch e devolve [] — órbita vazia. No Cloud Run
// com escala a zero, cada instância nova volta a servir esse snapshot vazio, então
// as empresas "não permaneciam" na órbita. Render dinâmico = sempre o banco atual.
// Título e descrição vêm do layout; aqui só o canonical da home.
export const metadata: Metadata = { alternates: { canonical: "/" } };

export const dynamic = "force-dynamic";

// Scrollytelling: cada seção é um bloco full-screen que encaixa no snap. O Block
// marca data-active ao entrar na viewport → dispara/reverte as animações em
// cascata dos filhos (.b-item / .b-spread / .b-char).
export default function Home() {
  return (
    <main id="main-content">
      <SnapMode />
      <Block><Hero /></Block>
      <Block><Universe /></Block>
      <Block><Depoimentos /></Block>
      <Block><PorQue /></Block>
      <Block><Modules /></Block>
      <Block><Faq /></Block>
      <Block><FinalCta /></Block>
    </main>
  );
}
