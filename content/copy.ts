// Fonte única de copy — nunca duplicar strings no JSX

export const site = {
  name: "QuBit",
  tagline: "tecnologia & crescimento",
  domain: "qubit.com.br", // TODO: confirmar domínio
  email: "qubit.central@gmail.com",
  whatsapp: "+5521988664557",
  whatsappMessage: "Olá! Gostaria de agendar um diagnóstico gratuito.",
  cnpj: "67.220.552/0001-86",
  city: "Rio de Janeiro/RJ",
  footerSignature: "(0+1)/√2", // easter egg — amplitude do qubit em superposição
};

// Redes sociais — TODO: trocar pelos perfis/handles reais da QuBit.
export const socials = [
  { id: "instagram", label: "Instagram", href: "https://instagram.com/" },
  { id: "x", label: "X", href: "https://x.com/" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/" },
  { id: "email", label: "E-mail", href: `mailto:${site.email}` },
] as const;

export const hero = {
  eyebrow: "· tecnologia & crescimento",
  h1: "A tecnologia e o crescimento do seu negócio — num só lugar.",
  sub: "Construímos sua loja, cuidamos de toda a infraestrutura e operamos seu tráfego com inteligência de dados. Você foca em vender.",
  ctaPrimary: "Quero meu diagnóstico gratuito",
  ctaSecondary: "Falar no WhatsApp",
  microcopy: "Grátis · sem compromisso · resposta em até 24h",
  // Micro-compromisso: 1 clique por objetivo → abre /servicos no pilar certo
  objectivesLabel: "O que você precisa agora?",
  objectives: [
    { label: "Vender mais rápido", pillar: "presenca" },
    { label: "Um sistema sob medida", pillar: "operacao" },
    { label: "Crescer com tráfego", pillar: "crescimento" },
    { label: "Uma marca forte", pillar: "identidade" },
  ],
  partnersLabel: "empresas que já orbitam:",
  partnersLink: "Explorar universo →",
};

export const problem = {
  eyebrow: "O problema",
  h2: "Site bonito não vende sozinho.",
  body: "A maioria trata loja, hospedagem e anúncios como três fornecedores que não conversam. O resultado é site parado, dados soltos e verba de tráfego queimada.",
  pains: [
    {
      id: "fornecedores",
      title: "Fornecedores soltos",
      description: "Cada um cuida de uma peça. Ninguém cuida do todo.",
    },
    {
      id: "conversao",
      title: "Site que não converte",
      description: "Visitas chegam, mas o checkout espanta o cliente.",
    },
    {
      id: "retorno",
      title: "Anúncios sem retorno",
      description: "Verba investida sem dados para otimizar.",
    },
  ],
};

export const solution = {
  eyebrow: "A solução",
  h2: "Um ecossistema, não três fornecedores.",
  body: "Loja, pagamento, NF-e, entrega, anúncios e dados vivem no mesmo lugar. Decisões mais rápidas, dados que conversam, operação que melhora sozinha com o tempo.",
};

export const howItWorks = {
  eyebrow: "Como funciona",
  h2: "Do diagnóstico ao crescimento, passo a passo.",
  steps: [
    {
      number: "01",
      title: "Diagnóstico",
      description: "Conversamos sobre produto, público e metas. Gratuito, sem compromisso.",
    },
    {
      number: "02",
      title: "Construção",
      description: "Montamos sua loja e integramos pagamento, NF-e e entrega.",
    },
    {
      number: "03",
      title: "Go-live",
      description: "Sua loja entra no ar, segura e pronta para vender.",
    },
    {
      number: "04",
      title: "Crescimento",
      description: "Ligamos a máquina de Ads e a inteligência começa a aprender.",
    },
  ],
};

export const modules_copy = {
  eyebrow: "Módulos & preços",
  h2: "Escolha o que faz sentido agora.",
  sub: "Comece por um módulo e expanda conforme cresce. O ecossistema é seu.",
  note: "* Os valores não incluem a verba de anúncios, paga diretamente pelo cliente às plataformas.",
};

// §5.1(6) — sem cases reais ainda, este bloco é de MÉTODO/TRANSPARÊNCIA.
// TODO: quando houver depoimentos/números reais, promover prova social a protagonista.
export const proof = {
  eyebrow: "Por que confiar",
  h2: "Transparência no lugar de promessa.",
  body: "Ainda não enchemos a tela de logos e números inflados. Preferimos mostrar como trabalhamos — e deixar o resultado falar.",
  pillars: [
    {
      id: "ecossistema",
      title: "Tudo em um lugar",
      description: "Loja, dados, entrega e anúncios na mesma operação. Nada de fornecedores que não conversam.",
    },
    {
      id: "incentivo",
      title: "Incentivos alinhados",
      description: "A rampa de Ads começa em R$ 0. Crescemos junto com o seu resultado, não à sua custa.",
    },
    {
      id: "dados",
      title: "Decisão por dado",
      description: "Cada campanha e cada página é ajustada pelo que os números mostram — não por achismo.",
    },
    {
      id: "caixa-preta",
      title: "Sem caixa-preta",
      description: "A verba de mídia é paga direto por você às plataformas. Você sempre vê para onde vai cada real.",
    },
  ],
};

export const partnership = {
  eyebrow: "Modelo de parceria",
  h2: "Crescemos só quando você cresce.",
  body: "A rampa de Ads começa em R$ 0 e os 5% sobre a mídia alinham os nossos incentivos aos seus. A verba de mídia é sempre sua — paga direto às plataformas. Você não cuida de tecnologia; nós cuidamos de resultado.",
  bullets: [
    "Entrada de baixo risco",
    "Escala quando você quiser",
    "Tecnologia fora do seu caminho",
  ],
};

// Depoimentos — sem cases reais ainda: estado "em breve" honesto (§ transparência).
export const depoimentos = {
  eyebrow: "Depoimentos",
  h2: "O que os parceiros dizem.",
  empty: "Em breve — as palavras de quem já cresce com a QuBit.",
  cta: "Seja um dos primeiros a contar a sua história aqui.",
};

// "Por que a QuBit" — bloco unificado (consolida problema, solução, incentivos e
// transparência em chunks escaneáveis; "como funciona" vira mini-passos).
export const porque = {
  eyebrow: "Por que a QuBit",
  h2: "Tecnologia fora do seu caminho. Resultado à vista.",
  body: "Tudo que separa um site bonito de um negócio que vende — num só lugar, e com os incentivos do seu lado.",
  reasons: [
    {
      id: "ecossistema",
      icon: "layers",
      title: "Um ecossistema, não 3 fornecedores",
      text: "Loja, dados, entrega e anúncios na mesma operação. Nada de peças que não conversam.",
    },
    {
      id: "incentivo",
      icon: "shield",
      title: "Crescemos quando você cresce",
      text: "A rampa de Ads começa em R$ 0; os 5% sobre a mídia alinham nossos incentivos aos seus.",
    },
    {
      id: "dados",
      icon: "chart",
      title: "Decisão por dado",
      text: "Cada página e cada campanha é ajustada pelo que os números mostram — não por achismo.",
    },
    {
      id: "transparencia",
      icon: "eye",
      title: "Sem promessa vazia",
      text: "Dizemos o que entregamos como técnica — e o que não dá para garantir. Honestidade na frente.",
    },
  ],
  stepsLabel: "E como funciona, na prática:",
};

export const cta_final = {
  h2: "Vamos colocar seu negócio para crescer?",
  sub: "Diagnóstico gratuito, sem compromisso. Respondemos em até 24 horas.", // TODO: SLA real
  ctaPrimary: "Quero meu diagnóstico gratuito",
  ctaSecondary: "Falar no WhatsApp",
  microcopy: "Grátis · sem compromisso · resposta em até 24h",
};

export const diagnostico_page = {
  eyebrow: "Diagnóstico gratuito",
  h1: "Conta para a gente sobre o seu negócio.",
  sub: "Nenhum compromisso. Em até 24 horas entramos em contato.", // TODO: SLA real
  submitLabel: "Enviar pedido de diagnóstico",
  successRedirect: "/obrigado",
  whatsappFallback: "Prefere falar agora? Chama no WhatsApp →",
  errorMessage: "Não conseguimos enviar agora — tente de novo ou fale no WhatsApp.",
};

export const obrigado_page = {
  h1: "Recebemos seu pedido!",
  sub: "Em até 24 horas entramos em contato para marcar o diagnóstico.", // TODO: SLA real
  cta: "Enquanto isso, fale no WhatsApp →",
  nextStepsTitle: "O que acontece agora",
  nextSteps: [
    "Recebemos seu pedido — com as soluções que você marcou.",
    "Em até 24h chamamos no seu WhatsApp ou e-mail.",
    "Fazemos o diagnóstico e você sai com um caminho claro — sem compromisso.",
  ],
};

export const proposta_page = {
  eyebrow: "Proposta comercial",
  h1: "Um ecossistema completo para o seu negócio crescer.",
  sub: "Cada módulo resolve uma parte do problema. Juntos, eles formam uma operação que melhora sozinha com o tempo. Comece pelo que faz sentido agora.",
  modulesTitle: "Módulos disponíveis",
  rampTitle: "Como funciona a rampa de crescimento",
  rampSub: "A Gestão de Crescimento começa de graça e cresce junto com os seus resultados. Os 5% sobre a mídia, a partir do 4º mês, alinham nossos incentivos aos seus.",
  notesTitle: "Condições",
  notes: [
    "A verba de anúncios é paga diretamente por você às plataformas (Meta, Google, TikTok) e não está incluída nos valores acima.",
    "Módulos de pagamento único são entregas fechadas, sem fidelidade.",
    "Módulos mensais têm 30 dias de aviso prévio para cancelamento, sem multa.",
    "Valores e escopo são confirmados no diagnóstico, conforme a complexidade do seu projeto.",
  ],
  ctaTitle: "Pronto para começar?",
  ctaSub: "Agende um diagnóstico gratuito e desenhamos a proposta ideal para o seu momento.",
};

export const legal_pages = {
  // TODO: substituir todo o conteúdo abaixo por textos jurídicos definitivos (advogado/LGPD)
  privacidade: {
    title: "Política de Privacidade",
    updatedAt: "Última atualização: pendente", // TODO: data real de publicação
    placeholder: true,
    intro:
      "Esta Política de Privacidade descreve como a QuBit coleta, usa e protege os dados pessoais dos visitantes e clientes, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).",
    sections: [
      {
        heading: "1. Dados que coletamos",
        body: "Coletamos os dados que você nos fornece voluntariamente ao preencher o formulário de diagnóstico (nome, e-mail, telefone, empresa) e dados de navegação coletados por ferramentas de analytics.",
      },
      {
        heading: "2. Como usamos seus dados",
        body: "Utilizamos seus dados exclusivamente para entrar em contato, elaborar propostas e melhorar a sua experiência. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.",
      },
      {
        heading: "3. Seus direitos",
        body: "Você pode solicitar acesso, correção ou exclusão dos seus dados a qualquer momento, entrando em contato pelos canais oficiais da QuBit.",
      },
      {
        heading: "4. Contato",
        body: "Para questões sobre privacidade, fale com a gente pelo e-mail de contato informado no rodapé do site.",
      },
    ],
  },
  termos: {
    title: "Termos de Uso",
    updatedAt: "Última atualização: pendente", // TODO: data real de publicação
    placeholder: true,
    intro:
      "Estes Termos de Uso regem o acesso e a utilização do site e dos serviços oferecidos pela QuBit. Ao utilizar nossos serviços, você concorda com estes termos.",
    sections: [
      {
        heading: "1. Objeto",
        body: "A QuBit oferece serviços de desenvolvimento de e-commerce, infraestrutura, inteligência de dados e gestão de tráfego pago, conforme os módulos contratados.",
      },
      {
        heading: "2. Contratação e pagamento",
        body: "Os módulos de pagamento único são entregas fechadas. Os módulos mensais são renovados automaticamente, com 30 dias de aviso prévio para cancelamento. A verba de mídia é paga diretamente pelo cliente às plataformas de anúncio.",
      },
      {
        heading: "3. Responsabilidades",
        body: "A QuBit compromete-se a entregar os serviços com diligência técnica. O cliente é responsável por fornecer as informações e acessos necessários para a execução dos serviços.",
      },
      {
        heading: "4. Foro",
        body: "Estes termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca do Rio de Janeiro/RJ para dirimir eventuais controvérsias.",
      },
    ],
  },
};

export const not_found_page = {
  code: "404",
  h1: "Esta página se perdeu no espaço.",
  sub: "O endereço que você procurou não existe ou foi movido. Mas não se preocupe — o resto do universo continua aqui.",
  ctaPrimary: "Voltar para o início",
  ctaSecondary: "Explorar o universo →",
};
