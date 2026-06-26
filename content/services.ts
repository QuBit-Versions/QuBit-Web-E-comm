// Fonte única do portfólio + precificação (revelação progressiva).
// Preço público dosado por psicologia de conversão: piso visível nos
// padronizáveis, âncora "a partir de" nos sob-medida, "sob diagnóstico"
// sempre colado a um número. O teto assustador vive na proposta, não aqui.

export type Pillar = {
  id: string;
  name: string;
  tagline: string; // a promessa, em uma linha
  fear: string; // o medo do cliente que este pilar dissolve
  entry: string; // preço-âncora de entrada (vitrine da home)
  transversal?: boolean; // continuidade — atravessa todos
};

export type Tier = { label: string; price: string; note?: string };

export type Service = {
  id: string;
  pillarId: string;
  name: string;
  forWho: string; // "Para empresas que..."
  fear: string; // medo principal que esta oferta dissolve
  price: string; // preço público (crivo de conversão)
  priceModel: "único" | "mensal" | "diagnóstico" | "proposta";
  priceDriver?: string; // "o que muda o valor" — justifica a faixa
  tiers?: Tier[]; // subníveis (detalhe, fica no acordeão)
  includes: string[];
  excludes?: string[];
  prerequisites?: string[];
  notes?: string[]; // observações (fiscal, terceiros, regras)
  recommended?: boolean;
};

// ── Pilares (taxonomia voltada ao cliente — não "blocos") ──────────────────
export const pillars: Pillar[] = [
  {
    id: "presenca",
    name: "Presença & venda rápida",
    tagline: "No ar rápido, com cara de profissional e pronto para vender.",
    fear: "Vou demorar demais e parecer amador na frente do cliente.",
    entry: "a partir de R$ 1.500",
  },
  {
    id: "operacao",
    name: "Produto & operação sob medida",
    tagline: "Sistemas que cabem na sua operação — não o contrário.",
    fear: "Minha operação não cabe em planilha, mas sob medida deve custar uma fortuna.",
    entry: "a partir de R$ 12.000",
  },
  {
    id: "crescimento",
    name: "Crescimento mensurável",
    tagline: "Dados e tráfego que mostram o que cada real fez.",
    fear: "Já gastei com anúncio e nunca soube se deu resultado.",
    entry: "a partir de R$ 1.000/mês",
  },
  {
    id: "identidade",
    name: "Identidade & comunicação",
    tagline: "Uma marca coerente em todo ponto de contato.",
    fear: "Uma marca confusa afasta o cliente antes mesmo da venda.",
    entry: "a partir de R$ 500",
  },
  {
    id: "continuidade",
    name: "Continuidade",
    tagline: "O que mantém tudo de pé depois que entra no ar.",
    fear: "E se quebrar, ficar lento ou inseguro e eu ficar na mão?",
    entry: "R$ 400 a R$ 800/mês",
    transversal: true,
  },
];

