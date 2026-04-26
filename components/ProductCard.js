'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { useState } from 'react'

export default function ProductCard({ vino }) {
  const { agregarAlCarrito } = useCart()
  const [agregado, setAgregado] = useState(false)

  function handleAgregar() {
    agregarAlCarrito(vino)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <article
      role="listitem"
      aria-label={vino.nombre}
      style={{
        backgroundColor: 'var(--gris)',
        border: '1px solid var(--gris-claro)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        padding: '2rem',
        transition: 'border-color 0.2s',
      }}
    >
      <p style={{
        color: 'var(--dorado)',
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
      }}>
        {vino.varietal} · {vino.region} · {vino.año}
      </p>

      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.3rem',
        color: 'var(--crema)',
        lineHeight: '1.3',
      }}>
        {vino.nombre}
      </h2>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--crema)',
        opacity: 0.6,
      }}>
        {vino.bodega}
      </p>

      <p style={{
        fontSize: '0.85rem',
        color: 'var(--crema)',
        opacity: 0.6,
        lineHeight: '1.6',
        flexGrow: 1,
      }}>
        {vino.descripcion.slice(0, 90)}...
      </p>

      <p style={{
        color: 'var(--dorado)',
        fontSize: '1.3rem',
        fontWeight: '600',
        marginTop: '0.5rem',
      }}>
        ${vino.precio.toLocaleString('es-AR')}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
        <Link
          href={`/vino/${vino.id}`}
          style={{
            flex: 1,
            border: '1px solid var(--gris-claro)',
            color: 'var(--crema)',
            padding: '0.6rem 1rem',
            textAlign: 'center',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Ver más
        </Link>

        <button
          onClick={handleAgregar}
          aria-label={`Agregar ${vino.nombre} al carrito`}
          style={{
            flex: 1,
            border: '1px solid var(--dorado)',
            backgroundColor: agregado ? 'var(--dorado)' : 'transparent',
            color: agregado ? 'var(--negro)' : 'var(--dorado)',
            padding: '0.6rem 1rem',
            fontSize: '0.8rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'var(--font-body)',
          }}
        >
          {agregado ? '✓ Agregado' : 'Agregar'}
        </button>
      </div>
    </article>
  )
}