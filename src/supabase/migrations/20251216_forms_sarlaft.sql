begin;

-- =========================
-- 0) LIMPIEZA (DROP)
-- =========================
-- Tablas hijas primero
drop table if exists public.sarlaft_foreign_products cascade;
drop table if exists public.sarlaft_account_entity_financials cascade;
drop table if exists public.sarlaft_relations cascade;

-- Tabla principal
drop table if exists public.sarlaft_forms cascade;

-- Funciones
drop function if exists public.set_updated_at cascade;
drop function if exists public.save_sarlaft_v2(jsonb, uuid) cascade;

-- Tipo enum
drop type if exists public.sarlaft_status cascade;

-- Extensión
create extension if not exists pgcrypto;

-- =========================
-- 1) ENUM DE ESTADOS
-- =========================
create type public.sarlaft_status as enum ('draft','submitted','approved','rejected');

-- =========================
-- 2) updated_at trigger
-- =========================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =========================
-- 3) TABLA PRINCIPAL
-- =========================
create table public.sarlaft_forms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Header mínimo (según tu nuevo payload)
  date_agreement date not null,
  city_agreement text not null,
  type_person_agreement text not null check (type_person_agreement in ('NAT','JUR')),

  -- Documento “principal” (NAT = naturalPerson.typeDoc/docNumber, JUR = NIT/nit)
  person_doc_type text,
  person_doc_number text,

  status public.sarlaft_status not null default 'draft',
  payload jsonb not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_sarlaft_forms_updated_at
before update on public.sarlaft_forms
for each row execute function public.set_updated_at();

-- Índices recomendados
create index sarlaft_forms_user_id_idx on public.sarlaft_forms(user_id);
create index sarlaft_forms_status_idx on public.sarlaft_forms(status);
create index sarlaft_forms_date_idx on public.sarlaft_forms(date_agreement);
create index sarlaft_forms_person_doc_idx on public.sarlaft_forms(person_doc_type, person_doc_number);
create index sarlaft_forms_payload_gin_idx on public.sarlaft_forms using gin (payload);

-- =========================
-- 4) TABLAS HIJAS (arrays)
-- =========================

-- 4.1 relations[]
create table public.sarlaft_relations (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  type_doc text,
  doc_number text,
  social_name text,
  percentage_participation numeric(6,2),
  activity_admin_resource text,
  activity_reputation_grade_public text,

  created_at timestamptz not null default now()
);

create unique index sarlaft_relations_unique_pos
on public.sarlaft_relations(sarlaft_id, position);

create index sarlaft_relations_sarlaft_id_idx
on public.sarlaft_relations(sarlaft_id);

-- 4.2 accountEntityFinancials[]
create table public.sarlaft_account_entity_financials (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  account_type text,
  account_number text,
  account_name_entity text,

  created_at timestamptz not null default now()
);

create unique index sarlaft_aef_unique_pos
on public.sarlaft_account_entity_financials(sarlaft_id, position);

create index sarlaft_aef_sarlaft_id_idx
on public.sarlaft_account_entity_financials(sarlaft_id);

-- 4.3 foreignCurrency.products[]
create table public.sarlaft_foreign_products (
  id uuid primary key default gen_random_uuid(),
  sarlaft_id uuid not null references public.sarlaft_forms(id) on delete cascade,
  position int not null,

  type text,
  entity text,
  country text,
  currency text,

  created_at timestamptz not null default now()
);

create unique index sarlaft_forprod_unique_pos
on public.sarlaft_foreign_products(sarlaft_id, position);

create index sarlaft_forprod_sarlaft_id_idx
on public.sarlaft_foreign_products(sarlaft_id);

-- =========================
-- 5) RLS + POLICIES
-- =========================
alter table public.sarlaft_forms enable row level security;
alter table public.sarlaft_relations enable row level security;
alter table public.sarlaft_account_entity_financials enable row level security;
alter table public.sarlaft_foreign_products enable row level security;

-- 5.1 sarlaft_forms: el usuario solo ve/crea lo suyo
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

-- Solo se puede editar/borrar en draft
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

-- 5.2 tablas hijas: dependen del form padre (solo draft para escribir)
-- relations
drop policy if exists sarlaft_rel_select_own on public.sarlaft_relations;
create policy sarlaft_rel_select_own
on public.sarlaft_relations
for select
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_rel_write_own_draft on public.sarlaft_relations;
create policy sarlaft_rel_write_own_draft
on public.sarlaft_relations
for all
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
)
with check (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
);

-- account_entity_financials
drop policy if exists sarlaft_aef_select_own on public.sarlaft_account_entity_financials;
create policy sarlaft_aef_select_own
on public.sarlaft_account_entity_financials
for select
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_aef_write_own_draft on public.sarlaft_account_entity_financials;
create policy sarlaft_aef_write_own_draft
on public.sarlaft_account_entity_financials
for all
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
)
with check (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
);

-- foreign_products
drop policy if exists sarlaft_forprod_select_own on public.sarlaft_foreign_products;
create policy sarlaft_forprod_select_own
on public.sarlaft_foreign_products
for select
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid()
  )
);

