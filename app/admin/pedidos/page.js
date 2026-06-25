'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const estadoColor = {
  pendiente:      '#c9a84c',
  pagado:         '#4caf50',
  confirmado:     '#2196f3',
  en_preparacion: '#ff9800',
  enviado:        '#9c27b0',
  entregado:      '#4caf50',
  cancelado:      '#f44336',
}

const ESTADOS = ['pendiente', 'pagado', 'confirmado', 'en_preparacion', 'enviado', 'entregado', 'cancelado']

const s = {
  page:      { minHeight: '100vh', background: 'var(--negro)', padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 3rem)' },
  eyebrow:   { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' },
  titulo:    { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--crema)', lineHeight: 1.1 },
  th:        { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid rgba(201,168,76,0.15)', whiteSpace: 'nowrap' },
  td:        { color: 'var(--crema)', padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
  btnSec:    { background: 'transparent', color: 'var(--crema-apagada)', border: '1px solid rgba(201,168,76,0.25)', padding: '0.45rem 1rem', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)' },
  select:    { background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--crema)', padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontFamily: 'var(--font-body)', cursor: 'pointer', outline: 'none' },
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

export default function AdminPedidos() {
  const [pedidos, setPedidos]     = useState([])
  const [cargando, setCargando]   = useState(true)
  const [filtroEstado, setFiltro] = useState('')
  const [toast, setToast]         = useState(null)
  const supabase = createClient()

  const cargar = useCallback(async () => {
    setCargando(true)
    let q = supabase
      .from('pedidos')
      .select('id, created_at, estado, total, nombre_receptor, ciudad_entrega, usuario_id')
      .order('created_at', { ascending: false })
    if (filtroEstado) q = q.eq('estado', filtroEstado)
    const { data } = await q
    setPedidos(data ?? [])
    setCargando(false)
  }, [filtroEstado])

  useEffect(() => { cargar() }, [cargar])

  function mostrarToast(texto, tipo = 'ok') {
    setToast({ texto, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  async function cambiarEstado(id, nuevoEstado) {
    const { error } = await supabase.from('pedidos').update({ estado: nuevoEstado }).eq('id', id)
    if (error) mostrarToast('Error: ' + error.message, 'error')
    else {
      mostrarToast('Estado actualizado')
      setPedidos(p => p.map(x => x.id === id ? { ...x, estado: nuevoEstado } : x))
    }
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
        <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={s.eyebrow}>— Panel de administración</p>
            <h1 style={s.titulo}>Pedidos</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <select
              value={filtroEstado}
              onChange={e => setFiltro(e.target.value)}
              style={s.select}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
            </select>
            <Link href="/admin" style={{ ...s.btnSec, textDecoration: 'none', display: 'inline-block' }}>
              ← Productos
            </Link>
            <Link href="/" style={{ ...s.btnSec, textDecoration: 'none', display: 'inline-block' }}>
              ← Sitio
            </Link>
          </div>
        </header>

        {cargando ? (
          <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1.1rem', padding: '4rem', textAlign: 'center' }}>
            Cargando pedidos...
          </p>
        ) : pedidos.length === 0 ? (
          <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1.1rem', padding: '4rem', textAlign: 'center' }}>
            No hay pedidos{filtroEstado ? ` con estado "${filtroEstado}"` : ''}.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--gris)' }}>
                  <th style={s.th}>ID</th>
                  <th style={s.th}>Fecha</th>
                  <th style={s.th}>Cliente</th>
                  <th style={s.th}>Ciudad</th>
                  <th style={s.th}>Total</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Estado</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Cambiar estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? 'var(--negro)' : 'rgba(15,15,15,0.6)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gris)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--negro)' : 'rgba(15,15,15,0.6)'}
                  >
                    <td style={{ ...s.td, fontFamily: 'monospace', fontSize: '0.75rem', color: 'var(--crema-apagada)' }}>
                      #{p.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td style={{ ...s.td, color: 'var(--crema-apagada)', whiteSpace: 'nowrap' }}>
                      {new Date(p.created_at).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={s.td}>{p.nombre_receptor ?? '—'}</td>
                    <td style={{ ...s.td, color: 'var(--crema-apagada)' }}>{p.ciudad_entrega ?? '—'}</td>
                    <td style={{ ...s.td, fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                      ${Number(p.total).toLocaleString('es-AR')}
                    </td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <Badge estado={p.estado} />
                    </td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <select
                        value={p.estado}
                        onChange={e => cambiarEstado(p.id, e.target.value)}
                        style={s.select}
                        aria-label={`Cambiar estado de pedido ${p.id.slice(0, 8)}`}
                      >
                        {ESTADOS.map(e => <option key={e} value={e}>{e.replace('_', ' ')}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.72rem', letterSpacing: '0.05em', marginTop: '1.5rem', textAlign: 'right', opacity: 0.6 }}>
              {pedidos.length} pedido{pedidos.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
