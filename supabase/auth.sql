-- QuBit — portal de parceiros (Supabase Auth + perfis + demandas + storage).
-- Idempotente: pode rodar de novo com segurança. SQL Editor → cole tudo → Run.

-- ── Perfis (1:1 com auth.users) ─────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users (id) on delete cascade,
  created_at     timestamptz not null default now(),
  role           text not null default 'empresa' check (role in ('empresa', 'admin')),
  nome_fantasia  text not null default '',
  cnpj           text,
  responsavel    text,
  area           text,    -- área/segmento da empresa
  regiao         text,    -- cidade / estado
  telefone       text,
  email          text,
  logo_url       text
);

-- Migração para instalações antigas (renomeia colunas e adiciona as novas).
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='nome_empresa') then
    alter table public.profiles rename column nome_empresa to nome_fantasia;
  end if;
  if exists (select 1 from information_schema.columns where table_schema='public' and table_name='profiles' and column_name='whatsapp') then
    alter table public.profiles rename column whatsapp to telefone;
  end if;
end $$;
alter table public.profiles add column if not exists nome_fantasia text not null default '';
alter table public.profiles add column if not exists cnpj text;
alter table public.profiles add column if not exists responsavel text;
alter table public.profiles add column if not exists area text;
alter table public.profiles add column if not exists regiao text;
alter table public.profiles add column if not exists telefone text;
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists logo_url text;

alter table public.profiles enable row level security;

-- Cria o perfil automaticamente no cadastro (a partir dos metadados do signUp).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, nome_fantasia, cnpj, responsavel, area, regiao, telefone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome_fantasia', ''),
    new.raw_user_meta_data ->> 'cnpj',
    new.raw_user_meta_data ->> 'responsavel',
    new.raw_user_meta_data ->> 'area',
    new.raw_user_meta_data ->> 'regiao',
    new.raw_user_meta_data ->> 'telefone',
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

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

drop policy if exists "empresa insere demanda" on public.demandas;
create policy "empresa insere demanda" on public.demandas
  for insert to authenticated with check (auth.uid() = empresa_id);

drop policy if exists "empresa le suas demandas" on public.demandas;
create policy "empresa le suas demandas" on public.demandas
  for select to authenticated using (auth.uid() = empresa_id or public.is_admin());

drop policy if exists "admin atualiza demandas" on public.demandas;
create policy "admin atualiza demandas" on public.demandas
  for update to authenticated using (public.is_admin());

-- ── Storage: logos das empresas (bucket público; cada um escreve a sua) ─────
insert into storage.buckets (id, name, public)
values ('logos', 'logos', true)
on conflict (id) do nothing;

drop policy if exists "logos: leitura publica" on storage.objects;
create policy "logos: leitura publica" on storage.objects
  for select using (bucket_id = 'logos');

drop policy if exists "logos: empresa envia a sua" on storage.objects;
create policy "logos: empresa envia a sua" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "logos: empresa atualiza a sua" on storage.objects;
create policy "logos: empresa atualiza a sua" on storage.objects
  for update to authenticated
  using (bucket_id = 'logos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ── Vire VOCÊ admin (depois de se cadastrar) ────────────────────────────────
-- update public.profiles set role = 'admin' where email = 'SEU-EMAIL-AQUI';
