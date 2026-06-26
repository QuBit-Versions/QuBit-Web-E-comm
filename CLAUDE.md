# QuBit — Site Institucional

Stack: **Next.js 16 + React 19 + TypeScript + Tailwind CSS v4**
Idioma do produto: **pt-BR**. Identificadores de código em inglês.

---

## Regras de desenvolvimento

- **Nunca inventar copy, preços ou cores.** Tudo está em `content/` e `styles/tokens.css`.
- **Nunca valor mágico no JSX.** Sempre tokens CSS ou classes Tailwind mapeadas.
- **Azul-sólido (`bg-brand`) é exclusivo do CTA primário.** Links usam `text-brand-text`.
- **Rótulo do botão azul = `text-paper` (creme).** Nunca `text-black`.
- **Gradiente (`--grad`) nunca em texto corrido.** Só em fills, arte, universo.
- **`text-text-3` só em texto grande.** Texto pequeno usa no mínimo `text-text-2`.
- **Sentence case em todo lugar.** Nunca Title Case nem CAIXA ALTA, exceto o logo.
- **`prefers-reduced-motion` respeitado** em todas as animações.
- **Acessibilidade é critério de aceite**, não afterthought (WCAG 2.1 AA).
- **Logo = `components/brand/Wordmark.tsx` (SVG inline), nunca `<Image>`.** A tinta usa `currentColor` (controle por `text-paper`/`text-ink`); o ponto+órbita do "i" são SEMPRE `#2B4DFF` (o elétron/qubit da marca).
- **Convenção dos arquivos de logo:** `*_light` = tinta PRETA p/ fundo CLARO · `*_dark` = tinta CREME p/ fundo ESCURO. ("light/dark" = o tema do fundo, não a cor da tinta.) Em fundo escuro use a versão `dark` — ou, melhor, o componente `Wordmark`.
- **Alvo de toque mínimo 44px** em todo elemento interativo (botões, inputs, selects).
- **Ritmo de seção:** classe `.section-y` (clamp 64→128px), nunca `py-N` fixo.

---

## Estrutura de pastas

```text
app/
  layout.tsx            # fontes, metadata base, skip-link
  page.tsx              # Home (todas as seções)
  diagnostico/page.tsx  # Formulário de conversão primária
  obrigado/page.tsx     # Confirmação pós-envio
  proposta/page.tsx     # Proposta comercial em web
  universo/page.tsx     # Experiência 3D com parceiros
  privacidade/page.tsx  # LGPD (TODO)
  termos/page.tsx       # Termos (TODO)
  not-found.tsx         # 404 com polvo "perdido no espaço"
components/
  layout/               # Header, Footer, WhatsAppFab, Container, Section
  ui/                   # Button, Badge, Input, Field, Accordion, Skeleton, Tooltip
  home/                 # Hero, Problem, Solution, HowItWorks, Modules, Partnership, Faq, FinalCta
  universe/             # UniverseCanvas, Planet, OrbitLogo, Mascot, UniverseFallback
content/
  copy.ts               # FONTE ÚNICA de todo o texto do site
  modules.ts            # Módulos e preços
  faq.ts                # Perguntas frequentes
  partners.ts           # Parceiros (placeholders — trocar pelos reais)
lib/
  analytics.ts          # GA4 + Meta Pixel (TODO: IDs reais)
  validation.ts         # Schemas Zod para formulários
styles/
  tokens.css            # CSS custom properties (design tokens)
public/
  qubit_wordmark_light.svg / dark.svg
  qubit_symbol.svg
  avatar_master.png
```

---

## Design tokens (mapeados no Tailwind)

|Token CSS|Classe Tailwind|Uso|
|---|---|---|
|`--ink`|`bg-ink` / `text-ink`|Fundo principal|
|`--paper`|`text-paper`|Texto em botão azul, superfícies claras|
|`--surface-1`|`bg-surface-1`|Elevação 1 (seções alternadas)|
|`--surface-2`|`bg-surface-2`|Cards, inputs|
|`--brand`|`bg-brand`|**Só CTA primário**|
|`--brand-text`|`text-brand-text`|Links, acentos, eyebrows|
|`--text-1`|`text-text-1`|Títulos, corpo principal|
|`--text-2`|`text-text-2`|Texto secundário|
|`--text-3`|`text-text-3`|Só texto grande / metadata|
|`--line`|`border-line`|Bordas no escuro|

---

## Roadmap de milestones

### ✅ Milestone 0 — Fundação (FEITO)

- [x] Projeto Next.js 16 + TypeScript + Tailwind v4
- [x] `styles/tokens.css` com todos os tokens de design
- [x] `app/globals.css` com `@theme` do Tailwind v4
- [x] `app/layout.tsx` — fontes Geist, metadata pt-BR, skip-link
- [x] `content/` — copy.ts, modules.ts, faq.ts, partners.ts
- [x] Assets de marca em `/public` (SVGs + PNGs)
- [x] `app/page.tsx` — home completa em HTML semântico, sem componentes

### ✅ Milestone 1 — Componentes base (FEITO)

- [x] `components/ui/Button.tsx` — variantes primary, secondary, ghost; loading; touch 44px
- [x] `components/ui/Field.tsx` — label, hint, erro inline, aria-invalid
- [x] `components/ui/Accordion.tsx` — um aberto por vez, acessível
- [x] `components/layout/Header.tsx` — nav desktop + drawer mobile, CTA persistente, backdrop ao rolar
- [x] `components/layout/Footer.tsx`
- [x] `components/layout/WhatsAppFab.tsx` — flutuante, todas as telas
- [x] `components/layout/Container.tsx` + `Section.tsx`

