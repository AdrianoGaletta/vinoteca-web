import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import Image from 'next/image'

export const metadata = {
  title: 'Mi Cuenta | Cava del Plata',
}

const estadoLabel = {
  pendiente: 'Pendiente',
  confirmado: 'Confirmado',
  en_preparacion: 'En preparación',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const estadoColor = {
  pendiente: '#c9a84c',
  confirmado: '#2196f3',
  en_preparacion: '#ff9800',
  enviado: '#9c27b0',
  entregado: '#4caf50',
  cancelado: '#f44336',
}

export default async function MiCuentaPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const [{ data: profile }, { data: pedidos }] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single(),
    supabase
      .from('pedidos')
      .select(`
        *,
        pedido_items (
          id,
          nombre_producto,
          bodega_producto,
          cantidad,
          precio_unitario,
          subtotal
        )
      `)
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const nombre = profile?.nombre || user.user_metadata?.nombre || ''
  const apellido = profile?.apellido || user.user_metadata?.apellido || ''

  return (
    <div style={{ minHeight: '100vh', background: 'var(--negro)', paddingTop: '6rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2.2rem', color: 'var(--crema)', marginBottom: '0.3rem' }}>
              {nombre ? `Hola, ${nombre}` : 'Mi Cuenta'}
            </h1>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{user.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" style={{
              padding: '0.6rem 1.2rem',
              background: 'transparent',
              border: '1px solid var(--gris-claro)',
              borderRadius: '6px',
              color: '#888',
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Datos del perfil */}
        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', color: 'var(--dorado)', marginBottom: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
            Mis datos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Nombre', value: nombre || '—' },
              { label: 'Apellido', value: apellido || '—' },
              { label: 'Email', value: user.email },
              { label: 'Teléfono', value: profile?.telefono || '—' },
              { label: 'Dirección', value: profile?.direccion || '—' },
              { label: 'Ciudad', value: profile?.ciudad || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: '#111', borderRadius: '8px', padding: '1rem', border: '1px solid #222' }}>
                <p style={{ color: '#666', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.3rem' }}>{label}</p>
                <p style={{ color: 'var(--crema)', fontSize: '0.95rem' }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Historial de pedidos */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-playfair)', fontSize: '1.4rem', color: 'var(--dorado)', marginBottom: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem' }}>
            Mis pedidos
          </h2>

          {!pedidos || pedidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#111', borderRadius: '12px', border: '1px solid #222' }}>
              <p style={{ color: '#666', fontSize: '1rem', marginBottom: '1rem' }}>Todavía no realizaste ningún pedido.</p>
              <a href="/catalogo" style={{ color: 'var(--dorado)', textDecoration: 'none', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Explorar catálogo →
              </a>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {pedidos.map((pedido) => (
                <div key={pedido.id} style={{ background: '#111', borderRadius: '12px', border: '1px solid #222', overflow: 'hidden' }}>
                  {/* Cabecera del pedido */}
                  <div style={{ padding: '1.2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderBottom: '1px solid #1a1a1a' }}>
                    <div>
                      <p style={{ color: '#666', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Pedido</p>
                      <p style={{ color: 'var(--crema)', fontSize: '0.85rem', fontFamily: 'monospace' }}>#{pedido.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#666', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Fecha</p>
                      <p style={{ color: 'var(--crema)', fontSize: '0.85rem' }}>
                        {new Date(pedido.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#666', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.2rem' }}>Total</p>
                      <p style={{ color: 'var(--dorado)', fontSize: '1rem', fontWeight: '600' }}>
                        ${pedido.total.toLocaleString('es-AR')}
                      </p>
                    </div>
                    <div>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        letterSpacing: '0.04em',
                        background: `${estadoColor[pedido.estado]}22`,
                        color: estadoColor[pedido.estado],
                        border: `1px solid ${estadoColor[pedido.estado]}44`,
                      }}>
                        {estadoLabel[pedido.estado] || pedido.estado}
                      </span>
                    </div>
                  </div>

                  {/* Items del pedido */}
                  <div style={{ padding: '1rem 1.5rem' }}>
                    {pedido.pedido_items?.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #1a1a1a' }}>
                        <div>
                          <p style={{ color: 'var(--crema)', fontSize: '0.9rem' }}>{item.nombre_producto}</p>
                          {item.bodega_producto && (
                            <p style={{ color: '#666', fontSize: '0.8rem' }}>{item.bodega_producto}</p>
                          )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ color: '#888', fontSize: '0.85rem' }}>x{item.cantidad}</p>
                          <p style={{ color: 'var(--crema)', fontSize: '0.9rem' }}>
                            ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
