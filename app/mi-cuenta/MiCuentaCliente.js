'use client'

import { useActionState, useState } from 'react'
import { logout } from '@/app/actions/auth'
import { actualizarPerfil } from '@/app/actions/perfil'
import Link from 'next/link'

const estadoLabel = { pendiente: 'Pendiente', confirmado: 'Confirmado', en_preparacion: 'En preparación', enviado: 'Enviado', entregado: 'Entregado', cancelado: 'Cancelado' }
const estadoColor = { pendiente: '#c9a84c', confirmado: '#2196f3', en_preparacion: '#ff9800', enviado: '#9c27b0', entregado: '#4caf50', cancelado: '#f44336' }

const inputStyle = {
  width: '100%', padding: '0.7rem 0.9rem',
  background: '#111', border: '1px solid #2e2e2e', borderRadius: '2px',
  color: 'var(--crema)', fontSize: '0.88rem', outline: 'none',
  fontFamily: 'var(--font-body)', boxSizing: 'border-box',
}
const labelStyle = {
  display: 'block', color: 'var(--crema-apagada)',
  fontSize: '0.68rem', marginBottom: '0.35rem',
  textTransform: 'uppercase', letterSpacing: '0.08em',
}

export default function MiCuentaCliente({ user, profile, pedidos }) {
  const [editando, setEditando] = useState(false)
  const [state, action, pending] = useActionState(actualizarPerfil, undefined)

  const nombre = profile?.nombre || user.user_metadata?.nombre || ''
  const apellido = profile?.apellido || user.user_metadata?.apellido || ''

  return (
    <div style={{ minHeight: '100vh', paddingTop: 'clamp(3rem, 6vw, 5rem)', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 clamp(1.5rem, 4vw, 3rem)' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(201,168,76,0.12)', paddingBottom: '2rem' }}>
          <div>
            <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>— Mi cuenta</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--crema)', fontWeight: 400 }}>
              {nombre ? `Hola, ${nombre}` : 'Mi Cuenta'}
            </h1>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{user.email}</p>
          </div>
          <form action={logout}>
            <button type="submit" style={{ padding: '0.6rem 1.25rem', background: 'transparent', border: '1px solid #2e2e2e', borderRadius: '2px', color: 'var(--crema-apagada)', fontSize: '0.72rem', cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* PERFIL */}
        <section style={{ marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--dorado)', fontWeight: 400 }}>
              Mis datos
            </h2>
            {!editando && (
              <button onClick={() => setEditando(true)} style={{ background: 'transparent', border: '1px solid rgba(201,168,76,0.25)', color: 'var(--dorado)', padding: '0.45rem 1rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '2px' }}>
                Editar
              </button>
            )}
          </div>

          {editando ? (
            <form action={async (formData) => {
              await action(formData)
              setEditando(false)
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Nombre</label>
                  <input name="nombre" type="text" defaultValue={nombre} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Apellido</label>
                  <input name="apellido" type="text" defaultValue={apellido} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="telefono" type="tel" defaultValue={profile?.telefono ?? ''} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input name="ciudad" type="text" defaultValue={profile?.ciudad ?? ''} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Dirección</label>
                <input name="direccion" type="text" defaultValue={profile?.direccion ?? ''} style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Provincia</label>
                  <input name="provincia" type="text" defaultValue={profile?.provincia ?? ''} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Código postal</label>
                  <input name="codigo_postal" type="text" defaultValue={profile?.codigo_postal ?? ''} style={inputStyle} />
                </div>
              </div>

              {state?.error && <p style={{ color: '#f44336', fontSize: '0.82rem' }}>{state.error}</p>}
              {state?.success && <p style={{ color: '#4caf50', fontSize: '0.82rem' }}>{state.success}</p>}

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="submit" disabled={pending} style={{ padding: '0.75rem 1.5rem', background: pending ? '#555' : 'var(--dorado)', color: 'var(--negro)', border: 'none', borderRadius: '2px', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 700, cursor: pending ? 'not-allowed' : 'pointer', fontFamily: 'var(--font-body)' }}>
                  {pending ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => setEditando(false)} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid #2e2e2e', color: 'var(--crema-apagada)', borderRadius: '2px', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1px', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.06)' }}>
              {[
                { label: 'Nombre', value: nombre || '—' },
                { label: 'Apellido', value: apellido || '—' },
                { label: 'Email', value: user.email },
                { label: 'Teléfono', value: profile?.telefono || '—' },
                { label: 'Dirección', value: profile?.direccion || '—' },
                { label: 'Ciudad', value: profile?.ciudad || '—' },
              ].map(({ label, value }) => (
                <div key={label} style={{ background: 'var(--gris)', padding: '1rem 1.25rem' }}>
                  <p style={{ color: 'var(--crema-apagada)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{label}</p>
                  <p style={{ color: 'var(--crema)', fontSize: '0.88rem', wordBreak: 'break-word' }}>{value}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* PEDIDOS */}
        <section>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--dorado)', fontWeight: 400, marginBottom: '1.5rem' }}>
            Mis pedidos
          </h2>

          {pedidos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: '2px' }}>
              <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1rem', marginBottom: '1rem' }}>
                Todavía no realizaste ningún pedido.
              </p>
              <Link href="/catalogo" style={{ color: 'var(--dorado)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Explorar catálogo →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pedidos.map(pedido => {
                const color = estadoColor[pedido.estado] ?? 'var(--dorado)'
                return (
                  <Link key={pedido.id} href={`/pedido/${pedido.id}`} style={{
                    display: 'block',
                    background: 'var(--gris)',
                    border: '1px solid rgba(201,168,76,0.08)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s',
                  }}>
                    <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                      <div>
                        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Pedido</p>
                        <p style={{ color: 'var(--crema)', fontSize: '0.85rem', fontFamily: 'monospace' }}>#{pedido.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Fecha</p>
                        <p style={{ color: 'var(--crema)', fontSize: '0.82rem' }}>
                          {new Date(pedido.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Total</p>
                        <p style={{ fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1.1rem', fontWeight: 300 }}>
                          ${pedido.total.toLocaleString('es-AR')}
                        </p>
                      </div>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, background: `${color}18`, color, border: `1px solid ${color}33` }}>
                        {estadoLabel[pedido.estado]}
                      </span>
                      <span style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem' }}>→</span>
                    </div>
                    {pedido.pedido_items?.length > 0 && (
                      <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)', background: 'rgba(0,0,0,0.2)' }}>
                        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem' }}>
                          {pedido.pedido_items.map(i => `${i.nombre_producto} x${i.cantidad}`).join(' · ')}
                        </p>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
