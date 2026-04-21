-- ╔══════════════════════════════════════════════╗
-- ║   MI COMPLI — Schema inicial                 ║
-- ╚══════════════════════════════════════════════╝

-- Extensiones
create extension if not exists "uuid-ossp";

-- Tipos
create type user_role as enum ('cliente', 'complice', 'admin');
create type orden_estado as enum ('pendiente', 'confirmada', 'en_proceso', 'completada', 'cancelada');
create type addon_tipo as enum ('ubicacion', 'musica', 'extra');
create type categoria_tipo as enum ('regalo', 'experiencia');

-- ─── PROFILES ──────────────────────────────────
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  email       text not null unique,
  full_name   text,
  phone       text,
  role        user_role not null default 'cliente',
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Auto-crear profile al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── EXPERIENCIAS ──────────────────────────────
create table experiencias (
  id          uuid default uuid_generate_v4() primary key,
  nombre      text not null,
  descripcion text not null,
  categoria   categoria_tipo not null,
  precio_base numeric(10,2) not null check (precio_base >= 0),
  imagen_url  text,
  emoji       text default '✨',
  activo      boolean default true,
  created_at  timestamptz default now()
);

-- ─── EXPERIENCIA ADDONS ────────────────────────
create table experiencia_addons (
  id              uuid default uuid_generate_v4() primary key,
  experiencia_id  uuid references experiencias on delete cascade,
  nombre          text not null,
  descripcion     text,
  precio          numeric(10,2) not null default 0,
  icon            text default '✦',
  tipo            addon_tipo not null default 'extra',
  orden           integer default 0
);

-- ─── ORDENES ───────────────────────────────────
create table ordenes (
  id                     uuid default uuid_generate_v4() primary key,
  numero                 text unique,
  cliente_id             uuid references profiles on delete set null,
  experiencia_id         uuid references experiencias on delete set null,
  estado                 orden_estado not null default 'pendiente',
  fecha_deseada          date not null,
  para_nombre            text not null,
  mensaje_personal       text,
  total                  numeric(10,2) not null,
  addons_seleccionados   jsonb default '[]',
  created_at             timestamptz default now(),
  updated_at             timestamptz default now()
);

-- Generar número de orden legible: MC-YYYYMMDD-XXXX
create or replace function generate_orden_numero()
returns trigger language plpgsql as $$
declare
  seq int;
begin
  select coalesce(max(
    nullif(regexp_replace(numero, '^MC-\d{8}-', ''), '')::int
  ), 0) + 1
  into seq
  from ordenes
  where numero like 'MC-' || to_char(now(), 'YYYYMMDD') || '-%';

  new.numero := 'MC-' || to_char(now(), 'YYYYMMDD') || '-' || lpad(seq::text, 4, '0');
  return new;
end;
$$;

create trigger set_orden_numero
  before insert on ordenes
  for each row execute procedure generate_orden_numero();

-- ─── ORDEN COMPLICES ───────────────────────────
create table orden_complices (
  id           uuid default uuid_generate_v4() primary key,
  orden_id     uuid references ordenes on delete cascade,
  complice_id  uuid references profiles on delete set null,
  servicio_id  uuid,
  estado       text not null default 'asignado',
  notas        text,
  created_at   timestamptz default now()
);

-- ─── SERVICIOS DE COMPLICES ────────────────────
create table servicios (
  id           uuid default uuid_generate_v4() primary key,
  complice_id  uuid references profiles on delete cascade,
  nombre       text not null,
  descripcion  text not null,
  categoria    categoria_tipo not null,
  precio_base  numeric(10,2) not null,
  imagenes     text[] default '{}',
  activo       boolean default true,
  created_at   timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ────────────────────────
alter table profiles enable row level security;
alter table experiencias enable row level security;
alter table experiencia_addons enable row level security;
alter table ordenes enable row level security;
alter table orden_complices enable row level security;
alter table servicios enable row level security;

-- Profiles: cada uno ve el suyo
create policy "profiles: ver el propio" on profiles
  for select using (auth.uid() = id);
create policy "profiles: editar el propio" on profiles
  for update using (auth.uid() = id);

-- Experiencias: públicas para lectura
create policy "experiencias: lectura publica" on experiencias
  for select using (activo = true);

-- Addons: públicos para lectura
create policy "addons: lectura publica" on experiencia_addons
  for select using (true);

-- Ordenes: el cliente ve las suyas
create policy "ordenes: ver propias" on ordenes
  for select using (auth.uid() = cliente_id);
create policy "ordenes: crear" on ordenes
  for insert with check (auth.uid() = cliente_id);

-- Cómplices ven sus asignaciones
create policy "orden_complices: ver asignadas" on orden_complices
  for select using (auth.uid() = complice_id);

-- Servicios: propios + lectura pública activos
create policy "servicios: lectura publica activos" on servicios
  for select using (activo = true);
create policy "servicios: gestionar propios" on servicios
  for all using (auth.uid() = complice_id);

-- ─── SEED DATA ─────────────────────────────────
insert into experiencias (nombre, descripcion, categoria, precio_base, emoji) values
  ('Bouquet de rosas premium', 'Arreglo floral de 24 rosas con tarjeta personalizada y caja elegante.', 'regalo', 650, '🌹'),
  ('Caja de chocolates artesanal', 'Selección curada de 18 chocolates belgas con mensaje manuscrito.', 'regalo', 480, '🍫'),
  ('Peluche + globo + detalle', 'Un set completo para hacer sonreír. Ideal para cualquier ocasión.', 'regalo', 390, '🧸'),
  ('Cena romántica', 'Reservación privada con decoración de velas, menú especial. Orquestamos todo.', 'experiencia', 1200, '🍷'),
  ('Desayuno sorpresa a domicilio', 'Llegamos a su puerta con desayuno completo, decoración y un detalle.', 'experiencia', 780, '🌅'),
  ('Reconciliación perfecta', 'Lo más difícil es dar el primer paso. Nosotros lo hacemos memorable.', 'experiencia', 950, '💌');

-- Addons para Cena romántica (id dinámico)
do $$
declare v_id uuid;
begin
  select id into v_id from experiencias where nombre = 'Cena romántica';
  insert into experiencia_addons (experiencia_id, nombre, precio, icon, tipo, orden) values
    (v_id, 'La Trattoria', 0, '🏛️', 'ubicacion', 1),
    (v_id, 'Rooftop 360', 200, '🌇', 'ubicacion', 2),
    (v_id, 'Jardín secreto', 150, '🌿', 'ubicacion', 3),
    (v_id, 'En casa', 100, '🏠', 'ubicacion', 4),
    (v_id, 'Jazz suave', 0, '🎷', 'musica', 1),
    (v_id, 'Clásica', 0, '🎻', 'musica', 2),
    (v_id, 'Bossa nova', 0, '🎸', 'musica', 3),
    (v_id, 'Pastel personalizado', 350, '🎂', 'extra', 1),
    (v_id, 'Fotógrafo', 600, '📸', 'extra', 2),
    (v_id, 'Arreglo floral', 280, '💐', 'extra', 3),
    (v_id, 'Violinista en vivo', 800, '🎻', 'extra', 4),
    (v_id, 'Champagne', 250, '🫧', 'extra', 5),
    (v_id, 'Carta manuscrita', 120, '✉️', 'extra', 6);
end $$;
