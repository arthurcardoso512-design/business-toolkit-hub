-- ENUMS
create type public.app_role as enum ('admin', 'user');
create type public.access_status as enum ('active', 'expired', 'cancelled');
create type public.payment_status as enum ('pending', 'paid', 'expired', 'cancelled', 'refunded');

-- UTIL
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

-- PROFILES
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  company_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

-- USER ROLES
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role);
$$;

create policy "user_roles_select_own" on public.user_roles for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

create policy "profiles_select_admin" on public.profiles for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- PLANS
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  duration_days int not null,
  price numeric(10,2) not null,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.plans to anon, authenticated;
grant all on public.plans to service_role;
alter table public.plans enable row level security;
create policy "plans_public_read" on public.plans for select to anon, authenticated using (active = true);
create policy "plans_admin_all" on public.plans for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.plans (name, slug, duration_days, price, sort_order) values
  ('1 mês', 'mensal', 30, 19.90, 1),
  ('3 meses', 'trimestral', 90, 49.90, 2),
  ('1 ano', 'anual', 365, 169.90, 3);

-- ACCESS PERIODS (premium)
create table public.access_periods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id),
  status public.access_status not null default 'active',
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index access_periods_user_idx on public.access_periods(user_id, expires_at desc);
grant select on public.access_periods to authenticated;
grant all on public.access_periods to service_role;
alter table public.access_periods enable row level security;
create policy "access_select_own" on public.access_periods for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create trigger access_periods_updated_at before update on public.access_periods for each row execute function public.set_updated_at();

-- PAYMENTS
create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid references public.plans(id),
  amount numeric(10,2) not null,
  provider text not null default 'asaas',
  external_payment_id text unique,
  status public.payment_status not null default 'pending',
  pix_payload text,
  pix_qr_image text,
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payments_user_idx on public.payments(user_id, created_at desc);
grant select on public.payments to authenticated;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
create policy "payments_select_own" on public.payments for select to authenticated using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();

-- WEBHOOK EVENTS (idempotência)
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'asaas',
  event_id text not null,
  event_type text,
  processed_at timestamptz not null default now(),
  unique (provider, event_id)
);
grant all on public.webhook_events to service_role;
alter table public.webhook_events enable row level security;

-- TOOLS
create table public.tools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null default '',
  is_free boolean not null default false,
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
grant select on public.tools to anon, authenticated;
grant all on public.tools to service_role;
alter table public.tools enable row level security;
create policy "tools_public_read" on public.tools for select to anon, authenticated using (active = true);
create policy "tools_admin_all" on public.tools for all to authenticated using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

insert into public.tools (name, slug, category, description, is_free, sort_order) values
  ('Link WhatsApp Inteligente','link-whatsapp','Links','Crie um link para seus clientes iniciarem uma conversa no WhatsApp.',true,1),
  ('Link na Bio Inteligente','link-bio','Links','Uma página com todos os seus links importantes.',false,2),
  ('Link Temporário','link-temporario','Links','Um link que funciona apenas no período que você definir.',false,3),
  ('Encurtador de Links','encurtador','Links','Transforme links longos em endereços curtos.',false,4),
  ('Botões para Site','botoes-site','Links','Botões de WhatsApp e redes sociais para colocar no seu site.',false,5),
  ('QR Code Universal','qr-code','QR Codes','Gere QR Codes para link, texto, telefone, e-mail, contato e Wi-Fi.',true,6),
  ('QR Code Personalizado','qr-personalizado','QR Codes','QR Code com a sua logo, cores e identidade visual.',false,7),
  ('QR Code Dinâmico','qr-dinamico','QR Codes','Troque o destino do QR sem reimprimir e acompanhe os acessos.',false,8),
  ('QR Code Wi-Fi','qr-wifi','QR Codes','Seus clientes conectam no Wi-Fi sem digitar senha.',true,9),
  ('QR Code Pix','qr-pix','Pix','QR Code para receber pagamentos por Pix.',false,10),
  ('Placa Pix Personalizável','placa-pix','Pix','Uma placa bonita para deixar no balcão do seu negócio.',false,11),
  ('Orçamento Personalizável','orcamento','Documentos','Monte orçamentos profissionais em PDF.',false,12),
  ('Recibo','recibo','Documentos','Emita recibos profissionais para seus clientes.',false,13),
  ('Cartão Digital','cartao-digital','Presença digital','Sua página de apresentação com contato e endereço.',false,14);

-- LOGS
create table public.app_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index app_logs_created_idx on public.app_logs(created_at desc);
grant select on public.app_logs to authenticated;
grant all on public.app_logs to service_role;
alter table public.app_logs enable row level security;
create policy "logs_admin_read" on public.app_logs for select to authenticated using (public.has_role(auth.uid(), 'admin'));

-- PREMIUM CHECK
create or replace function public.is_premium(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.access_periods
    where user_id = _user_id and status = 'active' and expires_at > now()
  );
$$;

create or replace function public.premium_expires_at(_user_id uuid)
returns timestamptz language sql stable security definer set search_path = public as $$
  select max(expires_at) from public.access_periods
  where user_id = _user_id and status = 'active' and expires_at > now();
$$;

-- NEW USER TRIGGER
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, company_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'company_name', '')
  )
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role) values (new.id, 'user') on conflict do nothing;
  insert into public.app_logs (user_id, event) values (new.id, 'user_created');
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();