# Cava del Plata — Vinoteca Web

Aplicación web full-stack para una vinoteca boutique argentina. Desarrollada con Next.js 16, React 19, Supabase y Mercado Pago.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 — CSS variables + breakpoints responsive |
| Base de datos | Supabase (PostgreSQL + RLS) |
| Autenticación | Supabase Auth (email + password, roles vía `app_metadata`) |
| Pagos | Mercado Pago Checkout Pro |
| Despliegue | Vercel |
| CI/CD | GitHub Actions |

---

## Funcionalidades

- **Catálogo** con filtros por varietal, **servido por la API interna** (`/api/productos`)
- **Detalle de vino** con selector de cantidad y agregar al carrito
- **Carrito** persistido en localStorage (anónimo) y en Supabase (autenticado), con sincronización automática al iniciar sesión
- **Autenticación** completa: registro, login, recuperación de contraseña
- **Checkout** con validación de contenido client-side **y** server-side, integración con Mercado Pago Checkout Pro
- **Webhooks** de Mercado Pago para actualización automática del estado de pago
- **Panel de administración** (`/admin`) **protegido por login + rol admin**, con CRUD de productos y **gestión de pedidos/ventas**
- **API REST interna** en `/api/productos` con escrituras protegidas por rol

---

## Seguridad

### Panel de administración

`/admin` exige sesión iniciada **con rol de administrador**, verificado en dos capas:

1. **`proxy.js`** (middleware): corta el request antes de renderizar. Sin sesión redirige a `/auth/login?redirect=/admin`; con sesión sin rol admin redirige al inicio.
2. **`app/admin/layout.js`**: repite la verificación server-side para todas las páginas del panel.

El rol vive en `app_metadata` de Supabase Auth, que **solo puede modificarse desde el servidor** — un usuario no puede autoasignarse admin.

### Base de datos (RLS)

- `productos`: lectura pública solo de activos; escritura solo admin (política `es_admin()` sobre el JWT).
- `pedidos` / `transacciones` / `carritos`: cada usuario ve solo lo suyo; los admins ven todo.
- Las operaciones privilegiadas del servidor (webhook, panel de pedidos, stock) usan la clave *service-role*, que nunca llega al navegador.

### Crear un administrador

1. Correr `supabase-migration.sql` en el SQL Editor de Supabase (una sola vez).
2. Para promover otra cuenta: `Authentication → Users → Add user` (o registrarse en la web) y luego:

```sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
where email = 'email-del-admin@ejemplo.com';
```

3. Cerrar sesión y volver a entrar para que el token incluya el rol.

---

## Variables de entorno

Crear `.env.local` en la raíz del proyecto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key   # solo servidor: webhook, panel admin

# Mercado Pago (credenciales de una CUENTA DE PRUEBA para testear)
MP_ACCESS_TOKEN=APP_USR-tu-access-token

# URL del sitio (para back_urls de MP y webhooks)
NEXT_PUBLIC_SITE_URL=https://tu-dominio.vercel.app
```

Para obtener credenciales de Mercado Pago: [developers.mercadopago.com](https://developers.mercadopago.com)

---

## Base de datos (Supabase)

- **`supabase-schema.sql`** — esquema completo para una instalación desde cero: tablas (`productos`, `carritos`, `carrito_items`, `pedidos`, `pedido_items`, `transacciones`, `profiles`), políticas RLS, triggers y datos iniciales.
- **`supabase-migration.sql`** — migración para bases ya creadas: agrega el estado `'pagado'` al constraint de `pedidos`, la función `es_admin()`, las políticas de admin y promueve la cuenta de administrador.

Ambos se corren en el **SQL Editor** del proyecto de Supabase.

---

## Instalación y desarrollo local

```bash
# 1. Clonar el repositorio
git clone https://github.com/AdrianoGaletta/vinoteca-web.git
cd vinoteca-web

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
# Crear .env.local con las variables de la sección anterior

# 4. Crear el esquema en Supabase
# Correr supabase-schema.sql (instalación nueva) en el SQL Editor

# 5. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

---

## API interna

El front consume esta API para todo el catálogo (`data/vinos.js`) y para el CRUD del panel admin.

### Productos

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `GET` | `/api/productos` | pública | Lista productos **activos**. Filtros: `?destacado=true`, `?varietal=Malbec`, `?slug=mi-vino`, `?limit=3` |
| `GET` | `/api/productos?todos=true` | admin | Incluye también los inactivos (para el panel) |
| `POST` | `/api/productos` | admin | Crea un producto |
| `GET` | `/api/productos/:id` | pública | Detalle por ID |
| `PUT` | `/api/productos/:id` | admin | Actualiza (lista blanca de campos) |
| `DELETE` | `/api/productos/:id` | admin | Elimina |