// ── Ofertas ────────────────────────────────────────────────────────────────
export const services: Service[] = [
  // PRESENÇA & VENDA RÁPIDA (Bloco 2)
  {
    id: "landing-smart",
    pillarId: "presenca",
    name: "Landing page Smart",
    forWho: "Para captar leads, lançar um produto ou validar uma oferta com tráfego pago.",
    fear: "Preciso de uma página que converta a campanha, não um site bonito e vazio.",
    price: "R$ 1.500 a R$ 2.500",
    priceModel: "único",
    priceDriver: "Complexidade da oferta, integrações e número de seções.",
    includes: [
      "estrutura estratégica da página",
      "UI/UX responsivo",
      "oferta, benefícios, prova social, FAQ e CTA",
      "formulário ou integração com WhatsApp",
      "configuração de domínio",
      "SEO técnico básico",
      "Google Analytics, Tag Manager e Pixel",
      "eventos de conversão básicos",
      "otimização de imagens e cache",
      "até 2 rodadas de ajustes",
    ],
    prerequisites: [
      "domínio ou autorização para aquisição",
      "textos, fotos, vídeos e informações comerciais",
      "acesso à hospedagem/plataforma",
      "política de privacidade quando houver coleta de dados",
      "conta de anúncios, caso haja campanhas",
    ],
  },
  {
    id: "site-institucional",
    pillarId: "presenca",
    name: "Site institucional Smart",
    forWho: "Para apresentar serviços, diferenciais, equipe, portfólio e contato.",
    fear: "Quero passar credibilidade sem depender de agência pra cada ajuste.",
    price: "R$ 2.500 a R$ 4.500",
    priceModel: "único",
    priceDriver: "Número de páginas, integrações e necessidade de CMS/conteúdo.",
    includes: [
      "até 5 páginas principais",
      "arquitetura de navegação",
      "UI/UX responsivo",
      "formulário de contato e WhatsApp",
      "SEO técnico básico por página",
      "Analytics, Tag Manager e eventos",
      "CMS para atualizações simples",
      "otimização de imagens",
      "treinamento rápido de uso, quando aplicável",
      "até 2 rodadas de ajustes",
    ],
    notes: [
      "Expansões (blog, multilíngue, catálogo, área restrita, CRM, automações, SEO de conteúdo) entram como aditivo.",
    ],
  },
  {
    id: "ecommerce-smart",
    pillarId: "presenca",
    name: "E-commerce Smart",
    forWho: "Para vender online sobre uma base pronta e confiável, com a sua cara.",
    fear: "Vi loja por menos de R$ 1.500 — por que eu pagaria mais?",
    price: "R$ 3.500 a R$ 7.000",
    priceModel: "único",
    priceDriver:
      "Catálogo, variações, regras de frete, integração fiscal/ERP, meios de pagamento e importação de dados.",
    includes: [
      "configuração da plataforma",
      "identidade visual aplicada à loja",
      "UI/UX de produto, carrinho e checkout",
      "categorias e cadastro inicial de produtos (dentro do limite)",
      "configuração de frete",
      "gateway de pagamento compatível",
      "integração com ERP/emissor fiscal, quando previsto",
      "rastreamento de conversões",
      "SEO técnico básico de estrutura",
      "testes de compra e treinamento de operação",
      "até 2 rodadas de ajustes",
    ],
    excludes: [
      "mensalidades (plataforma, ERP, emissor fiscal)",
      "domínio, hospedagem e taxa de gateway",
      "plugins e transportadoras",
      "cadastro ilimitado de produtos",
      "fotografia e textos de produto",
      "operação de pedidos e atendimento ao consumidor",
      "consultoria tributária",
    ],
    prerequisites: [
      "CNPJ e enquadramento fiscal adequados",
      "conta em gateway de pagamento compatível",
      "conta em ERP/emissor fiscal (ex.: Bling) ou equivalente",
      "certificado digital, quando exigido",
      "dados fiscais corretos de produtos e empresa",
      "credenciais e permissões de API",
      "políticas comerciais, de troca, privacidade e entrega",
    ],
    notes: [
      "Há lojas no mercado abaixo de R$ 1.500, mas normalmente com escopo restrito, sem integração robusta nem acompanhamento de implantação.",
      "A integração técnica não substitui contador, validação tributária nem obrigações fiscais do cliente. NF-e/NFC-e/NFS-e variam por documento, município, estado e regime.",
    ],
  },

  // PRODUTO & OPERAÇÃO SOB MEDIDA (Blocos 3, 4, 6, 7, 10)
  {
    id: "sistemas-sob-medida",
    pillarId: "operacao",
    name: "Sistema sob medida (full-stack)",
    forWho: "Para operações que não cabem bem em planilhas, plugins ou ferramentas genéricas.",
    fear: "Vou pagar caro pra só digitalizar um processo ruim — ou ficar preso numa ferramenta que limita meu negócio.",
    price: "a partir de R$ 12.000",
    priceModel: "proposta",
    priceDriver: "Módulos, integrações, usuários, regras, segurança, auditoria, prazo e migração de dados.",
    tiers: [
      { label: "Diagnóstico e mapeamento de operação", price: "R$ 1.500 a R$ 5.000" },
      { label: "MVP web sob medida (escopo fechado)", price: "a partir de R$ 12.000" },
      { label: "Sistema interno simples", price: "R$ 20.000 a R$ 50.000" },
      { label: "Sistema administrativo unificado", price: "R$ 40.000 a R$ 120.000+" },
      { label: "Plataforma complexa, multiusuário/multissetor", price: "sob proposta" },
    ],
    includes: [
      "etapa de descoberta (setores, regras, gargalos, integrações, indicadores)",
      "Caminho A — integrar ferramentas maduras existentes (ERP, CRM, gateway, fiscal…)",
      "Caminho B — solução híbrida (ferramentas prontas + painel próprio)",
      "Caminho C — sistema 100% customizado, do banco ao front-end",
      "painéis, permissões, automações, trilha de auditoria e relatórios",
      "portais de cliente/fornecedor e integrações via API",
    ],
    notes: [
      "Começa pelo entendimento do negócio: como vende, compra, entrega, cobra, mede e decide — antes de programar.",
      "Referências de software houses brasileiras colocam sistemas web em dezenas de milhares de reais; R$ 5.000–8.000 não é faixa sustentável para um sistema operacional completo.",
    ],
  },
  {
    id: "organizacao-dados",
    pillarId: "operacao",
    name: "Organização e migração de dados",
    forWho: "Para quem tem dados espalhados em planilhas, ERPs, PDFs e sistemas antigos.",
    fear: "Se eu automatizar em cima de dados bagunçados, só vou automatizar o erro.",
    price: "sob diagnóstico (R$ 1.500 a R$ 10.000)",
    priceModel: "diagnóstico",
    priceDriver: "Volume, número de fontes e nível de inconsistência dos cadastros.",
    tiers: [
      { label: "Base pequena e estruturada", price: "R$ 1.500 a R$ 3.500" },
      { label: "Múltiplas planilhas e cadastros inconsistentes", price: "R$ 3.500 a R$ 10.000" },
      { label: "Migração de legado ou alto volume", price: "sob diagnóstico" },
    ],
    includes: [
      "inventário e diagnóstico de qualidade das fontes",
      "estrutura-padrão, padronização e deduplicação",
      "normalização e classificação de cadastros",
      "identificação de dados faltantes",
      "migração para planilha, banco ou novo sistema",
      "documentação de regras e validação com a empresa",
    ],
    notes: [
      "Organizar dados não é “adivinhar” informação ausente. Sem fonte confiável, a validação cabe ao responsável operacional do cliente.",
    ],
  },
  {
    id: "logistica-entrega",
    pillarId: "operacao",
    name: "Sistema de entrega integrado",
    forWho: "Para acompanhar pedidos, organizar entregas e reduzir falhas no pós-venda.",
    fear: "Perco cliente no pós-compra por falta de status e controle da entrega.",
    price: "a partir de R$ 2.500",
    priceModel: "proposta",
    priceDriver: "Integrações com transportadoras/ERP e nível de automação do pós-venda.",
    includes: [
      "integração de pedidos e status de entrega",
      "painel operacional e rastreio",
      "comunicação automática ao cliente",
      "regras de frete e integração com transportadoras",
      "acompanhamento de exceções e relatórios",
    ],
    notes: [
      "Roteirização avançada, app de entregador, geolocalização em tempo real e última milha entram como módulos separados.",
    ],
  },
  {
    id: "apps-mobile",
    pillarId: "operacao",
    name: "Aplicativos nativos iOS e Android",
    forWho: "Para experiências premium com câmera, GPS, biometria, push ou uso offline.",
    fear: "App é um investimento alto — preciso ter certeza de que vale duas plataformas.",
    price: "a partir de R$ 25.000",
    priceModel: "proposta",
    priceDriver: "Backend, integrações, pagamentos e manutenção em dois ecossistemas (Kotlin + Swift).",
    tiers: [
      { label: "Protótipo e descoberta", price: "R$ 2.000 a R$ 6.000" },
      { label: "MVP nativo simples", price: "R$ 25.000 a R$ 50.000" },
      { label: "App com backend, pagamentos, GPS e notificações", price: "R$ 50.000 a R$ 120.000+" },
      { label: "Produto operacional complexo", price: "sob proposta" },
    ],
    includes: [
      "descoberta de produto, UX/UI e arquitetura",
      "desenvolvimento Android (Kotlin) e iOS (Swift)",
      "integração com backend e autenticação",
      "notificações e publicação nas lojas",
      "testes e documentação técnica básica",
    ],
    excludes: [
      "Apple Developer Program e Google Play Console",
      "servidores, banco de dados e APIs de terceiros",
      "mapas, SMS, e-mail, push e gateways",
      "taxas de transação",
    ],
  },
  {
    id: "automacao",
    pillarId: "operacao",
    name: "Automação de processos internos",
    forWho: "Para eliminar tarefas repetitivas e transferências manuais entre sistemas.",
    fear: "Minha equipe perde horas com conferência e digitação que poderiam ser automáticas.",
    price: "sob diagnóstico e escopo",
    priceModel: "diagnóstico",
    priceDriver: "Número de fluxos, sistemas envolvidos e disponibilidade de APIs/webhooks.",
    includes: [
      "mapeamento do fluxo atual e gargalos",
      "decisão entre integração, automação ou desenvolvimento próprio",
      "construção, testes e documentação",
      "monitoramento e evolução",
    ],
    prerequisites: [
      "acesso autorizado às ferramentas",
      "responsável do cliente para validar regras",
      "processos minimamente definidos",
      "contas/planos que permitam API, webhook ou integração",
    ],
  },

  // CRESCIMENTO MENSURÁVEL (Blocos 5, 9)
  {
    id: "dashboards-bi",
    pillarId: "crescimento",
    name: "Dashboards e inteligência operacional",
    forWho: "Para decidir com métricas definidas e fontes confiáveis, não com achismo.",
    fear: "Tenho dados, mas não consigo enxergar o que está vendendo, sobrando ou rompendo.",
    price: "a partir de R$ 1.500",
    priceModel: "proposta",
    priceDriver: "Número de indicadores e se as fontes já estão organizadas ou precisam de integração.",
    tiers: [
      { label: "Dashboard com fonte já organizada", price: "R$ 1.500 a R$ 3.500" },
      { label: "Dashboard com integração de fontes", price: "R$ 4.000 a R$ 10.000" },
      { label: "BI operacional contínuo", price: "sob proposta" },
    ],
    includes: [
      "definição de indicadores",
      "vendas, pedidos, ticket médio, margem e estoque",
      "ruptura, origem de vendas e desempenho de campanhas",
      "clientes recorrentes, previsões simples e alertas",
    ],
    prerequisites: [
      "dados estruturados — ou passar antes pela organização de dados legados",
    ],
  },
  {
    id: "gestao-performance",
    pillarId: "crescimento",
    name: "Gestão de performance — sem criativos",
    forWho: "Para quem já tem peças prontas e precisa de estratégia e otimização.",
    fear: "Não sei se minha verba está sendo bem gasta nem o que cada campanha trouxe.",
    price: "a partir de R$ 1.000/mês",
    priceModel: "mensal",
    priceDriver: "Tamanho da verba de mídia e número de canais geridos.",
    tiers: [
      { label: "Verba até R$ 5.000", price: "R$ 1.000 a R$ 1.500/mês" },
      { label: "Verba R$ 5.001 a R$ 15.000", price: "R$ 1.500 a R$ 2.500/mês + % do excedente" },
      { label: "Verba acima de R$ 15.000", price: "sob proposta (fee mínimo + %)" },
    ],
    includes: [
      "diagnóstico de conta e estratégia de campanhas",
      "auditoria de Pixel, GA4, Tag Manager e eventos",
      "estruturação e otimização de campanhas",
      "Meta, Google ou TikTok Ads conforme contrato",
      "relatório e reunião de acompanhamento",
    ],
    excludes: [
      "gravação, roteiro, edição e design de anúncios",
      "fotografia e conteúdo orgânico",
      "criação de landing page",
      "verba de mídia (paga direto às plataformas)",
    ],
  },
  {
    id: "gestao-crescimento",
    pillarId: "crescimento",
    name: "Gestão de crescimento — com criativos",
    forWho: "Para quem precisa de estratégia de mídia e produção recorrente de peças para teste.",
    fear: "Sem criativos novos pra testar, minha campanha satura e o custo sobe.",
    price: "a partir de R$ 2.000/mês",
    priceModel: "mensal",
    priceDriver: "Quantidade de roteiros/vídeos por mês, formatos e canais atendidos.",
    recommended: true,
    tiers: [
      { label: "Criativos essenciais — até 4 peças/mês", price: "R$ 2.000 a R$ 3.000/mês + mídia" },
      { label: "Criativos de escala — 8 a 12 peças/mês", price: "R$ 3.500 a R$ 6.000/mês + mídia" },
      { label: "Operação multicanal", price: "sob proposta" },
    ],
    includes: [
      "tudo da gestão de performance",
      "pesquisa de ângulos e planejamento de oferta",
      "roteiros, briefing e edição de vídeos",
      "variações de criativos e análise de desempenho",
    ],
    notes: [
      "A proposta define quantidade de roteiros/vídeos, duração, revisões, quem grava, prazos, canais e formatos.",
      "Recomendação comercial: setup inicial R$ 800–1.500, contrato mínimo de 3 meses, verba paga direto pelo cliente. Evitar mês grátis quando há setup técnico.",
    ],
  },

  // IDENTIDADE & COMUNICAÇÃO (Bloco 1)
  {
    id: "identidade-essencial",
    pillarId: "identidade",
    name: "Design de logomarca essencial",
    forWho: "Para quem precisa de uma marca limpa e coerente entre anúncio, site e atendimento.",
    fear: "Se o cliente chega pelo anúncio e vê uma marca amadora, a percepção de risco dispara antes da venda.",
    price: "R$ 500",
    priceModel: "único",
    includes: [
      "briefing de marca",
      "2 propostas visuais iniciais",
      "até 2 rodadas de ajustes",
      "logo principal + versões horizontal, vertical e monocromática",
      "paleta de cores essencial",
      "arquivos PNG, SVG e PDF (digital e impressão)",
    ],
    excludes: [
      "naming",
      "pesquisa de concorrência aprofundada",
      "manual de marca completo",
      "embalagens e apresentações",
      "peças recorrentes para redes sociais",
      "ilustrações exclusivas",
    ],
    notes: [
      "Evolução: Identidade visual estratégica (posicionamento, sistema visual completo, tipografia, manual e aplicações) — sob proposta.",
    ],
  },

  // CONTINUIDADE (Bloco 8) — transversal
  {
    id: "manutencao-infra",
    pillarId: "continuidade",
    name: "Manutenção & infraestrutura",
    forWho: "Para manter o ambiente técnico estável, monitorado e recuperável.",
    fear: "E se o site cair, ficar lento ou for invadido e eu não tiver pra quem ligar?",
    price: "R$ 400 a R$ 800/mês",
    priceModel: "mensal",
    priceDriver: "Volume, criticidade da operação e necessidade de resposta rápida (SLA).",
    includes: [
      "hospedagem ou acompanhamento de hospedagem",
      "backups automáticos",
      "atualização de dependências críticas",
      "monitoramento básico e correções pontuais",
      "revisão básica de segurança",
      "suporte a incidentes de infraestrutura",
      "relatório mensal simples",
    ],
    excludes: [
      "novas funcionalidades e redesign",
      "produção de conteúdo",
      "operação de e-commerce e atendimento ao consumidor",
      "custos de cloud, domínio, plugins, APIs ou licenças",
      "suporte ilimitado e SLA corporativo",
    ],
    notes: [
      "Operação crítica, alto volume ou múltiplas integrações exigem contrato de suporte evolutivo e SLA separado.",
    ],
  },
];

