'use client'

import { useState, useTransition, Fragment } from 'react'
import Link from 'next/link'
import { actualizarEstadoPedido } from '@/app/actions/admin'
import AdminNav from '../AdminNav'

const ESTADOS = ['pendiente', 'pagado', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado']

const estadoColor = {
  pendiente:      '#c9a84c',
  pagado:         '#4caf50',
  confirmado:     '#2196f3',
  en_preparacion: '#ff9800',
  enviado:        '#9c27b0',
  entregado:      '#4caf50',
  cancelado:      '#f44336',
}

const s = {
  page:    { minHeight: '100vh', background: 'var(--negro)', padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 3rem)' },
  eyebrow: { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  titulo:  { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--crema)', lineHeight: 1.1 },
  th:      { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid rgba(201,168,76,0.15)', whiteSpace: 'nowrap' },
  td:      { color: 'var(--crema)', padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
  btnSec:  { background: 'transparent', color: 'var(--crema-apagada)', border: '1px solid rgba(201,168,76,0.25)', padding: '0.45rem 1rem', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)', textDecoration: 'none', display: 'inline-block' },
  select:  { background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--crema)', padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none' },
  statCard: { background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.12)', padding: '1.25rem 1.5rem' },
  statNum:  { fontFamily: 'var(--font-editorial)', fontSize: '1.8rem', color: 'var(--dorado)', fontWeight: 300, lineHeight: 1.2 },
  statLabel: { color: 'var(--crema-apagada)', fontSize: '0.68rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '0.25rem' },
}

function Badge({ estado }) {
  const color = estadoColor[estado] ?? '#888'
  return (
    <span style={{
      display: 'inline-block', padding: '0.2rem 0.65rem', borderRadius: '20px',
      fontSize: '0.68rem', fontWeight: 600, whiteSpace: 'nowrap',
      background: `${color}18`, color, border: `1px solid ${color}33`,
    }}>
      {estado.replace('_', ' ')}
    </span>
  )
}

export default function PedidosTable({ pedidos, stats }) {
  const [filtroEstado, setFiltro] = useState('')
  const [abierto, setAbierto] = useState(null)
  const [toast, setToast] = useState(null)
  const [, startTransition] = useTransition()

  const filtrados = filtroEstado ? pedidos.filter(p => p.estado === filtroEstado) : pedidos

  function mostrarToast(texto, tipo = 'ok') {
    setToast({ texto, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  function cambiarEstado(id, nuevoEstado) {
    startTransition(async () => {
      const res = await actualizarEstadoPedido(id, nuevoEstado)
      if (res?.error) mostrarToast('Error: ' + res.error, 'error')
      else mostrarToast('Estado actualizado')
    })
  }

  return (
    <div style={s.page}>
      {toast && (
        <div role="alert" style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000,
          background: toast.tipo === 'error' ? '#5a1e28' : 'var(--gris-medio)',
          border: `1px solid ${toast.tipo === 'error' ? 'rgba(192,57,43,0.5)' : 'rgba(201,168,76,0.3)'}`,
          color: 'var(--crema)', padding: '0.9rem 1.5rem', fontSize: '0.82rem',
        }}>
          {toast.texto}
        </div>
      )}

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={s.eyebrow}>— Panel de administración</p>
            <h1 style={s.titulo}>Pedidos y ventas</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label htmlFor="filtro-estado" style={{ color: 'var(--crema-apagada)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Filtrar
            </label>
            <select
              id="filtro-estado"
              value={filtroEstado}
              onChange={e => setFiltro(e.target.value)}
              style={s.select}
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
            </select>
            <Link href="/" style={s.btnSec}>← Volver al sitio</Link>
          </div>
        </header>

        <AdminNav activa="pedidos" />

        {/* RESUMEN DE VENTAS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={s.statCard}>
            <p style={s.statNum}>${stats.ingresos.toLocaleString('es-AR')}</p>
            <p style={s.statLabel}>Ingresos (ventas)</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{stats.ventas}</p>
            <p style={s.statLabel}>Ventas concretadas</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{stats.pendientes}</p>
            <p style={s.statLabel}>Pendientes de pago</p>
          </div>
          <div style={s.statCard}>
            <p style={s.statNum}>{stats.totalPedidos}</p>
            <p style={s.statLabel}>Pedidos totales</p>
          </div>
        </div>

        {filtrados.length === 0 ? (
          <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1.1rem', padding: '4rem', textAlign: 'center' }}>
            No hay pedidos{filtroEstado ? ` con estado «${filtroEstado.replace('_', ' ')}»` : ''}.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--gris)' }}>
                  <th style={s.th}>Pedido</th>
                  <th style={s.th}>Fecha</th>
                  <th style={s.th}>Cliente</th>
                  <th style={s.th}>Entrega</th>
                  <th style={s.th}>Total</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Pago</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Estado</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p, i) => {
                  const transaccion = p.transacciones?.[0]
                  const expandido = abierto === p.id
                  return (
                    <Fragment key={p.id}>
                      <tr style={{ background: i % 2 === 0 ? 'var(--negro)' : 'rgba(15,15,15,0.6)' }}>
                        <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--crema-apagada)' }}>
                          #{p.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td style={{ ...s.td, color: 'var(--crema-apagada)', whiteSpace: 'nowrap' }}>
                          {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={s.td}>{p.nombre_receptor ?? '—'}</td>
                        <td style={{ ...s.td, color: 'var(--crema-apagada)' }}>
                          {[p.ciudad_entrega, p.provincia_entrega].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td style={{ ...s.td, fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                          ${Number(p.total).toLocaleString('es-AR')}
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          {transaccion ? <Badge estado={transaccion.estado} /> : '—'}
                        </td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <select
                            value={p.estado}
                            onChange={e => cambiarEstado(p.id, e.target.value)}
                            style={{ ...s.select, borderColor: `${estadoColor[p.estado] ?? '#888'}55` }}
                            aria-label={`Cambiar estado del pedido ${p.id.slice(0, 8)}`}
                          >
                            {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                          </select>
                        </td>
                        <td style={{ ...s.td, textAlign: 'right' }}>
                          <button
                            style={{ ...s.btnSec, padding: '0.35rem 0.8rem' }}
                            onClick={() => setAbierto(expandido ? null : p.id)}
                            aria-expanded={expandido}
                          >
                            {expandido ? 'Ocultar' : 'Ver'}
                          </button>
                        </td>
                      </tr>
                      {expandido && (
                        <tr>
                          <td colSpan={8} style={{ padding: '0 1rem 1.25rem', background: 'rgba(15,15,15,0.6)', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                            <div style={{ padding: '1.25rem', border: '1px solid rgba(201,168,76,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                              <div>
                                <p style={{ ...s.eyebrow, marginBottom: '0.75rem' }}>Productos</p>
                                {p.pedido_items?.map(item => (
                                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.8rem' }}>
                                    <span style={{ color: 'var(--crema)' }}>
                                      {item.nombre_producto}
                                      <span style={{ color: 'var(--crema-apagada)' }}> ×{item.cantidad}</span>
                                    </span>
                                    <span style={{ color: 'var(--crema-apagada)', whiteSpace: 'nowrap' }}>
                                      ${(item.precio_unitario * item.cantidad).toLocaleString('es-AR')}
                                    </span>
                                  </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.6rem', fontSize: '0.8rem' }}>
                                  <span style={{ color: 'var(--crema-apagada)' }}>Envío</span>
                                  <span style={{ color: 'var(--crema)' }}>
                                    {Number(p.costo_envio) === 0 ? 'Gratis' : `$${Number(p.costo_envio).toLocaleString('es-AR')}`}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p style={{ ...s.eyebrow, marginBottom: '0.75rem' }}>Envío</p>
                                <p style={{ color: 'var(--crema)', fontSize: '0.85rem' }}>{p.nombre_receptor}</p>
                                <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem', lineHeight: 1.6 }}>
                                  {[p.direccion_entrega, p.ciudad_entrega, p.provincia_entrega].filter(Boolean).join(', ')}
                                </p>
                                {p.notas && (
                                  <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', marginTop: '0.6rem', fontStyle: 'italic' }}>
                                    «{p.notas}»
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.72rem', letterSpacing: '0.05em', marginTop: '1.5rem', textAlign: 'right', opacity: 0.6 }}>
              {filtrados.length} pedido{filtrados.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
