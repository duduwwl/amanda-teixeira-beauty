-- Amanda Teixeira Beauty — agenda online
-- Postgres / Supabase. Fuso de referência: America/Sao_Paulo.
-- Toda regra de disponibilidade e de conflito vive aqui, no servidor.

create extension if not exists btree_gist;

-- ---------------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------------
do $$ begin
  create type booking_status as enum ('pendente', 'confirmado', 'concluido', 'cancelado', 'nao_compareceu');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Tabelas
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id uuid primary key,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  name text not null check (length(name) between 2 and 80),
  category text not null default 'estetica',
  short_description text not null default '',
  description text not null default '',
  duration_min integer not null check (duration_min between 10 and 480),
  buffer_min integer not null default 15 check (buffer_min between 0 and 120),
  price_cents integer check (price_cents is null or price_cents >= 0),
  price_note text,
  requires_evaluation boolean not null default false,
  notes text,
  active boolean not null default true,
  sort integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id smallint primary key default 1 check (id = 1),
  timezone text not null default 'America/Sao_Paulo',
  slot_step_min integer not null default 30 check (slot_step_min between 5 and 120),
  min_notice_hours integer not null default 12 check (min_notice_hours between 0 and 168),
  max_days_ahead integer not null default 60 check (max_days_ahead between 1 and 365),
  booking_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.business_settings (id) values (1) on conflict do nothing;

-- Várias faixas por dia permitem intervalo de almoço (ex.: 09–12 e 13–19).
create table if not exists public.opening_hours (
  id serial primary key,
  weekday smallint not null check (weekday between 0 and 6), -- 0 = domingo
  start_time time not null,
  end_time time not null,
  check (end_time > start_time)
);

create table if not exists public.holidays (
  day date primary key,
  name text not null default 'Feriado'
);

create table if not exists public.blocks (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text,
  created_by uuid,
  created_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  email text,
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  professional text not null default 'amanda',
  service_id uuid not null references public.services(id),
  customer_id uuid references public.customers(id) on delete set null,
  -- cópia dos dados no momento da reserva (o serviço pode mudar depois)
  service_name text not null,
  duration_min integer not null,
  buffer_min integer not null default 0,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  blocked_until timestamptz not null,      -- fim + intervalo entre atendimentos
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  notes text,
  contact_preference text not null default 'whatsapp' check (contact_preference in ('whatsapp', 'ligacao', 'email')),
  privacy_accepted_at timestamptz not null,
  marketing_opt_in boolean not null default false,
  status booking_status not null default 'pendente',
  cancel_reason text,
  anonymized boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at),
  check (blocked_until >= ends_at),
  -- Garantia final contra dois atendimentos simultâneos da mesma profissional,
  -- mesmo sob concorrência: o banco rejeita a segunda inserção.
  constraint bookings_no_overlap exclude using gist (
    professional with =,
    tstzrange(starts_at, blocked_until, '[)') with &&
  ) where (status in ('pendente', 'confirmado'))
);
create index if not exists bookings_starts_idx on public.bookings (starts_at);
create index if not exists bookings_phone_idx on public.bookings (customer_phone);

