-- QuBit — esquema dos leads do diagnóstico.
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.

create table if not exists public.diagnosticos (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nome        text not null,
  whatsapp    text not null,
  email       text not null,
  segmento    text not null,
  mensagem    text,
  interesses  text[]
);

-- Liga Row Level Security (sem policy, ninguém acessa pela API).
alter table public.diagnosticos enable row level security;

-- Permite INSERT anônimo (formulário público envia com a publishable key)...
drop policy if exists "anon insere diagnostico" on public.diagnosticos;
create policy "anon insere diagnostico"
  on public.diagnosticos
  for insert
  to anon
  with check (true);

-- ...e NÃO concede SELECT: os leads ficam privados (você lê pelo painel do
-- Supabase, que usa a service role). A publishable key só consegue inserir.

-- Índice por data, para listar os leads mais recentes no painel.
create index if not exists diagnosticos_created_at_idx
  on public.diagnosticos (created_at desc);
