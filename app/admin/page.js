'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const VACIO = {
  nombre: '', bodega: '', varietal: '', anio: '',
  descripcion: '', precio: '', imagen: '', stock: 0,
  destacado: false, activo: true, slug: '',
}

function generarSlug(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Admin() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [modal, setModal] = useState(null) // null | { ...producto }
  const [guardando, setGuardando] = useState(false)
  const [confirmId, setConfirmId] = useState(null)
  const [toast, setToast] = useState(null)

  const supabase = createClient()

  const cargar = useCallback(async () => {
    setCargando(true)
    const { data } = await supabase.from('productos').select('*').order('nombre')
    setProductos(data ?? [])
    setCargando(false)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  function mostrarToast(texto, tipo = 'ok') {
    setToast({ texto, tipo })
    setTimeout(() => setToast(null), 3000)
  }

  function abrirNuevo() {
    setModal({ ...VACIO })
  }

  function abrirEditar(producto) {
    setModal({ ...producto })
  }

  function cerrarModal() {
    setModal(null)
  }

  function handleCampo(campo, valor) {
    setModal(prev => {
      const next = { ...prev, [campo]: valor }
      if (campo === 'nombre' && !prev.slug) {
        next.slug = generarSlug(valor)
      }
      return next
    })
  }

  async function guardar(e) {
    e.preventDefault()
    setGuardando(true)

    const { id, ...campos } = modal
    const datos = {
      ...campos,
      precio: Number(campos.precio) || 0,
      stock: Number(campos.stock) || 0,
      anio: Number(campos.anio) || null,
    }

    let error
    if (id) {
      ;({ error } = await supabase.from('productos').update(datos).eq('id', id))
    } else {
      ;({ error } = await supabase.from('productos').insert(datos))
    }

    setGuardando(false)
    if (error) {
      mostrarToast('Error: ' + error.message, 'error')
    } else {
      mostrarToast(id ? 'Producto actualizado' : 'Producto creado')
      cerrarModal()
      cargar()
    }
  }

  async function eliminar(id) {
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) mostrarToast('Error al eliminar: ' + error.message, 'error')
    else { mostrarToast('Producto eliminado'); cargar() }
    setConfirmId(null)
  }

  async function toggle(id, campo, valorActual) {
    await supabase.from('productos').update({ [campo]: !valorActual }).eq('id', id)
    setProductos(p => p.map(v => v.id === id ? { ...v, [campo]: !valorActual } : v))
  }

  // ───────── ESTILOS BASE ─────────
  const s = {
    page: { minHeight: '100vh', background: 'var(--negro)', padding: 'clamp(2rem, 4vw, 4rem) clamp(1.5rem, 4vw, 3rem)' },
    header: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem', borderBottom: '1px solid rgba(201,168,76,0.15)', paddingBottom: '2rem' },
    eyebrow: { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' },
    titulo: { fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: 'var(--crema)', lineHeight: 1.1 },
    btnPrimario: { background: 'var(--dorado)', color: 'var(--negro)', border: 'none', padding: '0.7rem 1.6rem', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'opacity 0.2s' },
    btnSecundario: { background: 'transparent', color: 'var(--crema-apagada)', border: '1px solid rgba(201,168,76,0.25)', padding: '0.55rem 1.2rem', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' },
    btnPeligro: { background: 'transparent', color: '#c0392b', border: '1px solid rgba(192,57,43,0.4)', padding: '0.45rem 0.9rem', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' },
    tabla: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' },
    th: { color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '0.75rem 1rem', textAlign: 'left', borderBottom: '1px solid rgba(201,168,76,0.15)', whiteSpace: 'nowrap' },
    td: { color: 'var(--crema)', padding: '0.9rem 1rem', borderBottom: '1px solid rgba(255,255,255,0.04)', verticalAlign: 'middle' },
    toggle: (activo) => ({
      display: 'inline-block', width: '36px', height: '20px', borderRadius: '10px', cursor: 'pointer',
      background: activo ? 'var(--dorado)' : 'var(--gris-claro)', position: 'relative', transition: 'background 0.25s', flexShrink: 0, border: 'none',
    }),
    toggleDot: (activo) => ({
      position: 'absolute', top: '3px', left: activo ? '18px' : '3px', width: '14px', height: '14px',
      borderRadius: '50%', background: activo ? 'var(--negro)' : '#666', transition: 'left 0.25s',
    }),
    inputBase: { width: '100%', background: 'var(--gris-medio)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--crema)', padding: '0.65rem 0.9rem', fontSize: '0.85rem', fontFamily: 'var(--font-body)', outline: 'none', borderRadius: '2px', boxSizing: 'border-box' },
    label: { display: 'block', color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem' },
    gridForm: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' },
  }

  return (
    <div style={s.page}>
      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 1000,
          background: toast.tipo === 'error' ? '#5a1e28' : 'var(--gris-medio)',
          border: `1px solid ${toast.tipo === 'error' ? 'rgba(192,57,43,0.5)' : 'rgba(201,168,76,0.3)'}`,
          color: 'var(--crema)', padding: '0.9rem 1.5rem', fontSize: '0.82rem',
          letterSpacing: '0.05em', animation: 'fadeIn 0.2s ease',
        }}>
          {toast.texto}
        </div>
      )}

      {/* MODAL CONFIRM ELIMINAR */}
      {confirmId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
        }}>
          <div style={{ background: 'var(--gris)', border: '1px solid rgba(201,168,76,0.2)', padding: '2.5rem', maxWidth: '400px', width: '90%' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--crema)', fontSize: '1.3rem', marginBottom: '1rem' }}>¿Eliminar producto?</h3>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.85rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Esta acción no se puede deshacer.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button style={s.btnSecundario} onClick={() => setConfirmId(null)}>Cancelar</button>
              <button style={s.btnPeligro} onClick={() => eliminar(confirmId)}>Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORMULARIO */}
      {modal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '2rem 1rem',
        }}>
          <div style={{ background: 'var(--gris-medio)', border: '1px solid rgba(201,168,76,0.2)', width: '100%', maxWidth: '760px', padding: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {/* Cabecera modal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid rgba(201,168,76,0.12)', paddingBottom: '1.25rem' }}>
              <div>
                <p style={s.eyebrow}>{modal.id ? 'Editar producto' : 'Nuevo producto'}</p>
                <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--crema)', fontSize: '1.5rem' }}>
                  {modal.id ? modal.nombre || 'Sin nombre' : 'Agregar producto'}
                </h2>
              </div>
              <button onClick={cerrarModal} aria-label="Cerrar" style={{ background: 'transparent', border: 'none', color: 'var(--crema-apagada)', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1, padding: '0.25rem 0.5rem' }}>
                ×
              </button>
            </div>

            <form onSubmit={guardar}>
              <div style={s.gridForm}>
                {/* Nombre */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={s.label}>Nombre</label>
                  <input
                    required
                    style={s.inputBase}
                    value={modal.nombre}
                    onChange={e => handleCampo('nombre', e.target.value)}
                    placeholder="Ej: Achaval Ferrer Malbec"
                  />
                </div>

                {/* Bodega */}
                <div>
                  <label style={s.label}>Bodega</label>
                  <input
                    required
                    style={s.inputBase}
                    value={modal.bodega}
                    onChange={e => handleCampo('bodega', e.target.value)}
                    placeholder="Ej: Achaval Ferrer"
                  />
                </div>

                {/* Varietal */}
                <div>
                  <label style={s.label}>Varietal</label>
                  <input
                    required
                    style={s.inputBase}
                    value={modal.varietal}
                    onChange={e => handleCampo('varietal', e.target.value)}
                    placeholder="Ej: Malbec"
                  />
                </div>

                {/* Año */}
                <div>
                  <label style={s.label}>Cosecha (año)</label>
                  <input
                    type="number"
                    style={s.inputBase}
                    value={modal.anio}
                    onChange={e => handleCampo('anio', e.target.value)}
                    placeholder="Ej: 2021"
                    min="1900"
                    max="2100"
                  />
                </div>

                {/* Precio */}
                <div>
                  <label style={s.label}>Precio ($)</label>
                  <input
                    required
                    type="number"
                    style={s.inputBase}
                    value={modal.precio}
                    onChange={e => handleCampo('precio', e.target.value)}
                    placeholder="Ej: 8500"
                    min="0"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label style={s.label}>Stock</label>
                  <input
                    type="number"
                    style={s.inputBase}
                    value={modal.stock}
                    onChange={e => handleCampo('stock', e.target.value)}
                    placeholder="Ej: 50"
                    min="0"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label style={s.label}>Slug (URL)</label>
                  <input
                    required
                    style={s.inputBase}
                    value={modal.slug}
                    onChange={e => handleCampo('slug', e.target.value)}
                    placeholder="Ej: achaval-ferrer-malbec"
                  />
                </div>

                {/* Imagen */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={s.label}>Imagen (ruta o URL)</label>
                  <input
                    style={s.inputBase}
                    value={modal.imagen}
                    onChange={e => handleCampo('imagen', e.target.value)}
                    placeholder="Ej: /images/vino-1.png"
                  />
                </div>

                {/* Descripción */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={s.label}>Descripción</label>
                  <textarea
                    style={{ ...s.inputBase, minHeight: '90px', resize: 'vertical' }}
                    value={modal.descripcion}
                    onChange={e => handleCampo('descripcion', e.target.value)}
                    placeholder="Descripción del vino..."
                  />
                </div>

                {/* Toggles */}
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', gridColumn: '1 / -1' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={modal.activo}
                      style={s.toggle(modal.activo)}
                      onClick={() => handleCampo('activo', !modal.activo)}
                    >
                      <span style={s.toggleDot(modal.activo)} />
                    </button>
                    <span style={{ color: 'var(--crema)', fontSize: '0.82rem' }}>Activo</span>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={modal.destacado}
                      style={s.toggle(modal.destacado)}
                      onClick={() => handleCampo('destacado', !modal.destacado)}
                    >
                      <span style={s.toggleDot(modal.destacado)} />
                    </button>
                    <span style={{ color: 'var(--crema)', fontSize: '0.82rem' }}>Destacado</span>
                  </label>
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(201,168,76,0.12)' }}>
                <button type="button" style={s.btnSecundario} onClick={cerrarModal}>Cancelar</button>
                <button type="submit" style={{ ...s.btnPrimario, opacity: guardando ? 0.6 : 1 }} disabled={guardando}>
                  {guardando ? 'Guardando...' : (modal.id ? 'Guardar cambios' : 'Crear producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* HEADER */}
        <header style={s.header}>
          <div>
            <p style={s.eyebrow}>— Panel de administración</p>
            <h1 style={s.titulo}>Productos</h1>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ ...s.btnSecundario, textDecoration: 'none', display: 'inline-block' }}>
              ← Volver al sitio
            </Link>
            <Link href="/admin/pedidos" style={{ ...s.btnSecundario, textDecoration: 'none', display: 'inline-block' }}>
              Ver pedidos
            </Link>
            <button style={s.btnPrimario} onClick={abrirNuevo}>
              + Nuevo producto
            </button>
          </div>
        </header>

        {/* TABLA */}
        {cargando ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1.1rem' }}>Cargando productos...</p>
          </div>
        ) : productos.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', border: '1px solid rgba(201,168,76,0.1)' }}>
            <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
              No hay productos cargados.
            </p>
            <button style={s.btnPrimario} onClick={abrirNuevo}>Agregar el primero</button>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={s.tabla}>
              <thead>
                <tr style={{ background: 'var(--gris)' }}>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Bodega</th>
                  <th style={s.th}>Varietal</th>
                  <th style={s.th}>Precio</th>
                  <th style={s.th}>Stock</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Activo</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Destacado</th>
                  <th style={{ ...s.th, textAlign: 'right' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ background: i % 2 === 0 ? 'var(--negro)' : 'rgba(15,15,15,0.6)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--gris)'}
                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'var(--negro)' : 'rgba(15,15,15,0.6)'}
                  >
                    <td style={s.td}>
                      <span style={{ fontWeight: 500 }}>{p.nombre}</span>
                      {p.anio && <span style={{ display: 'block', color: 'var(--crema-apagada)', fontSize: '0.72rem', marginTop: '2px' }}>{p.anio}</span>}
                    </td>
                    <td style={{ ...s.td, color: 'var(--crema-apagada)' }}>{p.bodega}</td>
                    <td style={s.td}>
                      <span style={{
                        background: 'rgba(201,168,76,0.1)', color: 'var(--dorado)',
                        padding: '0.2rem 0.6rem', fontSize: '0.68rem', letterSpacing: '0.08em',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                      }}>
                        {p.varietal}
                      </span>
                    </td>
                    <td style={{ ...s.td, fontFamily: 'var(--font-editorial)', color: 'var(--dorado)', fontSize: '1rem', whiteSpace: 'nowrap' }}>
                      ${Number(p.precio).toLocaleString('es-AR')}
                    </td>
                    <td style={{ ...s.td, color: p.stock < 5 ? '#e74c3c' : 'var(--crema)' }}>
                      {p.stock}
                    </td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          role="switch"
                          aria-checked={p.activo}
                          aria-label={p.activo ? 'Desactivar' : 'Activar'}
                          style={s.toggle(p.activo)}
                          onClick={() => toggle(p.id, 'activo', p.activo)}
                        >
                          <span style={s.toggleDot(p.activo)} />
                        </button>
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          role="switch"
                          aria-checked={p.destacado}
                          aria-label={p.destacado ? 'Quitar destacado' : 'Marcar destacado'}
                          style={s.toggle(p.destacado)}
                          onClick={() => toggle(p.id, 'destacado', p.destacado)}
                        >
                          <span style={s.toggleDot(p.destacado)} />
                        </button>
                      </div>
                    </td>
                    <td style={{ ...s.td, textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end' }}>
                        <button style={s.btnSecundario} onClick={() => abrirEditar(p)}>Editar</button>
                        <button style={s.btnPeligro} onClick={() => setConfirmId(p.id)}>Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.72rem', letterSpacing: '0.05em', marginTop: '1.5rem', textAlign: 'right', opacity: 0.6 }}>
              {productos.length} producto{productos.length !== 1 ? 's' : ''} en total
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
