import { Block } from "@/components/ui/Block";
import { SnapMode } from "@/components/ui/SnapMode";
import { Hero } from "@/components/home/Hero";
import { Problem } from "@/components/home/Problem";
import { Solution } from "@/components/home/Solution";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Modules } from "@/components/home/Modules";
import { Proof } from "@/components/home/Proof";
import { Transparency } from "@/components/home/Transparency";
import { Partnership } from "@/components/home/Partnership";
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
      <Block><Problem /></Block>
      <Block><Solution /></Block>
      <Block><HowItWorks /></Block>
      <Block><Modules /></Block>
      <Block><Proof /></Block>
      <Block><Transparency /></Block>
      <Block><Partnership /></Block>
      <Block><Faq /></Block>
      <Block><FinalCta /></Block>
    </main>
  );
}
