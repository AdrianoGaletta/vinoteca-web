'use client'

import { useActionState } from 'react'
import { crearPedido } from '@/app/actions/pedidos'
import Image from 'next/image'
import Link from 'next/link'

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#111',
  border: '1px solid #2e2e2e',
  borderRadius: '2px',
  color: 'var(--crema)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.2s',
}

const labelStyle = {
  display: 'block',
  color: 'var(--crema-apagada)',
  fontSize: '0.72rem',
  marginBottom: '0.4rem',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

export default function CheckoutForm({ items, profile, user, subtotal, costo_envio, total }) {
  const [state, action, pending] = useActionState(crearPedido, undefined)

  const nombreCompleto = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ')

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)' }}>

      {/* HEADER */}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(201,168,76,0.12)', paddingBottom: '2rem' }}>
        <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          — Paso final
        </p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--crema)', fontWeight: 400 }}>
          Checkout
        </h1>
      </header>

      <form action={action}>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 360px', gap: '3rem', alignItems: 'start' }}>

          {/* FORMULARIO DE ENVÍO */}
          <section>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--crema)', fontWeight: 400, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--dorado)', fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 300 }}>01</span>
              Datos de envío
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              <div>
                <label htmlFor="nombre_receptor" style={labelStyle}>Nombre completo *</label>
                <input
                  id="nombre_receptor"
                  name="nombre_receptor"
                  type="text"
                  required
                  defaultValue={nombreCompleto}
                  style={inputStyle}
                />
              </div>

              <div>
                <label htmlFor="direccion_entrega" style={labelStyle}>Dirección *</label>
                <input
                  id="direccion_entrega"
                  name="direccion_entrega"
                  type="text"
                  required
                  placeholder="Calle y número"
                  defaultValue={profile?.direccion ?? ''}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="ciudad_entrega" style={labelStyle}>Ciudad *</label>
                  <input
                    id="ciudad_entrega"
                    name="ciudad_entrega"
                    type="text"
                    required
                    defaultValue={profile?.ciudad ?? ''}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label htmlFor="provincia_entrega" style={labelStyle}>Provincia</label>
                  <input
                    id="provincia_entrega"
                    name="provincia_entrega"
                    type="text"
                    defaultValue={profile?.provincia ?? ''}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notas" style={labelStyle}>Notas del pedido (opcional)</label>
                <textarea
                  id="notas"
                  name="notas"
                  rows={3}
                  placeholder="Instrucciones especiales de entrega..."
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
                />
              </div>

            </div>

            {/* MÉTODO DE PAGO — placeholder */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--crema)', fontWeight: 400, margin: '2.5rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--dorado)', fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 300 }}>02</span>
              Método de pago
            </h2>

            <div style={{ background: '#111', border: '1px solid #2e2e2e', borderRadius: '2px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid var(--dorado)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--dorado)' }} />
              </div>
              <div>
                <p style={{ color: 'var(--crema)', fontSize: '0.88rem' }}>Transferencia bancaria</p>
                <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', marginTop: '0.2rem' }}>Te enviaremos los datos por email al confirmar</p>
              </div>
            </div>

            {state?.error && (
              <p style={{ color: '#f44336', fontSize: '0.85rem', marginTop: '1.5rem', padding: '0.75rem 1rem', background: '#1a0a0a', border: '1px solid #3a1a1a', borderRadius: '2px' }}>
                {state.error}
              </p>
            )}

          </section>

          {/* RESUMEN DEL PEDIDO */}
          <aside style={{ background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.15)', padding: '2rem', position: 'sticky', top: '80px' }}>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--crema)', fontWeight: 400, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
              Tu pedido
            </h2>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {items.map((item, i) => (
                <li key={i} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ height: '48px', background: '#0c0c0c', border: '1px solid rgba(201,168,76,0.1)', position: 'relative' }}>
                    {item.productos?.imagen && (
                      <Image src={item.productos.imagen} alt={item.productos.nombre} fill style={{ objectFit: 'contain', padding: '4px' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ color: 'var(--crema)', fontSize: '0.82rem', lineHeight: '1.3' }}>{item.productos?.nombre}</p>
                    <p style={{ color: 'var(--crema-apagada)', fontSize: '0.72rem', marginTop: '0.1rem' }}>x{item.cantidad}</p>
                  </div>
                  <p style={{ color: 'var(--crema)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                  </p>
                </li>
              ))}
            </ul>

            <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--crema-apagada)' }}>Subtotal</span>
                <span style={{ color: 'var(--crema)' }}>${subtotal.toLocaleString('es-AR')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--crema-apagada)' }}>Envío</span>
                <span style={{ color: costo_envio === 0 ? '#6fcf97' : 'var(--crema)' }}>
                  {costo_envio === 0 ? 'Gratis' : `$${costo_envio.toLocaleString('es-AR')}`}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(201,168,76,0.15)' }}>
              <span style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
              <span style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '2rem', fontWeight: 300 }}>
                ${total.toLocaleString('es-AR')}
              </span>
            </div>

            <button
              type="submit"
              disabled={pending}
              style={{
                width: '100%',
                background: pending ? '#555' : 'var(--dorado)',
                color: 'var(--negro)',
                border: 'none',
                padding: '1rem',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                fontWeight: '700',
                cursor: pending ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-body)',
                transition: 'background 0.2s',
                marginBottom: '1rem',
              }}
            >
              {pending ? 'Confirmando pedido...' : 'Confirmar pedido'}
            </button>

            <Link href="/carrito" style={{ display: 'block', textAlign: 'center', color: 'var(--crema-apagada)', fontSize: '0.72rem', letterSpacing: '0.08em', opacity: 0.6 }}>
              ← Volver al carrito
            </Link>

          </aside>
        </div>
      </form>
    </main>
  )
}
