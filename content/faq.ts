export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

// TODO: revisar com o cliente e adicionar perguntas finais
export const faq: FaqItem[] = [
  {
    id: "tech",
    question: "Preciso entender de tecnologia para trabalhar com a QuBit?",
    answer:
      "Não. Nossa função é exatamente eliminar essa barreira. Você cuida do produto e das vendas; nós cuidamos de tudo que é tecnologia. Da loja ao servidor, da campanha ao relatório.",
  },
  {
    id: "loja-existente",
    question: "E se eu já tiver uma loja?",
    answer:
      "Sem problema. Avaliamos o que você já tem no diagnóstico e decidimos juntos se faz sentido migrar, refatorar ou complementar com o que está faltando.",
  },
  {
    id: "midia",
    question: "Como funciona o pagamento da verba de mídia?",
    answer:
      "A verba de anúncios é paga diretamente por você às plataformas (Meta, Google, TikTok). Nós cobramos apenas pela gestão — e só 5% sobre o que você investe em mídia, a partir do 4º mês.",
  },
  {
    id: "prazo",
    question: "Em quanto tempo minha loja fica pronta?",
    answer:
      "Em média 2 a 4 semanas após o alinhamento inicial, dependendo da complexidade do catálogo e das integrações. Combinamos um prazo realista no diagnóstico.",
  },
  {
    id: "modular",
    question: "Posso começar só com um módulo?",
    answer:
      "Sim. Você pode começar apenas com a loja, por exemplo, e adicionar infraestrutura, dados ou Ads conforme o negócio cresce. O ecossistema é modular.",
  },
  {
    id: "contrato",
    question: "Existe fidelidade ou contrato longo?",
    answer:
      "Os módulos únicos não têm fidelidade — são entregas fechadas. Os mensais (manutenção e Ads) têm 30 dias de aviso prévio para cancelamento. Sem multas.",
  },
];
