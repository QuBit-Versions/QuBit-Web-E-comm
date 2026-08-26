# QuBit — site institucional + portal de parceiros

Aplicação Next.js que reúne três coisas no mesmo domínio:

1. **Site de marketing** — home, `/servicos`, `/proposta`, `/universo`, páginas legais.
2. **Portal de parceiros** — cadastro, login e `/painel` (demandas, entregas, logo, órbita).
3. **Camada 3D** — fundo de partículas global e a constelação de parceiros.

Produto em **pt-BR**; identificadores de código em inglês.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 + tokens em `styles/tokens.css` |
| Banco | PostgreSQL (Cloud SQL) via `postgres` — `lib/db.ts` |
| Auth | Própria: scrypt (`node:crypto`) + sessão em cookie httpOnly — `lib/auth.ts` |
| Arquivos | Google Cloud Storage (logos das empresas) |
| 3D | @react-three/fiber + drei + three |
| Formulários | React Hook Form + Zod |
| Deploy | Docker → **Cloud Run** (`output: "standalone"`) |

> Não usa mais Supabase. A migração para banco próprio + GCS está concluída.

## Rodando localmente

```bash
npm install
cp .env.example .env.local     # e preencha
npm run dev                    # http://localhost:3000
```

O site de marketing sobe sem banco. Para `/entrar`, `/cadastro` e `/painel` você
precisa de um Postgres acessível:

```bash
# 1. suba um Postgres local (ou cloud-sql-proxy em 127.0.0.1)
# 2. crie o banco e aplique o schema (idempotente)
psql -U postgres -c "create database qubit_site"
psql -U postgres -d qubit_site -f db/schema.sql
```

Defina `OWNER_EMAIL` no `.env.local`: a conta criada com esse e-mail vira **admin**
do portal automaticamente no cadastro.

## Comandos

```bash
npm run dev     # desenvolvimento
npm run build   # build de produção (não roda lint no Next 16)
npm run start   # servir o build
npm run lint    # ESLint — rode explicitamente, o build não faz isso por você
```

## Estrutura

```text
app/
  api/auth/       cadastro, entrar, sair, sessao
  api/painel/     demandas, entregas, empresas/[id], logo  (RBAC por role)
  api/diagnostico rota do lead → Gestão API / webhook
  api/orbita      parceiros em órbita (público)
  painel/         área logada (admin e empresa no mesmo arquivo)
components/
  auth/ painel/ services/ funnel/    fluxos de produto
  home/ layout/ ui/ brand/           site de marketing
  universe/                          3D
content/          FONTE ÚNICA de copy, serviços/preços, FAQ, parceiros
db/schema.sql     schema do Postgres (idempotente)
lib/              db, auth, rate-limit, validação, hooks
styles/tokens.css design tokens
```

## Modelo de dados

`empresas` (conta + perfil) → `sessoes` (token do cookie) → `demandas` (empresa cria,
admin move status) e `entregas` (admin cria, empresa acompanha). `login_tentativas`
serve ao rate limit do login.

Uma empresa aparece na constelação do site quando tem **`em_orbita = true` e
`logo_url` preenchida** — ver `lib/orbita.ts`.

## Deploy

```bash
gcloud run deploy --source .
```

O `Dockerfile` faz build multi-stage e serve `.next/standalone/server.js` na porta
8080. Variáveis necessárias em produção: `INSTANCE_CONNECTION_NAME`, `DB_NAME`,
`DB_USER`, `DB_PASSWORD`, `LOGOS_BUCKET`, `OWNER_EMAIL`.

## Convenções

Ver [CLAUDE.md](CLAUDE.md) para as regras de design e [AGENTS.md](AGENTS.md) para as
convenções de código.
