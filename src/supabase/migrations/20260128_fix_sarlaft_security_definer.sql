-- Fix: Make save_sarlaft_v2 SECURITY DEFINER to bypass RLS for child tables
-- This allows the function to insert into child tables even when status changes from draft

create or replace function public.save_sarlaft_v2(p_payload jsonb, p_form_id uuid default null)
returns uuid
language plpgsql
security definer
set search_path = public
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

  -- Datos persona (comunes)
  v_doc_type := nullif(p_payload->'personData'->>'docType','');
  v_doc_number := nullif(p_payload->'personData'->>'docNumber','');

  -- INSERT o UPDATE
  if p_form_id is null then
    -- INSERT nuevo form
    insert into public.sarlaft_forms (
      user_id, date_agreement, city_agreement, type_person_agreement,
      person_doc_type, person_doc_number, status, payload
    )
    values (
      auth.uid(),
      v_date,
      v_city_agreement,
      v_type_person,
      v_doc_type,
      v_doc_number,
      v_status,
      p_payload
    )
    returning id into v_id;
  else
    -- UPDATE form existente (verificar que pertenece al usuario y está en draft)
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
