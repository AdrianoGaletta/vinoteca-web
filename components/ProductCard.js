'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import { useState } from 'react'
import Image from 'next/image'

export default function ProductCard({ vino, index = 0 }) {
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
        background: 'var(--gris)',
        border: '1px solid rgba(201, 168, 76, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: '2px',
      }}
    >
      {/* Imagen */}
      <div style={{
        width: '100%',
        height: '300px',
        position: 'relative',
        background: '#0c0c0c',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(201, 168, 76, 0.1)',
      }}>
        <Image
          src={vino.imagen}
          alt={vino.nombre}
          fill
          style={{
            objectFit: 'contain',
            padding: '1rem',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
        {/* Badge destacado */}
        {vino.destacado && (
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'var(--dorado)',
            fontSize: '0.6rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '0.25rem 0.6rem',
          }}>
            Destacado
          </div>
        )}
      </div>

      {/* Contenido */}
      <div style={{
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        flexGrow: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span className="varietal-tag">{vino.varietal}</span>
          {vino.anio && (
            <span style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>{vino.anio}</span>
          )}
        </div>

        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
          color: 'var(--crema)',
          lineHeight: '1.3',
        }}>
          {vino.nombre}
        </h2>

        <p style={{
          fontSize: '0.75rem',
          color: 'var(--crema-apagada)',
          letterSpacing: '0.05em',
        }}>
          {vino.bodega}
        </p>

        <p style={{
          fontSize: '0.82rem',
          color: 'var(--crema)',
          opacity: 0.5,
          lineHeight: '1.7',
          flexGrow: 1,
          fontFamily: 'var(--font-editorial)',
          fontWeight: 300,
        }}>
          {vino.descripcion?.slice(0, 85)}...
        </p>

        {/* Precio + acciones */}
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--gris-claro)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <p style={{
            fontFamily: 'var(--font-editorial)',
            color: 'var(--dorado)',
            fontSize: '1.5rem',
            fontWeight: 300,
          }}>
            ${vino.precio.toLocaleString('es-AR')}
          </p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href={`/vino/${vino.slug ?? vino.id}`}
              className="btn-hover"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--crema-apagada)',
                padding: '0.6rem 0.9rem',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                borderRadius: '2px',
              }}
            >
              Ver
            </Link>

            <button
              onClick={handleAgregar}
              aria-label={`Agregar ${vino.nombre} al carrito`}
              style={{
                border: '1px solid var(--dorado)',
                background: agregado ? 'var(--dorado)' : 'transparent',
                color: agregado ? 'var(--negro)' : 'var(--dorado)',
                padding: '0.6rem 0.9rem',
                fontSize: '0.68rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.25s',
                fontFamily: 'var(--font-body)',
                borderRadius: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              {agregado ? '✓' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}
