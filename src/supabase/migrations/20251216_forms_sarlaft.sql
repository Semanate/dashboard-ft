begin;

-- 1) Extensión para gen_random_uuid()
create extension if not exists pgcrypto;

-- 2) Enum de estados
do $$
begin
  if not exists (select 1 from pg_type where typname = 'sarlaft_status') then
    create type public.sarlaft_status as enum ('draft','submitted','approved','rejected');
  end if;
end $$;

-- 3) Función/trigger para updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 4) Tabla principal
create table if not exists public.sarlaft_forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  date_agreement date not null,
  city_agreement text not null,
  city text not null,
  type_document text not null,
  document_number text not null,

  status public.sarlaft_status not null default 'draft',

  -- JSON completo del formulario (tu objeto)
  payload jsonb not null,

  -- Campos “rápidos” derivados del JSON (para indexar/filtrar sin duplicar lógica en frontend)
  is_pep boolean generated always as (coalesce((payload->'pep'->>'isPep')::boolean, false)) stored,
  pep_related boolean generated always as (coalesce((payload->'pep'->>'pepRelated')::boolean, false)) stored,
  operation_currency text generated always as (coalesce(payload->'financialInfo'->>'operationCurrency', 'COP')) stored,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_trigger
    where tgname = 'trg_sarlaft_forms_updated_at'
  ) then
    create trigger trg_sarlaft_forms_updated_at
    before update on public.sarlaft_forms
    for each row execute function public.set_updated_at();
  end if;
end $$;

-- Índices principales
create index if not exists sarlaft_forms_user_id_idx on public.sarlaft_forms(user_id);
create index if not exists sarlaft_forms_doc_idx on public.sarlaft_forms(type_document, document_number);
create index if not exists sarlaft_forms_status_idx on public.sarlaft_forms(status);
create index if not exists sarlaft_forms_payload_gin_idx on public.sarlaft_forms using gin (payload);
create index if not exists sarlaft_forms_pep_idx on public.sarlaft_forms(is_pep, pep_related);

-- 5) Tablas hijas (arrays)

-- 5.1 relations[]
create table if not exists public.sarlaft_relations (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  type_doc text,
  doc_number text,
  social_name text,
  percentage_participation numeric(6,2), -- ejemplo: 0.00 a 100.00
  activity_admin_resource text,
  activity_reputation_grade_public text,

  created_at timestamptz not null default now()
);

create unique index if not exists sarlaft_relations_unique_pos
on public.sarlaft_relations(sarlaft_id, position);

create index if not exists sarlaft_relations_sarlaft_id_idx
on public.sarlaft_relations(sarlaft_id);

-- 5.2 accountEntityFinancials[]
create table if not exists public.sarlaft_account_entity_financials (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  account_type text,
  account_number text,
  account_name_entity text,

  created_at timestamptz not null default now()
);

create unique index if not exists sarlaft_aef_unique_pos
on public.sarlaft_account_entity_financials(sarlaft_id, position);

create index if not exists sarlaft_aef_sarlaft_id_idx
on public.sarlaft_account_entity_financials(sarlaft_id);

-- 5.3 commercialReferences[]
create table if not exists public.sarlaft_commercial_references (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  entity text,
  phone text,
  product_type text,
  relationship_time text,

  created_at timestamptz not null default now()
);

create unique index if not exists sarlaft_comref_unique_pos
on public.sarlaft_commercial_references(sarlaft_id, position);

create index if not exists sarlaft_comref_sarlaft_id_idx
on public.sarlaft_commercial_references(sarlaft_id);

-- 5.4 personalReferences[]
create table if not exists public.sarlaft_personal_references (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  name text,
  phone text,
  relationship text,
  knowledge_time text,

  created_at timestamptz not null default now()
);

create unique index if not exists sarlaft_perref_unique_pos
on public.sarlaft_personal_references(sarlaft_id, position);

create index if not exists sarlaft_perref_sarlaft_id_idx
on public.sarlaft_personal_references(sarlaft_id);

-- 5.5 foreignCurrency.products[]
create table if not exists public.sarlaft_foreign_products (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  type text,
  entity text,
  country text,
  currency text,

  created_at timestamptz not null default now()
);

create unique index if not exists sarlaft_forprod_unique_pos
on public.sarlaft_foreign_products(sarlaft_id, position);

