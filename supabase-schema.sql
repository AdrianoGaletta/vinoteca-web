-- ============================================================
-- VINOTECA WEB — Schema completo para Supabase
-- Correr en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ============================================================
-- 1. PERFILES DE USUARIO
-- Extiende auth.users con datos adicionales del cliente
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  nombre      text,
  apellido    text,
  telefono    text,
  direccion   text,
  ciudad      text,
  provincia   text,
  codigo_postal text,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Row Level Security: cada usuario solo ve su propio perfil
alter table public.profiles enable row level security;

drop policy if exists "Usuarios ven su propio perfil" on public.profiles;
drop policy if exists "Usuarios actualizan su propio perfil" on public.profiles;
drop policy if exists "Usuarios insertan su propio perfil" on public.profiles;

create policy "Usuarios ven su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Usuarios actualizan su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Usuarios insertan su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger: crea perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 2. PRODUCTOS (tabla de vinos del catálogo)
-- ============================================================
create table if not exists public.productos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  bodega      text not null,
  varietal    text not null,
  anio        integer,
  descripcion text,
  precio      numeric(10, 2) not null check (precio >= 0),
  precio_anterior numeric(10, 2),
  imagen      text,
  stock       integer not null default 0 check (stock >= 0),
  destacado   boolean default false,
  activo      boolean default true,
  slug        text unique,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);

-- Índices para búsquedas frecuentes
create index if not exists productos_varietal_idx on public.productos(varietal);
create index if not exists productos_destacado_idx on public.productos(destacado);
create index if not exists productos_activo_idx on public.productos(activo);

-- Lectura pública para productos activos
alter table public.productos enable row level security;

drop policy if exists "Productos activos visibles para todos" on public.productos;

create policy "Productos activos visibles para todos"
  on public.productos for select
  using (activo = true);

-- ============================================================
-- 3. CARRITO (persistente por usuario)
-- ============================================================
create table if not exists public.carritos (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references auth.users(id) on delete cascade,
  estado      text not null default 'activo' check (estado in ('activo', 'abandonado', 'convertido')),
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null,
  unique (usuario_id, estado) deferrable initially deferred
);

alter table public.carritos enable row level security;

drop policy if exists "Usuarios ven su propio carrito" on public.carritos;

create policy "Usuarios ven su propio carrito"
  on public.carritos for all
  using (auth.uid() = usuario_id);

-- ============================================================
-- 4. ITEMS DEL CARRITO
-- ============================================================
create table if not exists public.carrito_items (
  id              uuid primary key default gen_random_uuid(),
  carrito_id      uuid not null references public.carritos(id) on delete cascade,
  producto_id     uuid not null references public.productos(id) on delete cascade,
  cantidad        integer not null default 1 check (cantidad > 0),
  precio_unitario numeric(10, 2) not null,
  created_at      timestamptz default now() not null,
  updated_at      timestamptz default now() not null,
  unique (carrito_id, producto_id)
);

alter table public.carrito_items enable row level security;

drop policy if exists "Usuarios ven items de su carrito" on public.carrito_items;

create policy "Usuarios ven items de su carrito"
  on public.carrito_items for all
  using (
    carrito_id in (
      select id from public.carritos where usuario_id = auth.uid()
    )
  );

