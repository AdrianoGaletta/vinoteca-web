'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import vinos from '@/data/vinos'
import { useCart } from '@/components/CartContext'
import Image from 'next/image'

export default function DetalleVino() {
  const { id } = useParams()
  const vino = vinos.find(v => v.id === Number(id))
  const { agregarAlCarrito } = useCart()
  const [agregado, setAgregado] = useState(false)
  const [cantidad, setCantidad] = useState(1)

  if (!vino) {
    return (
      <section style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', color: 'var(--crema)' }}>
          Vino no encontrado
        </h1>
        <Link href="/catalogo" style={{ color: 'var(--dorado)', marginTop: '1rem', display: 'inline-block' }}>
          Volver al catálogo
        </Link>
      </section>
    )
  }

  function handleAgregar() {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(vino)
    }
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  return (
    <article style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>

      {/* BREADCRUMB */}
      <nav aria-label="Breadcrumb" style={{
        marginBottom: '2.5rem',
        fontSize: '0.8rem',
        color: 'var(--crema)',
        opacity: 0.5,
        letterSpacing: '0.05em',
      }}>
        <Link href="/">Inicio</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <Link href="/catalogo">Catálogo</Link>
        <span style={{ margin: '0 0.5rem' }}>/</span>
        <span style={{ opacity: 1, color: 'var(--dorado)' }}>{vino.nombre}</span>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '4rem',
        alignItems: 'start',
      }}>

        {/* IMAGEN PLACEHOLDER */}
        <div style={{
          backgroundColor: 'var(--gris)',
          border: '1px solid var(--gris-claro)',
          aspectRatio: '3/4',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <Image
            src={vino.imagen}
            alt={vino.nombre}
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>

        {/* INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          <p style={{
            color: 'var(--dorado)',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            {vino.varietal} · {vino.region} · {vino.año}
          </p>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.2rem',
            color: 'var(--crema)',
            lineHeight: '1.2',
          }}>
            {vino.nombre}
          </h1>

          <p style={{
            color: 'var(--crema)',
            opacity: 0.5,
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
          }}>
            {vino.bodega}
          </p>

          <p style={{
            color: 'var(--crema)',
            opacity: 0.7,
            lineHeight: '1.8',
            fontSize: '0.95rem',
            borderTop: '1px solid var(--gris-claro)',
            paddingTop: '1.25rem',
          }}>
            {vino.descripcion}
          </p>

          {/* DETALLES */}
          <dl style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.75rem',
            borderTop: '1px solid var(--gris-claro)',
            paddingTop: '1.25rem',
          }}>
            {[
              { label: 'Bodega', value: vino.bodega },
              { label: 'Varietal', value: vino.varietal },
              { label: 'Región', value: vino.region },
              { label: 'Cosecha', value: vino.año },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt style={{
                  color: 'var(--dorado)',
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem',
                }}>
                  {label}
                </dt>
                <dd style={{
                  color: 'var(--crema)',
                  fontSize: '0.9rem',
                }}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          {/* PRECIO */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            color: 'var(--dorado)',
          }}>
            ${vino.precio.toLocaleString('es-AR')}
          </p>

          {/* CANTIDAD */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}>
            <label htmlFor="cantidad" style={{
              color: 'var(--crema)',
              fontSize: '0.85rem',
              opacity: 0.6,
              letterSpacing: '0.05em',
            }}>
              Cantidad
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => setCantidad(c => Math.max(1, c - 1))}
                aria-label="Reducir cantidad"
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid var(--gris-claro)',
                  backgroundColor: 'transparent',
                  color: 'var(--crema)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                −
              </button>
              <span id="cantidad" style={{
                color: 'var(--crema)',
                minWidth: '24px',
                textAlign: 'center',
              }}>
                {cantidad}
              </span>
              <button
                onClick={() => setCantidad(c => c + 1)}
                aria-label="Aumentar cantidad"
                style={{
                  width: '32px',
                  height: '32px',
                  border: '1px solid var(--gris-claro)',
                  backgroundColor: 'transparent',
                  color: 'var(--crema)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* BOTÓN */}
          <button
            onClick={handleAgregar}
            aria-label={`Agregar ${cantidad} ${vino.nombre} al carrito`}
            style={{
              backgroundColor: agregado ? 'var(--gris-claro)' : 'var(--dorado)',
              color: 'var(--negro)',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.2s',
            }}
          >
            {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>

          <Link href="/catalogo" style={{
            color: 'var(--crema)',
            opacity: 0.5,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}>
            ← Volver al catálogo
          </Link>

        </div>
      </div>
    </article>
  )
}