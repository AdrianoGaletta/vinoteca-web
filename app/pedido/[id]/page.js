import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import Link from 'next/link'

export const metadata = { title: 'Pedido | Cava del Plata' }

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
  pendiente:       'Pendiente de pago',
  pagado:          'Pago aprobado',
  confirmado:      'Confirmado',
  en_preparacion:  'En preparación',
  enviado:         'Enviado',
  entregado:       'Entregado',
  cancelado:       'Cancelado',
}

export default async function PedidoPage({ params, searchParams }) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Al volver de Mercado Pago, verificamos el pago REAL contra la API de MP
  // (no confiamos en la URL) y marcamos el pedido pagado con permisos de
  // servidor (service-role), de forma confiable.
  const mpPaymentId = sp.payment_id || sp.collection_id
  console.log('[pedido] return params:', JSON.stringify(sp))
  if (mpPaymentId && process.env.MP_ACCESS_TOKEN) {
    try {
      const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
      const payment = await new Payment(client).get({ id: mpPaymentId })
      console.log('[pedido] payment:', payment.id, '| status:', payment.status, '| ext_ref:', payment.external_reference, '| esperado:', id)
      if (String(payment.external_reference) === String(id) && payment.status === 'approved') {
        const admin = createAdminClient()
        const { error: e1 } = await admin.from('pedidos').update({ estado: 'pagado' }).eq('id', id)
        const { error: e2 } = await admin.from('transacciones')
          .update({ estado: 'aprobado', monto: payment.transaction_amount })
          .eq('pedido_id', id)
        console.log('[pedido] update errors -> pedidos:', e1?.message ?? 'ok', '| transacciones:', e2?.message ?? 'ok')
      }
    } catch (e) {
      console.error('[pedido] Verificación de pago MP falló:', e.message)
    }
  }

  const { data: pedido } = await supabase
    .from('pedidos')
    .select(`
      *,
      pedido_items ( id, nombre_producto, bodega_producto, cantidad, precio_unitario, subtotal )
    `)
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (!pedido) redirect('/mi-cuenta')

  const estado = pedido.estado
  const color = estadoColor[estado] ?? 'var(--dorado)'
  const isPendiente = estado === 'pendiente'
  const pagoError = sp.pago === 'error'

  return (
    <main style={{ maxWidth: '760px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)' }}>

      {pagoError && (
        <div role="alert" style={{ background: '#1a0a0a', border: '1px solid rgba(244,67,54,0.3)', borderRadius: '2px', padding: '1rem 1.25rem', marginBottom: '2rem', color: '#f44336', fontSize: '0.85rem' }}>
          No pudimos iniciar el pago. Intentá de nuevo en unos segundos.
        </div>
      )}

      {/* ENCABEZADO según estado real */}
      {isPendiente ? (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>— Último paso</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--crema)', fontWeight: 400, marginBottom: '0.75rem' }}>Pagá tu pedido</h1>
          <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--crema-apagada)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7 }}>
            Reservamos tu pedido. Completá el pago con Mercado Pago para confirmarlo.
          </p>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: `1px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color, fontSize: '1.5rem' }}>
            {estado === 'cancelado' ? '✕' : '✓'}
          </div>
          <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>— Pedido confirmado</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--crema)', fontWeight: 400, marginBottom: '0.75rem' }}>¡Gracias por tu compra!</h1>
          <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--crema-apagada)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.7 }}>
            Tu pago fue procesado por Mercado Pago. Comenzamos a preparar tu pedido.
          </p>
        </div>
      )}

      {/* BLOQUE DE PAGO — Mercado Pago, solo si está pendiente */}
      {isPendiente && (
        <div style={{ background: 'var(--gris)', border: `1px solid ${color}40`, borderRadius: '2px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', marginBottom: '2.5rem', textAlign: 'center' }}>
          <a
            href={`/pedido/${id}/pagar`}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              background: '#009ee3', color: '#fff',
              padding: '1rem 2.5rem', fontSize: '0.85rem',
              letterSpacing: '0.08em', fontWeight: 700, borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="12" fill="#fff" />
              <path d="M6 12.5l3.5 3.3L18 7.5" stroke="#009ee3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Pagar con Mercado Pago
          </a>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', marginTop: '1rem', lineHeight: 1.6 }}>
            Vas a ser redirigido al checkout seguro de Mercado Pago.
          </p>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.7rem', marginTop: '0.75rem', opacity: 0.6 }}>
            Entorno de prueba — tarjeta de test: <span style={{ fontFamily: 'monospace', color: 'var(--crema)' }}>5031 7557 3453 0604</span>, 11/30, CVV 123, titular <span style={{ color: 'var(--crema)' }}>APRO</span>, DNI 12345678
          </p>
        </div>
      )}

      {/* DETALLE DEL PEDIDO */}
      <div style={{ background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
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
            <span style={{ display: 'inline-block', padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}33` }}>
              {estadoLabel[estado]}
            </span>
          </div>
          <div>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Total</p>
            <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1.3rem', fontWeight: 300 }}>${pedido.total.toLocaleString('es-AR')}</p>
          </div>
        </div>

        {pedido.direccion_entrega && (
          <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(201,168,76,0.08)' }}>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Enviar a</p>
            <p style={{ color: 'var(--crema)', fontSize: '0.85rem' }}>{pedido.nombre_receptor}</p>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem' }}>
              {[pedido.direccion_entrega, pedido.ciudad_entrega, pedido.provincia_entrega].filter(Boolean).join(', ')}
            </p>
          </div>
        )}

        <div style={{ padding: '1.5rem 2rem' }}>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Productos</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pedido.pedido_items?.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <p style={{ color: 'var(--crema)', fontSize: '0.88rem' }}>{item.nombre_producto}</p>
                  {item.bodega_producto && <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{item.bodega_producto}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem' }}>x{item.cantidad}</p>
                  <p style={{ color: 'var(--crema)', fontSize: '0.9rem' }}>${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {pedido.costo_envio > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--crema-apagada)' }}>Envío</span>
                <span style={{ color: 'var(--crema)' }}>${pedido.costo_envio.toLocaleString('es-AR')}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1.5rem', fontWeight: 300 }}>${pedido.total.toLocaleString('es-AR')}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        <Link href="/mi-cuenta" className="btn-hover" style={{ background: 'var(--dorado)', color: 'var(--negro)', padding: '0.85rem 2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
          Ver mis pedidos
        </Link>
        <Link href="/catalogo" className="btn-hover" style={{ border: '1px solid rgba(201,168,76,0.25)', color: 'var(--crema-apagada)', padding: '0.85rem 2rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Seguir comprando
        </Link>
      </div>
    </main>
  )
}
