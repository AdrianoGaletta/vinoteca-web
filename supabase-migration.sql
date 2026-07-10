-- ============================================================
-- MIGRACIÓN: seguridad del panel admin + estado 'pagado'
-- Correr UNA VEZ en el SQL Editor de Supabase (es idempotente).
-- ============================================================

-- ------------------------------------------------------------
-- 1. El estado 'pagado' faltaba en el constraint de pedidos.
--    Sin esto, el webhook de Mercado Pago no puede marcar un
--    pedido como pagado.
-- ------------------------------------------------------------
alter table public.pedidos drop constraint if exists pedidos_estado_check;
alter table public.pedidos add constraint pedidos_estado_check
  check (estado in ('pendiente', 'pagado', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'));

-- ------------------------------------------------------------
-- 2. Función helper: ¿el JWT actual pertenece a un admin?
--    El rol se guarda en app_metadata (solo modificable desde
--    el servidor de Auth, nunca por el usuario).
-- ------------------------------------------------------------
create or replace function public.es_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

-- ------------------------------------------------------------
-- 3. RLS: asegurar que esté activo en todas las tablas
-- ------------------------------------------------------------
alter table public.profiles      enable row level security;
alter table public.productos     enable row level security;
alter table public.carritos      enable row level security;
alter table public.carrito_items enable row level security;
alter table public.pedidos       enable row level security;
alter table public.pedido_items  enable row level security;
alter table public.transacciones enable row level security;

-- ------------------------------------------------------------
-- 4. PRODUCTOS: el público solo lee activos; solo un admin
--    puede crear, editar o borrar (y ver inactivos).
-- ------------------------------------------------------------
drop policy if exists "Productos activos visibles para todos" on public.productos;
create policy "Productos activos visibles para todos"
  on public.productos for select
  using (activo = true);

drop policy if exists "Admins gestionan productos" on public.productos;
create policy "Admins gestionan productos"
  on public.productos for all
  using (public.es_admin())
  with check (public.es_admin());

-- ------------------------------------------------------------
-- 5. PEDIDOS: los admins ven y actualizan todos los pedidos
--    (los clientes conservan sus políticas de dueño).
-- ------------------------------------------------------------
drop policy if exists "Admins ven todos los pedidos" on public.pedidos;
create policy "Admins ven todos los pedidos"
  on public.pedidos for select
  using (public.es_admin());

drop policy if exists "Admins actualizan pedidos" on public.pedidos;
create policy "Admins actualizan pedidos"
  on public.pedidos for update
  using (public.es_admin());

drop policy if exists "Admins ven items de pedidos" on public.pedido_items;
create policy "Admins ven items de pedidos"
  on public.pedido_items for select
  using (public.es_admin());

-- ------------------------------------------------------------
-- 6. TRANSACCIONES: el dueño del pedido puede crear la suya
--    (faltaba la política de insert) y los admins ven todas.
-- ------------------------------------------------------------
drop policy if exists "Usuarios crean transacciones de sus pedidos" on public.transacciones;
create policy "Usuarios crean transacciones de sus pedidos"
  on public.transacciones for insert
  with check (
    pedido_id in (
      select id from public.pedidos where usuario_id = auth.uid()
    )
  );

drop policy if exists "Admins ven todas las transacciones" on public.transacciones;
create policy "Admins ven todas las transacciones"
  on public.transacciones for select
  using (public.es_admin());

-- ------------------------------------------------------------
-- 7. PROMOVER LA CUENTA DE ADMINISTRADOR
--    Cambiá el email si tu cuenta admin usa otro.
--    (Para crear una cuenta demo para el corrector:
--     Authentication → Users → Add user → luego repetir este
--     UPDATE con ese email.)
-- ------------------------------------------------------------
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'totogaletta22@gmail.com';

-- IMPORTANTE: después de correr esta migración, cerrá sesión y volvé a
-- iniciarla en la web para que el token incluya el rol nuevo.