create index if not exists sarlaft_forprod_sarlaft_id_idx
on public.sarlaft_foreign_products(sarlaft_id);

-- 6) RLS
alter table public.sarlaft_forms enable row level security;
alter table public.sarlaft_relations enable row level security;
alter table public.sarlaft_account_entity_financials enable row level security;
alter table public.sarlaft_commercial_references enable row level security;
alter table public.sarlaft_personal_references enable row level security;
alter table public.sarlaft_foreign_products enable row level security;

-- 6.1 Policies tabla principal
drop policy if exists sarlaft_forms_select_own on public.sarlaft_forms;
create policy sarlaft_forms_select_own
on public.sarlaft_forms
for select
using (user_id = auth.uid());

drop policy if exists sarlaft_forms_insert_own on public.sarlaft_forms;
create policy sarlaft_forms_insert_own
on public.sarlaft_forms
for insert
with check (user_id = auth.uid());

-- Solo se puede editar/borrar mientras está en draft
drop policy if exists sarlaft_forms_update_own_draft on public.sarlaft_forms;
create policy sarlaft_forms_update_own_draft
on public.sarlaft_forms
for update
using (user_id = auth.uid() and status = 'draft')
with check (user_id = auth.uid() and status = 'draft');

drop policy if exists sarlaft_forms_delete_own_draft on public.sarlaft_forms;
create policy sarlaft_forms_delete_own_draft
on public.sarlaft_forms
for delete
using (user_id = auth.uid() and status = 'draft');

-- 6.2 Policies tablas hijas (aplican por pertenencia al form padre)
-- helper: condición de pertenencia al sarlaft padre
-- (se repite por limitación de SQL policies)

-- relations
drop policy if exists sarlaft_rel_select_own on public.sarlaft_relations;
create policy sarlaft_rel_select_own
on public.sarlaft_relations
for select
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_rel_write_own_draft on public.sarlaft_relations;
create policy sarlaft_rel_write_own_draft
on public.sarlaft_relations
for all
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
)
with check (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
);

-- account entity financials
drop policy if exists sarlaft_aef_select_own on public.sarlaft_account_entity_financials;
create policy sarlaft_aef_select_own
on public.sarlaft_account_entity_financials
for select
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_aef_write_own_draft on public.sarlaft_account_entity_financials;
create policy sarlaft_aef_write_own_draft
on public.sarlaft_account_entity_financials
for all
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
)
with check (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
);

-- commercial references
drop policy if exists sarlaft_comref_select_own on public.sarlaft_commercial_references;
create policy sarlaft_comref_select_own
on public.sarlaft_commercial_references
for select
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_comref_write_own_draft on public.sarlaft_commercial_references;
create policy sarlaft_comref_write_own_draft
on public.sarlaft_commercial_references
for all
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
)
with check (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
);

-- personal references
drop policy if exists sarlaft_perref_select_own on public.sarlaft_personal_references;
create policy sarlaft_perref_select_own
on public.sarlaft_personal_references
for select
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_perref_write_own_draft on public.sarlaft_personal_references;
create policy sarlaft_perref_write_own_draft
on public.sarlaft_personal_references
for all
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
)
with check (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
);

-- foreign products
drop policy if exists sarlaft_forprod_select_own on public.sarlaft_foreign_products;
create policy sarlaft_forprod_select_own
on public.sarlaft_foreign_products
for select
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_forprod_write_own_draft on public.sarlaft_foreign_products;
create policy sarlaft_forprod_write_own_draft
on public.sarlaft_foreign_products
for all
using (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
)
with check (
  exists (
    select 1
    from public.sarlaft_forms f
    where f.id = sarlaft_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
  )
);

commit;

-- ====== EJEMPLO DE INSERT (opcional) ======
-- En el SQL editor auth.uid() normalmente devuelve NULL (no hay contexto JWT).
-- Hazlo desde tu app con supabase-js usando el user.id real.
--
-- insert into public.sarlaft_forms (
--   user_id, date_agreement, city_agreement, city, type_document, document_number, payload
-- ) values (
--   '00000000-0000-0000-0000-000000000000'::uuid,
--   '2025-12-02',
--   'CAL',
--   'CAL',
--   'CE',
--   'asd12312',
--   '{ "dateAggrement":"2025-12-02T05:00:00.000Z", "cityAggrement":"CAL", ... }'::jsonb
-- ) returning id;
