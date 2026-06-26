-- QuBit — fundação do portal de parceiros (Supabase Auth).
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.

-- ── Perfis (1:1 com auth.users) ─────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  created_at    timestamptz not null default now(),
  role          text not null default 'empresa' check (role in ('empresa', 'admin')),
  nome_empresa  text not null default '',
  cnpj          text,
  responsavel   text,
  whatsapp      text,
  email         text
);

alter table public.profiles enable row level security;

-- Cria o perfil automaticamente quando um usuário se cadastra (a partir dos
-- metadados enviados no signUp). Roda como SECURITY DEFINER (ignora RLS).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_empresa, cnpj, responsavel, whatsapp, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome_empresa', ''),
    new.raw_user_meta_data ->> 'cnpj',
    new.raw_user_meta_data ->> 'responsavel',
    new.raw_user_meta_data ->> 'whatsapp',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper sem recursão de RLS: o usuário atual é admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- RLS dos perfis: cada um lê/edita o seu; admin lê todos.
drop policy if exists "perfil proprio - select" on public.profiles;
create policy "perfil proprio - select" on public.profiles
  for select to authenticated using (auth.uid() = id or public.is_admin());

drop policy if exists "perfil proprio - update" on public.profiles;
create policy "perfil proprio - update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ── Demandas (enviadas por empresas logadas) ────────────────────────────────
create table if not exists public.demandas (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  empresa_id   uuid not null references public.profiles (id) on delete cascade,
  titulo       text not null,
  descricao    text,
  status       text not null default 'nova' check (status in ('nova', 'em_analise', 'em_andamento', 'concluida')),
  interesses   text[]
);

alter table public.demandas enable row level security;
create index if not exists demandas_empresa_idx on public.demandas (empresa_id, created_at desc);

-- A empresa cria e lê as PRÓPRIAS demandas; o admin lê (e atualiza) TODAS.
drop policy if exists "empresa insere demanda" on public.demandas;
create policy "empresa insere demanda" on public.demandas
  for insert to authenticated with check (auth.uid() = empresa_id);

drop policy if exists "empresa le suas demandas" on public.demandas;
create policy "empresa le suas demandas" on public.demandas
  for select to authenticated using (auth.uid() = empresa_id or public.is_admin());

drop policy if exists "admin atualiza demandas" on public.demandas;
create policy "admin atualiza demandas" on public.demandas
  for update to authenticated using (public.is_admin());

-- ── Tornar VOCÊ admin (rode depois de se cadastrar com seu e-mail) ──────────
-- update public.profiles set role = 'admin' where email = 'SEU-EMAIL-AQUI';
