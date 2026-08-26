-- QuBit site — banco próprio (Cloud SQL, database qubit_site).
-- Substitui o Supabase (auth.users + profiles + demandas + storage policies).
-- Idempotente: pode rodar de novo com segurança.

-- ── Empresas (conta + perfil, 1 tabela só — auth própria) ──────────────────
create table if not exists empresas (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  email          text not null unique,
  senha_hash     text not null, -- scrypt:salt:hash (node:crypto)
  role           text not null default 'empresa' check (role in ('empresa', 'admin')),
  nome_fantasia  text not null default '',
  cnpj           text,
  responsavel    text,
  area           text,
  regiao         text,
  telefone       text,
  logo_url       text,
  -- soluções marcadas em /servicos no cadastro; viram a 1ª demanda no 1º login
  interesses_pendentes text[]
);

-- ── Sessões (cookie httpOnly guarda só o token) ─────────────────────────────
create table if not exists sessoes (
  token       text primary key,
  empresa_id  uuid not null references empresas (id) on delete cascade,
  created_at  timestamptz not null default now(),
  expires_at  timestamptz not null
);
create index if not exists sessoes_empresa_idx on sessoes (empresa_id);
create index if not exists sessoes_expira_idx on sessoes (expires_at);

-- ── Demandas (enviadas pelas empresas; status controlado pelo admin) ────────
create table if not exists demandas (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  empresa_id  uuid not null references empresas (id) on delete cascade,
  titulo      text not null,
  descricao   text,
  status      text not null default 'nova' check (status in ('nova', 'em_analise', 'em_andamento', 'concluida')),
  interesses  text[]
);
create index if not exists demandas_empresa_idx on demandas (empresa_id, created_at desc);

-- ── Entregas (acompanhamento do projeto: o que foi e o que será entregue) ───
-- O ADMIN cadastra e move o status; a EMPRESA acompanha no painel dela.
create table if not exists entregas (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  empresa_id   uuid not null references empresas (id) on delete cascade,
  titulo       text not null,
  descricao    text,
  status       text not null default 'planejada' check (status in ('planejada', 'em_andamento', 'entregue')),
  entregue_em  timestamptz
);
create index if not exists entregas_empresa_idx on entregas (empresa_id, created_at desc);

-- ── Órbita (constelação de parceiros na home/universo) ──────────────────────
-- em_orbita + logo_url preenchida = a empresa aparece no átomo do site.
-- logo_solicitada_em marca o pedido do admin (banner no painel da empresa).
alter table empresas add column if not exists em_orbita boolean not null default false;
alter table empresas add column if not exists logo_solicitada_em timestamptz;
alter table empresas add column if not exists site_url text;
-- URL do contrato (PDF no bucket) exibido no painel da empresa; o admin inclui depois.
alter table empresas add column if not exists contrato_url text;

-- ── Tentativas de login (defesa contra força bruta) ─────────────────────────
-- Contador persistido no banco, não em memória: o Cloud Run escala horizontal e
-- um contador por instância seria contornável só batendo em instâncias diferentes.
create table if not exists login_tentativas (
  id          bigserial primary key,
  chave       text not null,  -- email:<email> ou ip:<addr>
  criado_em   timestamptz not null default now()
);
create index if not exists login_tentativas_chave_idx on login_tentativas (chave, criado_em desc);
