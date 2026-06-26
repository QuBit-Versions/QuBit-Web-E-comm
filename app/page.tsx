import { Block } from "@/components/ui/Block";
import { SnapMode } from "@/components/ui/SnapMode";
import { Hero } from "@/components/home/Hero";
import { Universe } from "@/components/home/Universe";
import { Depoimentos } from "@/components/home/Depoimentos";
import { PorQue } from "@/components/home/PorQue";
import { Modules } from "@/components/home/Modules";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

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