create table if not exists public.booking_events (
  id bigserial primary key,
  booking_id uuid not null references public.bookings(id) on delete cascade,
  action text not null,
  from_status booking_status,
  to_status booking_status,
  details jsonb not null default '{}'::jsonb,
  actor uuid,
  created_at timestamptz not null default now()
);
create index if not exists booking_events_booking_idx on public.booking_events (booking_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Funções auxiliares
-- ---------------------------------------------------------------------------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;

drop trigger if exists services_touch on public.services;
create trigger services_touch before update on public.services for each row execute function public.touch_updated_at();
drop trigger if exists bookings_touch on public.bookings;
create trigger bookings_touch before update on public.bookings for each row execute function public.touch_updated_at();
drop trigger if exists customers_touch on public.customers;
create trigger customers_touch before update on public.customers for each row execute function public.touch_updated_at();

-- Histórico de alterações (inserção, mudança de status, reagendamento)
create or replace function public.log_booking_event() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into booking_events (booking_id, action, to_status, details, actor)
    values (new.id, 'criado', new.status, jsonb_build_object('starts_at', new.starts_at), auth.uid());
  elsif new.status is distinct from old.status then
    insert into booking_events (booking_id, action, from_status, to_status, details, actor)
    values (new.id, 'status', old.status, new.status, jsonb_build_object('motivo', new.cancel_reason), auth.uid());
  elsif new.starts_at is distinct from old.starts_at then
    insert into booking_events (booking_id, action, from_status, to_status, details, actor)
    values (new.id, 'reagendado', old.status, new.status,
            jsonb_build_object('de', old.starts_at, 'para', new.starts_at), auth.uid());
  end if;
  return new;
end $$;
drop trigger if exists bookings_log on public.bookings;
create trigger bookings_log after insert or update on public.bookings for each row execute function public.log_booking_event();

-- Código legível sem caracteres ambíguos (0/O, 1/I)
create or replace function public.new_booking_code() returns text
language plpgsql volatile as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  c text;
begin
  loop
    c := 'AT-';
    for i in 1..6 loop
      c := c || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    end loop;
    exit when not exists (select 1 from public.bookings where code = c);
  end loop;
  return c;
end $$;

-- ---------------------------------------------------------------------------
-- Disponibilidade
-- ---------------------------------------------------------------------------
-- Horários livres de um procedimento num dia (dia local de São Paulo).
-- p_ignore_booking permite reagendar sem colidir com a própria reserva.
create or replace function public.available_slots(
  p_service_id uuid,
  p_day date,
  p_ignore_booking uuid default null
) returns table (starts_at timestamptz, ends_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
declare
  s record;
  cfg record;
  oh record;
  tz text;
  local_today date;
  cand timestamp;          -- horário local (sem fuso)
  cand_start timestamptz;
  cand_end timestamptz;
  cand_block timestamptz;
begin
  select * into cfg from business_settings where id = 1;
  if cfg is null or not cfg.booking_enabled then return; end if;
  tz := cfg.timezone;

  select * into s from services where id = p_service_id and active;
  if s is null then return; end if;

  local_today := (now() at time zone tz)::date;
  if p_day < local_today or p_day > local_today + cfg.max_days_ahead then return; end if;
  if exists (select 1 from holidays h where h.day = p_day) then return; end if;

  for oh in
    select * from opening_hours where weekday = extract(dow from p_day)::int order by start_time
  loop
    cand := p_day + oh.start_time;
    while cand + make_interval(mins => s.duration_min) <= p_day + oh.end_time loop
      cand_start := cand at time zone tz;
      cand_end := cand_start + make_interval(mins => s.duration_min);
      cand_block := cand_end + make_interval(mins => s.buffer_min);

      if cand_start >= now() + make_interval(hours => cfg.min_notice_hours)
         and not exists (
           select 1 from bookings b
           where b.status in ('pendente', 'confirmado')
             and (p_ignore_booking is null or b.id <> p_ignore_booking)
             and tstzrange(b.starts_at, b.blocked_until, '[)') && tstzrange(cand_start, cand_block, '[)')
         )
         and not exists (
           select 1 from blocks k
           where tstzrange(k.starts_at, k.ends_at, '[)') && tstzrange(cand_start, cand_end, '[)')
         )
      then
        starts_at := cand_start;
        ends_at := cand_end;
        return next;
      end if;

      cand := cand + make_interval(mins => cfg.slot_step_min);
    end loop;
  end loop;
end $$;

-- Quantidade de horários livres por dia de um mês (para o calendário).
create or replace function public.month_availability(p_service_id uuid, p_month date)
returns table (day date, free_slots integer)
language sql stable security definer set search_path = public as $$
  select d::date, (select count(*)::int from public.available_slots(p_service_id, d::date))
  from generate_series(date_trunc('month', p_month), date_trunc('month', p_month) + interval '1 month - 1 day', interval '1 day') d;
$$;

-- Primeiro horário livre de qualquer procedimento ativo (linha "próximo horário" do site).
create or replace function public.next_free_slot()
returns table (starts_at timestamptz, service_name text)
language plpgsql stable security definer set search_path = public as $$
declare
  cfg record; d date; s record; r record;
begin
  select * into cfg from business_settings where id = 1;
  if cfg is null or not cfg.booking_enabled then return; end if;
  d := (now() at time zone cfg.timezone)::date;
  for i in 0..least(cfg.max_days_ahead, 30) loop
    for s in select id, name from services where active order by duration_min, sort loop
      select * into r from public.available_slots(s.id, d + i) limit 1;
      if found then
        starts_at := r.starts_at; service_name := s.name; return next; return;
      end if;
    end loop;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Reserva pública
-- ---------------------------------------------------------------------------
create or replace function public.create_booking(
  p_service_id uuid,
  p_starts_at timestamptz,
  p_name text,
  p_phone text,
  p_email text default null,
  p_notes text default null,
  p_contact_preference text default 'whatsapp',
  p_privacy_accepted boolean default false,
  p_marketing_opt_in boolean default false
) returns table (code text, starts_at timestamptz, ends_at timestamptz, service_name text, status booking_status)
language plpgsql volatile security definer set search_path = public as $$
declare
  s record; cfg record; v_cust uuid; v_phone text; v_name text; v_mail text; v_day date;
  b public.bookings;
begin
  select * into cfg from business_settings where id = 1;
  if cfg is null or not cfg.booking_enabled then raise exception 'agenda_fechada' using errcode = 'P0001'; end if;

  -- validação de entrada
  v_name := btrim(regexp_replace(coalesce(p_name, ''), '\s+', ' ', 'g'));
  if length(v_name) < 3 or length(v_name) > 100 or v_name !~ ' ' then
    raise exception 'nome_invalido' using errcode = 'P0001';
  end if;
  v_phone := regexp_replace(coalesce(p_phone, ''), '\D', '', 'g');
  if v_phone ~ '^55\d{10,11}$' then v_phone := substr(v_phone, 3); end if;
  if v_phone !~ '^[1-9]{2}9?\d{8}$' then raise exception 'telefone_invalido' using errcode = 'P0001'; end if;
  v_mail := nullif(lower(btrim(coalesce(p_email, ''))), '');
  if v_mail is not null and (length(v_mail) > 254 or v_mail !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$') then
    raise exception 'email_invalido' using errcode = 'P0001';
  end if;
  if p_notes is not null and length(p_notes) > 600 then raise exception 'observacao_longa' using errcode = 'P0001'; end if;
  if p_contact_preference not in ('whatsapp', 'ligacao', 'email') then raise exception 'preferencia_invalida' using errcode = 'P0001'; end if;
  if not coalesce(p_privacy_accepted, false) then raise exception 'privacidade_obrigatoria' using errcode = 'P0001'; end if;

  select * into s from services where id = p_service_id and active;
  if s is null then raise exception 'procedimento_invalido' using errcode = 'P0001'; end if;

  -- proteção contra abuso
  if (select count(*) from bookings bk where bk.customer_phone = v_phone
        and bk.status in ('pendente', 'confirmado') and bk.starts_at > now()) >= 3 then
    raise exception 'limite_reservas' using errcode = 'P0001';
  end if;
  if (select count(*) from bookings bk where bk.customer_phone = v_phone
        and bk.created_at > now() - interval '10 minutes') >= 2 then
    raise exception 'muitas_tentativas' using errcode = 'P0001';
  end if;

  -- o horário precisa estar entre os livres AGORA
  v_day := (p_starts_at at time zone cfg.timezone)::date;
  if not exists (select 1 from public.available_slots(p_service_id, v_day) a where a.starts_at = p_starts_at) then
    raise exception 'horario_indisponivel' using errcode = 'P0001';
  end if;

  insert into customers as c (name, phone, email, marketing_opt_in, marketing_opt_in_at)
  values (v_name, v_phone, v_mail, coalesce(p_marketing_opt_in, false), case when p_marketing_opt_in then now() end)
  on conflict on constraint customers_phone_key do update
    set name = excluded.name,
        email = coalesce(excluded.email, c.email),
        marketing_opt_in = excluded.marketing_opt_in or c.marketing_opt_in,
        marketing_opt_in_at = coalesce(c.marketing_opt_in_at, excluded.marketing_opt_in_at)
  returning c.id into v_cust;

  begin
    insert into bookings (code, service_id, customer_id, service_name, duration_min, buffer_min,
                          starts_at, ends_at, blocked_until, customer_name, customer_phone, customer_email,
                          notes, contact_preference, privacy_accepted_at, marketing_opt_in)
    values (public.new_booking_code(), s.id, v_cust, s.name, s.duration_min, s.buffer_min,
            p_starts_at, p_starts_at + make_interval(mins => s.duration_min),
            p_starts_at + make_interval(mins => s.duration_min + s.buffer_min),
            v_name, v_phone, v_mail, nullif(btrim(coalesce(p_notes, '')), ''), p_contact_preference, now(),
            coalesce(p_marketing_opt_in, false))
    returning * into b;
  exception when exclusion_violation then
    raise exception 'horario_indisponivel' using errcode = 'P0001';
  end;

  code := b.code; starts_at := b.starts_at; ends_at := b.ends_at;
  service_name := b.service_name; status := b.status;
  return next;
end $$;

-- ---------------------------------------------------------------------------
-- Ações administrativas
-- ---------------------------------------------------------------------------
create or replace function public.admin_reschedule(p_booking_id uuid, p_new_start timestamptz)
returns public.bookings
language plpgsql volatile security definer set search_path = public as $$
declare b public.bookings; cfg record; local_day date;
begin
  if not public.is_admin() then raise exception 'sem_permissao' using errcode = '42501'; end if;
  select * into cfg from business_settings where id = 1;
  select * into b from bookings where id = p_booking_id for update;
  if b is null then raise exception 'reserva_inexistente' using errcode = 'P0001'; end if;
  local_day := (p_new_start at time zone cfg.timezone)::date;
  if not exists (select 1 from public.available_slots(b.service_id, local_day, b.id) a where a.starts_at = p_new_start) then
    raise exception 'horario_indisponivel' using errcode = 'P0001';
  end if;
  update bookings set
    starts_at = p_new_start,
    ends_at = p_new_start + make_interval(mins => b.duration_min),
    blocked_until = p_new_start + make_interval(mins => b.duration_min + b.buffer_min),
    status = case when b.status in ('cancelado', 'nao_compareceu', 'concluido') then 'pendente' else b.status end
  where id = b.id returning * into b;
  return b;
exception when exclusion_violation then
  raise exception 'horario_indisponivel' using errcode = 'P0001';
end $$;

-- Troca toda a grade de horários de uma vez (atômico).
create or replace function public.admin_replace_hours(p_rows jsonb) returns integer
language plpgsql volatile security definer set search_path = public as $$
declare n integer;
begin
  if not public.is_admin() then raise exception 'sem_permissao' using errcode = '42501'; end if;
  delete from opening_hours where true; -- "where" explícito por causa do pg-safeupdate do Supabase
  insert into opening_hours (weekday, start_time, end_time)
  select (r->>'weekday')::smallint, (r->>'start_time')::time, (r->>'end_time')::time
  from jsonb_array_elements(coalesce(p_rows, '[]'::jsonb)) r;
  get diagnostics n = row_count;
  return n;
end $$;

-- Retenção: anonimiza dados pessoais de atendimentos encerrados há mais de N meses.
create or replace function public.purge_personal_data(p_months integer default 24) returns integer
language plpgsql volatile security definer set search_path = public as $$
declare n integer;
begin
  if auth.uid() is not null and not public.is_admin() then raise exception 'sem_permissao' using errcode = '42501'; end if;
  update bookings set customer_name = 'Removido', customer_phone = '00000000000', customer_email = null,
                      notes = null, customer_id = null, anonymized = true
  where not anonymized and ends_at < now() - make_interval(months => p_months)
    and status in ('concluido', 'cancelado', 'nao_compareceu');
  get diagnostics n = row_count;
  delete from customers c where not exists (select 1 from bookings b where b.customer_id = c.id)
    and c.created_at < now() - make_interval(months => p_months);
  return n;
end $$;

-- ---------------------------------------------------------------------------
-- Segurança: RLS e permissões
-- ---------------------------------------------------------------------------
alter table public.admins enable row level security;
alter table public.services enable row level security;
alter table public.business_settings enable row level security;
alter table public.opening_hours enable row level security;
alter table public.holidays enable row level security;
alter table public.blocks enable row level security;
alter table public.customers enable row level security;
alter table public.bookings enable row level security;
alter table public.booking_events enable row level security;

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon, authenticated;

-- Público: só lê procedimentos ativos e configurações não sensíveis.
grant select on public.services, public.business_settings, public.opening_hours, public.holidays to anon, authenticated;
drop policy if exists services_public_read on public.services;
create policy services_public_read on public.services for select using (active or public.is_admin());
drop policy if exists settings_public_read on public.business_settings;
create policy settings_public_read on public.business_settings for select using (true);
drop policy if exists hours_public_read on public.opening_hours;
create policy hours_public_read on public.opening_hours for select using (true);
drop policy if exists holidays_public_read on public.holidays;
create policy holidays_public_read on public.holidays for select using (true);

-- Administração: tudo, somente para quem está na tabela admins.
grant select, insert, update, delete on public.services, public.opening_hours, public.holidays, public.blocks to authenticated;
grant update on public.business_settings to authenticated;
grant select, update on public.bookings, public.customers to authenticated;
grant select on public.booking_events, public.admins to authenticated;
grant usage on all sequences in schema public to authenticated;

do $$
declare t text;
begin
  foreach t in array array['services', 'opening_hours', 'holidays', 'blocks'] loop
    execute format('drop policy if exists %I on public.%I', t || '_admin_all', t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_admin()) with check (public.is_admin())', t || '_admin_all', t);
  end loop;
end $$;
drop policy if exists settings_admin_update on public.business_settings;
create policy settings_admin_update on public.business_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists bookings_admin on public.bookings;
create policy bookings_admin on public.bookings for select to authenticated using (public.is_admin());
drop policy if exists bookings_admin_update on public.bookings;
create policy bookings_admin_update on public.bookings for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists customers_admin on public.customers;
create policy customers_admin on public.customers for select to authenticated using (public.is_admin());
drop policy if exists customers_admin_update on public.customers;
create policy customers_admin_update on public.customers for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists events_admin on public.booking_events;
create policy events_admin on public.booking_events for select to authenticated using (public.is_admin());
drop policy if exists admins_self on public.admins;
create policy admins_self on public.admins for select to authenticated using (user_id = auth.uid());

grant execute on function public.available_slots(uuid, date, uuid) to anon, authenticated;
grant execute on function public.month_availability(uuid, date) to anon, authenticated;
grant execute on function public.next_free_slot() to anon, authenticated;
grant execute on function public.create_booking(uuid, timestamptz, text, text, text, text, text, boolean, boolean) to anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated; -- usada nas políticas de leitura pública
grant execute on function public.admin_reschedule(uuid, timestamptz) to authenticated;
grant execute on function public.purge_personal_data(integer) to authenticated;
grant execute on function public.admin_replace_hours(jsonb) to authenticated;
