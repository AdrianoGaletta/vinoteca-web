'use client'

import { useActionState, useState } from 'react'
import { crearPedido } from '@/app/actions/pedidos'
import { validarNombrePersona, validarDireccion, validarCiudad } from '@/lib/validacion'
import Image from 'next/image'
import Link from 'next/link'

function vCheck(campo, valor) {
  switch (campo) {
    case 'nombre_receptor':
      return validarNombrePersona(valor, { etiqueta: 'El nombre', min: 3 })
    case 'direccion_entrega':
      return validarDireccion(valor)
    case 'ciudad_entrega':
      return validarCiudad(valor)
    case 'provincia_entrega':
      return validarCiudad(valor, { etiqueta: 'La provincia' })
    default:
      return ''
  }
}

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
  const [errores, setErrores] = useState({})

  const nombreCompleto = [profile?.nombre, profile?.apellido].filter(Boolean).join(' ')

  const CAMPOS_REQUERIDOS = ['nombre_receptor', 'direccion_entrega', 'ciudad_entrega', 'provincia_entrega']

  function validarCampo(campo, valor) {
    setErrores(prev => ({ ...prev, [campo]: vCheck(campo, valor) }))
  }

  function handleSubmit(e) {
    const fd = new FormData(e.currentTarget)
    const nuevos = Object.fromEntries(CAMPOS_REQUERIDOS.map(c => [c, vCheck(c, fd.get(c))]))
    setErrores(nuevos)
    if (Object.values(nuevos).some(Boolean)) e.preventDefault()
  }

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

      <form action={action} onSubmit={handleSubmit} noValidate>
        <div className="checkout-grid">

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
                  defaultValue={nombreCompleto}
                  aria-describedby={errores.nombre_receptor ? 'nombre-error' : undefined}
                  aria-invalid={!!errores.nombre_receptor}
                  onBlur={e => validarCampo('nombre_receptor', e.target.value)}
                  onChange={e => errores.nombre_receptor && validarCampo('nombre_receptor', e.target.value)}
                  style={{ ...inputStyle, borderColor: errores.nombre_receptor ? '#f44336' : '#2e2e2e' }}
                />
                {errores.nombre_receptor && <p id="nombre-error" role="alert" style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errores.nombre_receptor}</p>}
              </div>

              <div>
                <label htmlFor="direccion_entrega" style={labelStyle}>Dirección *</label>
                <input
                  id="direccion_entrega"
                  name="direccion_entrega"
                  type="text"
                  placeholder="Calle y número"
                  defaultValue={profile?.direccion ?? ''}
                  aria-describedby={errores.direccion_entrega ? 'dir-error' : undefined}
                  aria-invalid={!!errores.direccion_entrega}
                  onBlur={e => validarCampo('direccion_entrega', e.target.value)}
                  onChange={e => errores.direccion_entrega && validarCampo('direccion_entrega', e.target.value)}
                  style={{ ...inputStyle, borderColor: errores.direccion_entrega ? '#f44336' : '#2e2e2e' }}
                />
                {errores.direccion_entrega && <p id="dir-error" role="alert" style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errores.direccion_entrega}</p>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label htmlFor="ciudad_entrega" style={labelStyle}>Ciudad *</label>
                  <input
                    id="ciudad_entrega"
                    name="ciudad_entrega"
                    type="text"
                    defaultValue={profile?.ciudad ?? ''}
                    aria-describedby={errores.ciudad_entrega ? 'ciudad-error' : undefined}
                    aria-invalid={!!errores.ciudad_entrega}
                    onBlur={e => validarCampo('ciudad_entrega', e.target.value)}
                    onChange={e => errores.ciudad_entrega && validarCampo('ciudad_entrega', e.target.value)}
                    style={{ ...inputStyle, borderColor: errores.ciudad_entrega ? '#f44336' : '#2e2e2e' }}
                  />
                  {errores.ciudad_entrega && <p id="ciudad-error" role="alert" style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errores.ciudad_entrega}</p>}
                </div>
                <div>
                  <label htmlFor="provincia_entrega" style={labelStyle}>Provincia *</label>
                  <input
                    id="provincia_entrega"
                    name="provincia_entrega"
                    type="text"
                    defaultValue={profile?.provincia ?? ''}
                    aria-describedby={errores.provincia_entrega ? 'provincia-error' : undefined}
                    aria-invalid={!!errores.provincia_entrega}
                    onBlur={e => validarCampo('provincia_entrega', e.target.value)}
                    onChange={e => errores.provincia_entrega && validarCampo('provincia_entrega', e.target.value)}
                    style={{ ...inputStyle, borderColor: errores.provincia_entrega ? '#f44336' : '#2e2e2e' }}
                  />
                  {errores.provincia_entrega && <p id="provincia-error" role="alert" style={{ color: '#f44336', fontSize: '0.75rem', marginTop: '0.3rem' }}>{errores.provincia_entrega}</p>}
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

            {/* MÉTODO DE PAGO — Mercado Pago */}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--crema)', fontWeight: 400, margin: '2.5rem 0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: 'var(--dorado)', fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', fontWeight: 300 }}>02</span>
              Método de pago
            </h2>

            <div style={{ background: '#111', border: '1px solid rgba(0,158,227,0.35)', borderRadius: '2px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #009ee3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#009ee3' }} />
              </div>
              <div>
                <p style={{ color: 'var(--crema)', fontSize: '0.88rem', fontWeight: 500 }}>Mercado Pago</p>
                <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                  Tarjeta de crédito, débito, efectivo y más. Pago 100% seguro.
                </p>
              </div>
              <svg role="img" aria-label="Mercado Pago" style={{ marginLeft: 'auto', flexShrink: 0 }} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="14" fill="#009ee3"/>
                <path d="M7 14.5l4.2 4 9.8-9" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
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
              {pending ? 'Procesando...' : 'Continuar al pago'}
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