Las rutas de escritura devuelven `401` sin sesión de administrador.

### Contacto

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| `POST` | `/api/contacto` | pública | Recibe el mensaje del formulario de contacto; revalida el contenido en el servidor (`400` si no pasa) |

### Webhooks

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/webhook/mercadopago` | Recibe notificaciones de pago; consulta el pago real a la API de MP y actualiza `transacciones` y `pedidos` |

---

## Flujo de pago (Mercado Pago Checkout Pro)

```
Usuario llena checkout (validación client + server)
       ↓
crearPedido (Server Action)
  → Valida stock y datos de envío
  → Crea pedido + items + transacción (estado: pendiente)
  → Descuenta stock / limpia carrito
       ↓
/pedido/:id → botón «Pagar con Mercado Pago»
       ↓
/pedido/:id/pagar crea la preferencia y redirige a init_point
  (init_point SIEMPRE: el sandbox_init_point está deprecado
   y rechaza los pagos de prueba)
       ↓
Usuario paga en el checkout de Mercado Pago
       ↓
Doble confirmación del estado real:
  1. MP llama a /api/webhook/mercadopago → consulta el pago a la API
     y actualiza transacción + pedido (pagado/cancelado/pendiente)
  2. Al volver a /pedido/:id se verifica el payment_id contra la API
     de MP (nunca se confía en la URL) y se marca pagado si corresponde
```

### Probar un pago en sandbox

Las credenciales configuradas pertenecen a una **cuenta de prueba** de Mercado Pago, así que `init_point` abre el checkout de test.

> ⚠️ **Importante: pagar como invitado, sin iniciar sesión en Mercado Pago.**
> Si en el checkout aparece un nombre arriba a la derecha (sesión real de MP), cerrala primero:
> Mercado Pago **deshabilita el botón «Pagar»** cuando la cuenta que paga es la misma que cobra
> o cuando se mezcla una cuenta real con el entorno de prueba.

Datos de la tarjeta de test:

| Campo | Valor |
|---|---|
| Tarjeta | `5031 7557 3453 0604` (Mastercard) |
| Vencimiento | `11/30` |
| CVV | `123` |
| Titular | `APRO` (aprueba) / `CONT` (queda pendiente) / `OTHE` (rechaza) |
| DNI | `12345678` |

Los tres titulares permiten probar los tres caminos del webhook: aprobado → pedido **pagado**, pendiente → **pendiente**, rechazado → **cancelado**. Con `APRO` el pedido pasa a **Pago aprobado** en `/mi-cuenta` y en el panel `/admin/pedidos`.

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
│   ├── page.js                    # Home (destacados vía API interna)
│   ├── catalogo/page.js           # Catálogo con filtros (vía API interna)
│   ├── vino/[id]/page.js          # Detalle de producto (vía API interna)
│   ├── carrito/page.js            # Carrito
│   ├── checkout/                  # Checkout + validaciones
│   ├── pedido/[id]/               # Confirmación + pago (route /pagar)
│   ├── admin/
│   │   ├── layout.js              # Verificación server-side de rol admin
│   │   ├── page.js                # CRUD de productos (vía API interna)
│   │   └── pedidos/               # Gestión de pedidos y ventas
│   ├── actions/                   # Server Actions (pedidos, perfil, admin)
│   ├── auth/                      # Login, registro, recuperación
│   ├── mi-cuenta/                 # Cuenta del usuario
│   └── api/
│       ├── productos/             # REST API (escrituras solo admin)
│       ├── contacto/              # Mensajes del formulario de contacto
│       └── webhook/mercadopago/   # Webhook de pagos
├── components/
│   ├── Navbar.js                  # Responsive (hamburguesa < 900px)
│   ├── Footer.js
│   ├── CartContext.js             # Estado global del carrito
│   └── ProductCard.js
├── lib/
│   ├── auth.js                    # getAdmin(): verificación de rol
│   ├── validacion.js              # Validadores compartidos cliente/servidor
│   └── supabase/
│       ├── client.js              # Cliente browser
│       ├── server.js              # Cliente server-side (cookies)
│       └── admin.js               # Cliente service-role (solo servidor)
├── proxy.js                       # Middleware: protege /admin
├── supabase-schema.sql            # Esquema completo (instalación nueva)
├── supabase-migration.sql         # Migración (bases existentes)
└── .github/workflows/ci.yml       # Pipeline CI
```

---

## Desarrollado por

Adriano — Trabajo Práctico PW 2026 Q1