// ── Transparência: disclaimers reposicionados como confiança ────────────────
export const transparency = {
  title: "O que prometemos — e o que não prometemos",
  intro:
    "Preferimos te dizer isto antes de fechar. Honestidade sobre limites é o que separa um parceiro de tecnologia de um vendedor de milagre.",
  promise: [
    "Entrega técnica sólida: SEO técnico, performance, UX e rastreamento.",
    "Estrutura semântica, eventos de conversão e medição de origem de leads e vendas.",
    "Escopo fechado, com entregáveis, prazos e critérios de aceite claros.",
  ],
  notPromise: [
    "Posição no Google, volume de tráfego ou faturamento — ranking depende de conteúdo, concorrência, autoridade e intenção de busca.",
    "Resultado garantido de tráfego pago — depende de oferta, preço, mercado, atendimento, estoque, reputação e criativos.",
    "Sistemas e integrações dependem da qualidade dos dados, das APIs e da validação operacional do cliente.",
  ],
};

// ── Regras de contratação ───────────────────────────────────────────────────
export const contractRules = {
  escopoFechado: [
    "entregáveis e quantidade de páginas, telas, produtos ou módulos",
    "integrações incluídas e cronograma",
    "número de revisões e critérios de aceite",
    "responsabilidades do cliente e custos de terceiros",
    "suporte pós-entrega e valor de itens adicionais",
  ],
  aditivo:
    "Qualquer mudança de funcionalidade, quantidade, integração, regra ou prazo é tratada como aditivo contratual.",
  clientResponsibility: [
    "informações comerciais e fiscais",
    "textos, imagens e materiais aprovados",
    "licenças de uso e contas de terceiros",
    "acessos e validação de fluxos",
    "aprovação dentro dos prazos",
    "conformidade tributária, jurídica e regulatória",
  ],
};