drop policy if exists sarlaft_forprod_write_own_draft on public.sarlaft_foreign_products;
create policy sarlaft_forprod_write_own_draft
on public.sarlaft_foreign_products
for all
using (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
)
with check (
  exists (
    select 1 from public.sarlaft_forms f
    where f.id = sarlaft_id and f.user_id = auth.uid() and f.status = 'draft'
  )
);

-- =========================
-- 6) RPC: GUARDA FORM + HIJAS (TRANSACCIONAL)
-- =========================
create or replace function public.save_sarlaft_v2(p_payload jsonb, p_form_id uuid default null)
returns uuid
language plpgsql
as $$
declare
  v_id uuid;
  v_date date;
  v_city_agreement text;
  v_type_person text;
  v_doc_type text;
  v_doc_number text;
  v_status public.sarlaft_status;
begin
  if auth.uid() is null then
    raise exception 'Unauthorized';
  end if;

  -- Requeridos base
  v_date := (substring(p_payload->>'dateAggrement' from 1 for 10))::date;
  v_city_agreement := nullif(p_payload->>'cityAggrement','');
  v_type_person := nullif(p_payload->>'typePersonAggrement','');

  -- En "guardar", si no te mandan status, lo dejamos draft.
  v_status := coalesce(nullif(p_payload->>'status','')::public.sarlaft_status, 'draft'::public.sarlaft_status);

  if v_date is null or v_city_agreement is null or v_type_person is null then
    raise exception 'Missing required fields (dateAggrement, cityAggrement, typePersonAggrement)';
  end if;

  -- Documento principal según NAT/JUR
  if v_type_person = 'NAT' then
    v_doc_type := nullif(p_payload->'naturalPerson'->>'typeDoc','');
    v_doc_number := nullif(p_payload->'naturalPerson'->>'docNumber','');
  elsif v_type_person = 'JUR' then
    v_doc_type := 'NIT';
    v_doc_number := nullif(p_payload->'juridicalPerson'->>'nit','');
  else
    raise exception 'typePersonAggrement must be NAT or JUR';
  end if;

  -- INSERT o UPDATE (solo editable si draft)
  if p_form_id is null then
    insert into public.sarlaft_forms (
      user_id, date_agreement, city_agreement, type_person_agreement,
      person_doc_type, person_doc_number, status, payload
    ) values (
      auth.uid(), v_date, v_city_agreement, v_type_person,
      v_doc_type, v_doc_number, v_status, p_payload
    )
    returning id into v_id;
  else
    update public.sarlaft_forms f
      set
        date_agreement = v_date,
        city_agreement = v_city_agreement,
        type_person_agreement = v_type_person,
        person_doc_type = v_doc_type,
        person_doc_number = v_doc_number,
        status = v_status,
        payload = p_payload
    where f.id = p_form_id
      and f.user_id = auth.uid()
      and f.status = 'draft'
    returning f.id into v_id;

    if v_id is null then
      raise exception 'Form not found or not editable (only draft)';
    end if;
  end if;

  -- Sync relations
  delete from public.sarlaft_relations where sarlaft_id = v_id;

  insert into public.sarlaft_relations (
    sarlaft_id, position, type_doc, doc_number, social_name,
    percentage_participation, activity_admin_resource, activity_reputation_grade_public
  )
  select
    v_id,
    (r.ordinality - 1)::int,
    nullif(r.value->>'typeDoc',''),
    nullif(r.value->>'docNumber',''),
    nullif(r.value->>'socialName',''),
    nullif(r.value->>'percentageParticipation','')::numeric,
    nullif(r.value->>'activityAdminResource',''),
    nullif(r.value->>'activityReputationGradePublic','')
  from jsonb_array_elements(coalesce(p_payload->'relations','[]'::jsonb)) with ordinality as r(value, ordinality);

  -- Sync accountEntityFinancials
  delete from public.sarlaft_account_entity_financials where sarlaft_id = v_id;

  insert into public.sarlaft_account_entity_financials (
    sarlaft_id, position, account_type, account_number, account_name_entity
  )
  select
    v_id,
    (a.ordinality - 1)::int,
    nullif(a.value->>'accountType',''),
    nullif(a.value->>'accountNumber',''),
    nullif(a.value->>'accountNameEntity','')
  from jsonb_array_elements(coalesce(p_payload->'accountEntityFinancials','[]'::jsonb)) with ordinality as a(value, ordinality);

  -- Sync foreignCurrency.products
  delete from public.sarlaft_foreign_products where sarlaft_id = v_id;

  insert into public.sarlaft_foreign_products (
    sarlaft_id, position, type, entity, country, currency
  )
  select
    v_id,
    (f.ordinality - 1)::int,
    nullif(f.value->>'type',''),
    nullif(f.value->>'entity',''),
    nullif(f.value->>'country',''),
    nullif(f.value->>'currency','')
  from jsonb_array_elements(coalesce(p_payload->'foreignCurrency'->'products','[]'::jsonb)) with ordinality as f(value, ordinality);

  return v_id;
end;
$$;

commit;