### ✅ Milestone 2 — Seções da Home como componentes (FEITO)

- [x] `components/home/Hero.tsx` — visual placeholder → depois integra HeroVisual
- [x] `components/home/Problem.tsx`
- [x] `components/home/Solution.tsx`
- [x] `components/home/HowItWorks.tsx`
- [x] `components/home/Modules.tsx` — grade bento com badge "recomendado"
- [x] `components/home/Partnership.tsx`
- [x] `components/home/Faq.tsx` — usa Accordion
- [x] `components/home/FinalCta.tsx`
- [x] `app/page.tsx` — só importa e compõe os componentes

### ✅ Milestone 3 — Conversão (FEITO)

- [x] `app/diagnostico/page.tsx` + `components/home/DiagnosticoForm.tsx`
- [x] `lib/validation.ts` — schema Zod compartilhado entre form e API
- [x] Validação inline por campo, mensagens em pt-BR, fallback de erro global
- [x] `app/api/diagnostico/route.ts` — POST com safeParse; POST para webhook ou log em dev
- [x] `app/obrigado/page.tsx` — confirmação + CTA WhatsApp + voltar

### ✅ Milestone 4 — Páginas de apoio (FEITO)

- [x] `app/proposta/page.tsx` — proposta comercial (módulos + rampa + condições + CTA)
- [x] `components/layout/LegalPage.tsx` — layout compartilhado de página jurídica
- [x] `app/privacidade/page.tsx` — LGPD (texto provisório — TODO: jurídico definitivo)
- [x] `app/termos/page.tsx` (texto provisório — TODO: jurídico definitivo)
- [x] `app/not-found.tsx` — 404 com polvo "perdido no espaço"

### ✅ Milestone 5 — /universo (3D) (FEITO)

- [x] `components/universe/UniverseFallback.tsx` — Tier 3 (SSR, SEO, links reais)
- [x] `components/universe/UniverseExperience.tsx` — swap progressivo (detecta WebGL, sr-only)
- [x] `components/universe/UniverseCanvas.tsx` — Tier 1 (r3f, dynamic import, ssr:false)
- [x] `Starfield.tsx` — 600 estrelas via `InstancedMesh`
- [x] `Planet.tsx` — órbitas elípticas + `<Html>` do drei (link real, focável, aria-label)
- [x] `Core.tsx` — núcleo QuBit emissivo + halo + pointLight
- [x] `Mascot.tsx` — polvo flutuando + olhos seguindo o ponteiro (placeholder geométrico)
- [x] Tier 2 — `prefers-reduced-motion` via `lib/useReducedMotion.ts` (congela tudo)
- [x] Pausa rAF fora da viewport (IntersectionObserver → `frameloop`)
- [x] `app/universo/page.tsx` — monta as camadas + CTA

### ✅ Milestone 6 — Polimento & produção (FEITO)

- [x] Motion: `components/ui/Reveal.tsx` (IntersectionObserver) aplicado às seções; CSS de reveal + reduced-motion
- [x] SEO: metadata por rota, OG image (`qubit_poster.png` — TODO: arte 1200×630), `alternates.canonical`
- [x] `app/sitemap.ts` + `app/robots.ts` (gerados no build, verificados 200)
- [x] `components/layout/JsonLd.tsx` — JSON-LD Organization no `<head>`
- [x] `components/layout/Analytics.tsx` — GA4 + Meta Pixel via `next/script afterInteractive` (só carrega com IDs em env)
- [x] `.env.example` documentando todas as variáveis
- [x] Build de produção verde (11 rotas, `next build` sem erros)
- [ ] Auditoria final de campo: rodar Lighthouse/PSI com domínio real (LCP/INP/CLS)
- [ ] Auditoria manual de teclado + leitor de tela com conteúdo definitivo

---

## Pendências que precisam de input do cliente (🔲 TODO)

- [ ] **Domínio e e-mail definitivos** (hoje: `qubit.com.br` / `contato@qubit.com.br`)
- [ ] **Número de WhatsApp** real (hoje: `+5521999999999`)
- [ ] **Cases / depoimentos / números** reais para a seção de prova social
- [ ] **Logos reais dos parceiros** + URLs (hoje: 10 placeholders em `content/partners.ts`)
- [ ] **FAQ** final aprovado pelo cliente
- [ ] **Textos legais** (privacidade/LGPD + termos)
- [ ] **IDs de analytics** (GA4 Measurement ID + Meta Pixel ID)
- [ ] **SLA de resposta** para `/obrigado` (hoje: "24 horas")
- [ ] **OG Image** de marca (`/public/og-image.png`, 1200×630)

---

## Como rodar localmente

```bash
cd C:\Users\br-01\Documents\QuBit\site
npm run dev          # http://localhost:3000
npm run build        # build de produção
npm run lint         # ESLint
```

## Deploy

Alvo: **Vercel**. Conectar o repositório GitHub e configurar as variáveis de ambiente necessárias.
Variáveis que serão necessárias:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=
NEXT_PUBLIC_GA4_ID=
NEXT_PUBLIC_META_PIXEL_ID=
FORM_SUBMISSION_WEBHOOK=
```
