# Cava del Plata — Vinoteca Web

Aplicación web full-stack para una vinoteca boutique argentina. Desarrollada con Next.js 16, React 19, Supabase y Mercado Pago.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 — inline styles con CSS variables |
| Base de datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth (email + password) |
| Pagos | Mercado Pago Checkout Pro |
| Despliegue | Vercel |
| CI/CD | GitHub Actions |

---

## Funcionalidades

- **Catálogo** con filtros por varietal, carga desde Supabase
- **Detalle de vino** con selector de cantidad y agregar al carrito
- **Carrito** persistido en localStorage (anónimo) y en Supabase (autenticado), con sincronización automática al iniciar sesión
- **Autenticación** completa: registro, login, recuperación de contraseña
- **Checkout** con validación client-side y server-side, integración con Mercado Pago Checkout Pro
- **Webhooks** de Mercado Pago para actualización automática del estado de pago
- **Panel de administración** (`/admin`) con CRUD completo de productos
- **API REST interna** en `/api/productos` y `/api/checkout`

---

## Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Mercado Pago
MP_ACCESS_TOKEN=APP_USR-tu-access-token

# URL del sitio (para back_urls de MP y webhooks)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

Para obtener credenciales de Mercado Pago: [developers.mercadopago.com](https://developers.mercadopago.com)

---

## Esquema de base de datos (Supabase)

```sql
-- Productos
create table productos (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  bodega      text not null,
  varietal    text not null,
  anio        integer,
  descripcion text,
  precio      numeric not null,
  imagen      text,
  stock       integer default 0,
  destacado   boolean default false,
  activo      boolean default true,
  slug        text unique not null,
  created_at  timestamptz default now()
);

-- Carritos
create table carritos (
  id         uuid primary key default gen_random_uuid(),
  usuario_id uuid references auth.users,
  estado     text default 'activo',
  created_at timestamptz default now()
);

-- Items del carrito
create table carrito_items (
  id              uuid primary key default gen_random_uuid(),
  carrito_id      uuid references carritos,
  producto_id     uuid references productos,
  cantidad        integer not null,
  precio_unitario numeric not null,
  unique(carrito_id, producto_id)
);

-- Pedidos
create table pedidos (
  id                  uuid primary key default gen_random_uuid(),
  usuario_id          uuid references auth.users,
  estado              text default 'pendiente',
  subtotal            numeric,
  costo_envio         numeric,
  total               numeric,
  nombre_receptor     text,
  direccion_entrega   text,
  ciudad_entrega      text,
  provincia_entrega   text,
  notas               text,
  created_at          timestamptz default now()
);

-- Items del pedido
create table pedido_items (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid references pedidos,
  producto_id     uuid references productos,
  nombre_producto text,
  bodega_producto text,
  cantidad        integer,
  precio_unitario numeric,
  subtotal        numeric generated always as (cantidad * precio_unitario) stored
);

-- Transacciones
create table transacciones (
  id         uuid primary key default gen_random_uuid(),
  pedido_id  uuid references pedidos,
  estado     text default 'pendiente',
  monto      numeric,
  moneda     text default 'ARS',
  created_at timestamptz default now()
);

-- Perfiles de usuario
create table profiles (
  id        uuid primary key references auth.users,
  nombre    text,
  apellido  text,
  direccion text,
  ciudad    text,
  provincia text
);
```

---

## Instalación y desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/vinoteca-web.git
cd vinoteca-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## API interna

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/productos` | Lista (soporta `?activo=true&destacado=true&varietal=Malbec&limit=3`) |
| `POST` | `/api/productos` | Crea un nuevo producto |
| `GET` | `/api/productos/:id` | Obtiene un producto por ID |
| `PUT` | `/api/productos/:id` | Actualiza un producto |
| `DELETE` | `/api/productos/:id` | Elimina un producto |

### Checkout

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/checkout` | Crea preferencia de Mercado Pago, devuelve `init_point` |

### Webhooks

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/webhook/mercadopago` | Recibe notificaciones de pago de Mercado Pago |

---

## Flujo de pago (Mercado Pago Checkout Pro)

```
Usuario llena checkout
       ↓
crearPedido (Server Action)
  → Crea pedido (estado: pendiente)
  → Crea transacción (estado: pendiente)
  → Descuenta stock / limpia carrito
  → Crea preferencia en MP
       ↓
Redirige a Mercado Pago
       ↓
Usuario paga
       ↓
MP llama a /api/webhook/mercadopago
  → Actualiza transacción (aprobado/rechazado)
  → Actualiza pedido (pagado/cancelado)
       ↓
MP redirige a /pedido/:id?pago=aprobado|fallido|pendiente
```

---

## CI/CD y despliegue

El pipeline en `.github/workflows/ci.yml` corre en cada push y PR a `main`:
1. `npm ci` — instala dependencias
2. `npm run lint` — linter
3. `npm run build` — compilación

El despliegue en Vercel es automático. Cada PR genera una **Preview URL**.

### GitHub Secrets requeridos

En `Settings → Secrets and variables → Actions`:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
MP_ACCESS_TOKEN
NEXT_PUBLIC_SITE_URL
```

---

## Estructura del proyecto

```
vinoteca-web/
├── app/
│   ├── page.js                    # Home (destacados con loading/error)
│   ├── catalogo/page.js           # Catálogo con filtros por varietal
│   ├── vino/[id]/page.js          # Detalle de producto
│   ├── carrito/page.js            # Carrito
│   ├── checkout/                  # Checkout + integración MP
│   ├── pedido/[id]/page.js        # Confirmación + estado MP
│   ├── admin/page.js              # Panel CRUD de productos
│   ├── auth/                      # Login, registro, recuperación
│   ├── mi-cuenta/                 # Cuenta del usuario
│   └── api/
│       ├── productos/             # REST API de productos
│       ├── checkout/              # Preferencias Mercado Pago
│       └── webhook/mercadopago/   # Webhook de pagos
├── components/
│   ├── Navbar.js
│   ├── Footer.js
│   ├── CartContext.js             # Estado global del carrito
│   └── ProductCard.js
├── lib/
│   ├── supabase.js                # Cliente browser (singleton)
│   └── supabase/
│       ├── client.js              # Cliente browser (factory)
│       └── server.js              # Cliente server-side
├── data/
│   └── vinos.js                   # fetchVinos / fetchDestacados / fetchVino
└── .github/workflows/ci.yml       # Pipeline CI
```

---

## Desarrollado por

Adriano — Trabajo Práctico PW 2026 Q1