-- ============================================================
-- 5. PEDIDOS (órdenes de compra)
-- ============================================================
create table if not exists public.pedidos (
  id                uuid primary key default gen_random_uuid(),
  usuario_id        uuid not null references auth.users(id) on delete restrict,
  estado            text not null default 'pendiente'
    check (estado in ('pendiente', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado')),
  subtotal          numeric(10, 2) not null,
  descuento         numeric(10, 2) default 0,
  costo_envio       numeric(10, 2) default 0,
  total             numeric(10, 2) not null,
  nombre_receptor   text,
  direccion_entrega text,
  ciudad_entrega    text,
  provincia_entrega text,
  notas             text,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);

alter table public.pedidos enable row level security;

drop policy if exists "Usuarios ven sus propios pedidos" on public.pedidos;
drop policy if exists "Usuarios crean sus propios pedidos" on public.pedidos;

create policy "Usuarios ven sus propios pedidos"
  on public.pedidos for select
  using (auth.uid() = usuario_id);

create policy "Usuarios crean sus propios pedidos"
  on public.pedidos for insert
  with check (auth.uid() = usuario_id);

-- ============================================================
-- 6. ITEMS DEL PEDIDO
-- ============================================================
create table if not exists public.pedido_items (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid not null references public.pedidos(id) on delete cascade,
  producto_id     uuid references public.productos(id) on delete set null,
  nombre_producto text not null,
  bodega_producto text,
  cantidad        integer not null check (cantidad > 0),
  precio_unitario numeric(10, 2) not null,
  subtotal        numeric(10, 2) generated always as (cantidad * precio_unitario) stored,
  created_at      timestamptz default now() not null
);

alter table public.pedido_items enable row level security;

drop policy if exists "Usuarios ven items de sus pedidos" on public.pedido_items;
drop policy if exists "Usuarios crean items de sus pedidos" on public.pedido_items;

create policy "Usuarios ven items de sus pedidos"
  on public.pedido_items for select
  using (
    pedido_id in (
      select id from public.pedidos where usuario_id = auth.uid()
    )
  );

create policy "Usuarios crean items de sus pedidos"
  on public.pedido_items for insert
  with check (
    pedido_id in (
      select id from public.pedidos where usuario_id = auth.uid()
    )
  );

-- ============================================================
-- 7. TRANSACCIONES (pagos)
-- ============================================================
create table if not exists public.transacciones (
  id                  uuid primary key default gen_random_uuid(),
  pedido_id           uuid not null references public.pedidos(id) on delete restrict,
  estado              text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobado', 'rechazado', 'reembolsado')),
  metodo_pago         text check (metodo_pago in ('tarjeta', 'transferencia', 'mercadopago', 'efectivo')),
  monto               numeric(10, 2) not null,
  moneda              text default 'ARS',
  referencia_externa  text,
  datos_pago          jsonb,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

alter table public.transacciones enable row level security;

drop policy if exists "Usuarios ven sus propias transacciones" on public.transacciones;

create policy "Usuarios ven sus propias transacciones"
  on public.transacciones for select
  using (
    pedido_id in (
      select id from public.pedidos where usuario_id = auth.uid()
    )
  );

-- ============================================================
-- 8. FUNCIÓN updated_at automático
-- ============================================================
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

create trigger set_productos_updated_at
  before update on public.productos
  for each row execute procedure public.set_updated_at();

create trigger set_carritos_updated_at
  before update on public.carritos
  for each row execute procedure public.set_updated_at();

create trigger set_carrito_items_updated_at
  before update on public.carrito_items
  for each row execute procedure public.set_updated_at();

create trigger set_pedidos_updated_at
  before update on public.pedidos
  for each row execute procedure public.set_updated_at();

create trigger set_transacciones_updated_at
  before update on public.transacciones
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 9. DATOS INICIALES (los 6 vinos del catálogo estático)
-- ============================================================
insert into public.productos (nombre, bodega, varietal, anio, descripcion, precio, imagen, stock, destacado, slug)
values
  ('Malbec Reserva',    'Zuccardi',         'Malbec',            2022, 'Vino tinto de cuerpo completo con notas de frutas negras y taninos suaves. Ideal para carnes rojas.',                          4500,  '/images/vino-1.png', 50, true,  'malbec-reserva-zuccardi'),
  ('Cabernet Franc',    'Catena Zapata',    'Cabernet Franc',    2021, 'Elegante y especiado, con aromas a pimiento rojo y especias. Perfecto para pastas y quesos maduros.',                        5200,  '/images/vino-2.png', 30, true,  'cabernet-franc-catena-zapata'),
  ('Torrontés',         'La Rioja Alta',    'Torrontés',         2023, 'Vino blanco floral y aromático, típicamente argentino. Maridaje perfecto con mariscos y ensaladas.',                         3800,  '/images/vino-3.png', 40, false, 'torrontes-la-rioja-alta'),
  ('Gran Malbec',       'Achaval Ferrer',   'Malbec',            2020, 'Expresión máxima del Malbec mendocino. Complejidad excepcional con 18 meses en barricas de roble francés.',                  8900,  '/images/vino-4.png', 20, true,  'gran-malbec-achaval-ferrer'),
  ('Bonarda Clásico',   'Finca La Celia',   'Bonarda',           2022, 'Vino joven y frutal, con carácter propio. Notas de cerezas y ciruelas con un final fresco y agradable.',                    3200,  '/images/vino-5.png', 60, false, 'bonarda-clasico-finca-la-celia'),
  ('Chardonnay Barrel', 'Norton',           'Chardonnay',        2022, 'Chardonnay fermentado en barrica, con notas de vainilla y frutas tropicales. Textura cremosa y equilibrada.',               4100,  '/images/vino-6.png', 35, false, 'chardonnay-barrel-norton')
on conflict (slug) do nothing;
