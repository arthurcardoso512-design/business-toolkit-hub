create extension if not exists "pgcrypto";

create type public.app_role as enum ('admin', 'user');
create type public.access_status as enum ('active', 'expired', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'expired', 'cancelled', 'refunded');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  company_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  duration_days integer not null check (duration_days > 0),
  price numeric(10,2) not null check (price >= 0),
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null default '',
  is_free boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.access_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  status public.access_status not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id) on delete set null,
  amount numeric(10,2) not null check (amount >= 0),
  provider text not null default 'asaas',
  external_payment_id text,
  status public.payment_status not null default 'pending',
  pix_payload text,
  pix_qr_image text,
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index payments_provider_external_id_idx
  on public.payments(provider, external_payment_id)
  where external_payment_id is not null;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique(user_id, role)
);

create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'asaas',
  event_id text not null,
  event_type text,
  processed_at timestamptz not null default now(),
  unique(provider, event_id)
);

create table public.app_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index access_periods_user_expires_idx on public.access_periods(user_id, expires_at desc);
create index payments_user_created_idx on public.payments(user_id, created_at desc);
create index app_logs_user_created_idx on public.app_logs(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger access_periods_set_updated_at before update on public.access_periods
for each row execute function public.set_updated_at();
create trigger payments_set_updated_at before update on public.payments
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'company_name', '')
  )
  on conflict (id) do update
  set name = excluded.name,
      email = excluded.email,
      company_name = excluded.company_name,
      updated_at = now();

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_premium(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.access_periods
    where user_id = _user_id
      and status = 'active'
      and expires_at > now()
  );
$$;

create or replace function public.premium_expires_at(_user_id uuid)
returns timestamptz
language sql
stable
security definer
set search_path = public
as $$
  select max(expires_at)
  from public.access_periods
  where user_id = _user_id
    and status = 'active'
    and expires_at > now();
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.tools enable row level security;
alter table public.access_periods enable row level security;
alter table public.payments enable row level security;
alter table public.user_roles enable row level security;
alter table public.webhook_events enable row level security;
alter table public.app_logs enable row level security;

create policy "profiles_select_own" on public.profiles
for select to authenticated using (id = auth.uid());
create policy "profiles_update_own" on public.profiles
for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "plans_select_active" on public.plans
for select to anon, authenticated using (active = true);

create policy "tools_select_active" on public.tools
for select to anon, authenticated using (active = true);

create policy "access_periods_select_own" on public.access_periods
for select to authenticated using (user_id = auth.uid());

create policy "payments_select_own" on public.payments
for select to authenticated using (user_id = auth.uid());

create policy "user_roles_select_own" on public.user_roles
for select to authenticated using (user_id = auth.uid());

create policy "app_logs_select_admin" on public.app_logs
for select to authenticated using (public.has_role(auth.uid(), 'admin'));

insert into public.plans (name, slug, duration_days, price, sort_order)
values
  ('1 mês', 'mensal', 30, 19.90, 1),
  ('3 meses', 'trimestral', 90, 49.90, 2),
  ('1 ano', 'anual', 365, 0, 3)
on conflict (slug) do update
set name = excluded.name,
    duration_days = excluded.duration_days,
    price = excluded.price,
    sort_order = excluded.sort_order;

insert into public.tools (name, slug, category, description, is_free, sort_order)
values
  ('Gerador de Link WhatsApp', 'link-whatsapp', 'Links', 'Crie um link para seus clientes iniciarem uma conversa no WhatsApp.', true, 1),
  ('Gerador de QR Code', 'qr-code', 'QR Codes', 'Gere QR Codes para links, textos, Wi-Fi e outros conteúdos.', true, 2),
  ('Link na Bio Inteligente', 'link-bio', 'Links', 'Crie uma página com seus principais links em um só lugar.', false, 3),
  ('Link Temporário', 'link-temporario', 'Links', 'Crie links que funcionam apenas durante um período definido.', false, 4),
  ('Encurtador de Links', 'encurtador', 'Links', 'Transforme URLs longas em links curtos e fáceis de compartilhar.', false, 5),
  ('Botões WhatsApp / Redes Sociais', 'botoes-site', 'Links', 'Gere botões prontos para adicionar ao seu site.', false, 6),
  ('QR Code Personalizado', 'qr-personalizado', 'QR Codes', 'Personalize cores, estilos e logo do seu QR Code.', false, 7),
  ('QR Code Dinâmico', 'qr-dinamico', 'QR Codes', 'Altere o destino do QR Code sem precisar reimprimir.', false, 8),
  ('QR Code Wi-Fi', 'qr-wifi', 'QR Codes', 'Compartilhe o acesso à sua rede Wi-Fi por QR Code.', false, 9),
  ('QR Code Pix', 'qr-pix', 'Pix', 'Crie QR Codes Pix com ou sem valor definido.', false, 10),
  ('Placa Pix', 'placa-pix', 'Pix', 'Crie uma placa Pix profissional para seu negócio.', false, 11),
  ('Orçamento', 'orcamento', 'Documentos', 'Monte orçamentos profissionais e prontos para compartilhar.', false, 12),
  ('Recibo', 'recibo', 'Documentos', 'Gere recibos profissionais para seus clientes.', false, 13),
  ('Cartão Digital', 'cartao-digital', 'Presença digital', 'Crie uma página digital com seus contatos e canais.', false, 14)
on conflict (slug) do update
set name = excluded.name,
    category = excluded.category,
    description = excluded.description,
    is_free = excluded.is_free,
    sort_order = excluded.sort_order;
