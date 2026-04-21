-- ============================================================
-- MI COMPLI — Schema inicial
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- Habilitar extensiones
create extension if not exists "uuid-ossp";

-- ─── ENUM TYPES ─────────────────────────────────────────────

create type rol_usuario as enum ('cliente', 'complice', 'admin');
create type categoria_experiencia as enum ('regalo', 'experiencia');
create type estado_orden as enum ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada');
create type estado_asignacion as enum ('asignado', 'aceptado', 'completado');

-- ─── PERFILES ───────────────────────────────────────────────
-- Extiende auth.users de Supabase

create table perfiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text not null,
  email       text not null,
  telefono    text,
  rol         rol_usuario not null default 'cliente',
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Trigger: crear perfil automáticamente al registrarse
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.perfiles (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ─── CÓMPLICES ──────────────────────────────────────────────

create table complices (
  id               uuid primary key default uuid_generate_v4(),
  perfil_id        uuid not null references perfiles(id) on delete cascade,
  nombre_negocio   text not null,
  descripcion      text,
  categoria        text not null,          -- ej: 'florería', 'restaurante', 'fotógrafo'
  calificacion     numeric(3,2) default 5.0,
  total_ordenes    int default 0,
  activo           boolean default true,
  created_at       timestamptz not null default now(),
  unique(perfil_id)
);

-- ─── EXPERIENCIAS ───────────────────────────────────────────

create table experiencias (
  id          uuid primary key default uuid_generate_v4(),
  nombre      text not null,
  descripcion text not null,
  categoria   categoria_experiencia not null,
  precio_base numeric(10,2) not null,
  emoji       text not null default '✨',
  imagen_url  text,
  activa      boolean default true,
  created_at  timestamptz not null default now()
);

-- Ubicaciones disponibles por experiencia
create table ubicaciones (
  id               uuid primary key default uuid_generate_v4(),
  experiencia_id   uuid not null references experiencias(id) on delete cascade,
  nombre           text not null,
  precio_extra     numeric(10,2) not null default 0
);

-- Ambientes musicales por experiencia
create table ambientes_musicales (
  id               uuid primary key default uuid_generate_v4(),
  experiencia_id   uuid not null references experiencias(id) on delete cascade,
  nombre           text not null,
  precio_extra     numeric(10,2) not null default 0
);

-- Addons (extras que el usuario puede agregar)
create table addons (
  id               uuid primary key default uuid_generate_v4(),
  experiencia_id   uuid not null references experiencias(id) on delete cascade,
  nombre           text not null,
  descripcion      text,
  precio           numeric(10,2) not null,
  emoji            text not null default '✦',
  activo           boolean default true
);

-- ─── ÓRDENES ────────────────────────────────────────────────

create table ordenes (
  id                    uuid primary key default uuid_generate_v4(),
  cliente_id            uuid not null references perfiles(id),
  experiencia_id        uuid not null references experiencias(id),
  estado                estado_orden not null default 'pendiente',
  precio_total          numeric(10,2) not null,
  fecha_deseada         date,
  para_nombre           text not null,
  mensaje_personal      text,
  ubicacion_id          uuid references ubicaciones(id),
  ambiente_musical_id   uuid references ambientes_musicales(id),
  created_at            timestamptz not null default now()
);

-- Addons seleccionados en una orden
create table ordenes_addons (
  orden_id   uuid not null references ordenes(id) on delete cascade,
  addon_id   uuid not null references addons(id),
  primary key (orden_id, addon_id)
);

-- ─── ASIGNACIONES A CÓMPLICES ───────────────────────────────

create table asignaciones (
  id          uuid primary key default uuid_generate_v4(),
  orden_id    uuid not null references ordenes(id) on delete cascade,
  complice_id uuid not null references complices(id),
  estado      estado_asignacion not null default 'asignado',
  notas       text,
  created_at  timestamptz not null default now()
);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────

alter table perfiles          enable row level security;
alter table complices         enable row level security;
alter table experiencias      enable row level security;
alter table ubicaciones       enable row level security;
alter table ambientes_musicales enable row level security;
alter table addons            enable row level security;
alter table ordenes           enable row level security;
alter table ordenes_addons    enable row level security;
alter table asignaciones      enable row level security;

-- Perfiles: cada usuario ve y edita solo el suyo
create policy "perfil: leer propio" on perfiles
  for select using (auth.uid() = id);
create policy "perfil: actualizar propio" on perfiles
  for update using (auth.uid() = id);

-- Experiencias y sus datos son públicos para lectura
create policy "experiencias: lectura pública" on experiencias
  for select using (activa = true);
create policy "ubicaciones: lectura pública" on ubicaciones
  for select using (true);
create policy "ambientes: lectura pública" on ambientes_musicales
  for select using (true);
create policy "addons: lectura pública" on addons
  for select using (activo = true);

-- Órdenes: el cliente ve las suyas; el cómplice ve las asignadas
create policy "ordenes: cliente ve las suyas" on ordenes
  for select using (auth.uid() = cliente_id);
create policy "ordenes: cliente crea" on ordenes
  for insert with check (auth.uid() = cliente_id);

-- Cómplices: ven sus asignaciones
create policy "asignaciones: complice ve las suyas" on asignaciones
  for select using (
    complice_id in (
      select id from complices where perfil_id = auth.uid()
    )
  );

-- ─── ÍNDICES ────────────────────────────────────────────────

create index idx_ordenes_cliente    on ordenes(cliente_id);
create index idx_ordenes_estado     on ordenes(estado);
create index idx_asignaciones_orden on asignaciones(orden_id);
create index idx_asignaciones_comp  on asignaciones(complice_id);
