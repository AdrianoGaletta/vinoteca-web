'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { useState } from 'react'
import Image from 'next/image'

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
      className="card-hover"
      style={{
        backgroundColor: 'var(--gris)',
        border: '1px solid rgba(201, 168, 76, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
        padding: '0',
        overflow: 'hidden',
        borderRadius: '12px',
      }}
    >
      {/* IMAGEN */}
      <div style={{
        width: '100%',
        height: '320px',
        position: 'relative',
        borderBottom: '1px solid rgba(201, 168, 76, 0.3)',
        overflow: 'hidden',
      }}>
        <Image
          src={vino.imagen}
          alt={vino.nombre}
          fill
          style={{ 
            objectFit: 'contain', 
            padding: '0.5rem',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {/* CONTENIDO */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.6rem',
        flexGrow: 1,
      }}>
        <p style={{
          color: 'var(--dorado)',
          fontSize: '0.7rem',
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
          opacity: 0.5,
          letterSpacing: '0.03em',
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
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--crema)',
              padding: '0.7rem 1rem',
              textAlign: 'center',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              borderRadius: '6px',
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
              padding: '0.7rem 1rem',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'var(--font-body)',
              borderRadius: '6px',
            }}
          >
            {agregado ? '✓ Agregado' : 'Agregar'}
          </button>
        </div>
      </div>
    </article>
  )
}