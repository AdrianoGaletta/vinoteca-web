import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Pedido confirmado | Cava del Plata' }

const estadoColor = {
  pendiente:       '#c9a84c',
  pagado:          '#4caf50',
  confirmado:      '#2196f3',
  en_preparacion:  '#ff9800',
  enviado:         '#9c27b0',
  entregado:       '#4caf50',
  cancelado:       '#f44336',
}

const estadoLabel = {
  pendiente:       'Pendiente de confirmación',
  pagado:          'Pago aprobado',
  confirmado:      'Confirmado',
  en_preparacion:  'En preparación',
  enviado:         'Enviado',
  entregado:       'Entregado',
  cancelado:       'Cancelado',
}

const pagoMensaje = {
  aprobado: { texto: '¡Pago aprobado! Tu pedido está confirmado.', color: '#4caf50', bg: '#0a1a0a', border: '#1a3a1a' },
  pendiente: { texto: 'Tu pago está siendo procesado. Te avisaremos cuando se confirme.', color: '#c9a84c', bg: '#1a150a', border: '#3a2a0a' },
  fallido:   { texto: 'El pago no pudo procesarse. Podés intentar de nuevo desde Mi Cuenta.', color: '#f44336', bg: '#1a0a0a', border: '#3a1a1a' },
}

export default async function PedidoPage({ params, searchParams }) {
  const { id } = await params
  const { pago } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Si MP devuelve pago=aprobado, actualizar el pedido directamente
  // (el webhook no funciona en localhost por ser una URL privada)
  if (pago === 'aprobado') {
    await supabase
      .from('pedidos')
      .update({ estado: 'pagado' })
      .eq('id', id)
      .eq('usuario_id', user.id)

    await supabase
      .from('transacciones')
      .update({ estado: 'aprobado' })
      .eq('pedido_id', id)
  }

  const { data: pedido } = await supabase
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
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (!pedido) redirect('/mi-cuenta')

  const color = estadoColor[pedido.estado] ?? 'var(--dorado)'

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)' }}>

      {/* BANNER MERCADO PAGO */}
      {pago && pagoMensaje[pago] && (
        <div role="alert" style={{
          background: pagoMensaje[pago].bg,
          border: `1px solid ${pagoMensaje[pago].border}`,
          borderRadius: '2px',
          padding: '1rem 1.5rem',
          marginBottom: '2rem',
          color: pagoMensaje[pago].color,
          fontSize: '0.88rem',
          lineHeight: 1.6,
        }}>
          {pagoMensaje[pago].texto}
        </div>
      )}

      {/* CONFIRMACIÓN */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{
          width: '64px', height: '64px',
          borderRadius: '50%',
          border: `1px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color,
          fontSize: '1.5rem',
        }}>
          {pago === 'fallido' ? '✕' : '✓'}
        </div>
        <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          — Pedido recibido
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--crema)', fontWeight: 400, marginBottom: '0.75rem' }}>
          {pago === 'aprobado' ? '¡Pago confirmado!' : '¡Gracias por tu compra!'}
        </h1>
        <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--crema-apagada)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7 }}>
          {pago === 'aprobado'
            ? 'Tu pago fue procesado correctamente. Comenzamos a preparar tu pedido.'
            : 'Recibimos tu pedido. Te notificaremos sobre el estado del pago y el seguimiento.'}
        </p>
      </div>

      {/* DETALLE DEL PEDIDO */}
      <div style={{ background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '2px', overflow: 'hidden' }}>

        {/* Cabecera */}
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Pedido</p>
            <p style={{ color: 'var(--crema)', fontSize: '0.85rem', fontFamily: 'monospace' }}>#{pedido.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Fecha</p>
            <p style={{ color: 'var(--crema)', fontSize: '0.85rem' }}>
              {new Date(pedido.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Estado</p>
            <span style={{
              display: 'inline-block',
              padding: '0.25rem 0.7rem',
              borderRadius: '20px',
              fontSize: '0.72rem',
              fontWeight: 600,
              background: `${color}18`,
              color,
              border: `1px solid ${color}33`,
            }}>
              {estadoLabel[pedido.estado]}
            </span>
          </div>
          <div>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Total</p>
            <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1.3rem', fontWeight: 300 }}>
              ${pedido.total.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Dirección */}
        {pedido.direccion_entrega && (
          <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(201,168,76,0.08)', display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Enviar a</p>
              <p style={{ color: 'var(--crema)', fontSize: '0.85rem' }}>{pedido.nombre_receptor}</p>
              <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem' }}>
                {[pedido.direccion_entrega, pedido.ciudad_entrega, pedido.provincia_entrega].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        )}

        {/* Items */}
        <div style={{ padding: '1.5rem 2rem' }}>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Productos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pedido.pedido_items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <p style={{ color: 'var(--crema)', fontSize: '0.88rem' }}>{item.nombre_producto}</p>
                  {item.bodega_producto && (
                    <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{item.bodega_producto}</p>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem' }}>x{item.cantidad}</p>
                  <p style={{ color: 'var(--crema)', fontSize: '0.9rem' }}>${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pedido.costo_envio > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--crema-apagada)' }}>Envío</span>
                <span style={{ color: 'var(--crema)' }}>${pedido.costo_envio.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1.5rem', fontWeight: 300 }}>
                ${pedido.total.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        <Link href="/mi-cuenta" className="btn-hover" style={{
          background: 'var(--dorado)', color: 'var(--negro)',
          padding: '0.85rem 2rem', fontSize: '0.75rem',
          letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
        }}>
          Ver mis pedidos
        </Link>
        <Link href="/catalogo" className="btn-hover" style={{
          border: '1px solid rgba(201,168,76,0.25)', color: 'var(--crema-apagada)',
          padding: '0.85rem 2rem', fontSize: '0.75rem',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          Seguir comprando
        </Link>
      </div>

    </main>
  )
}
