'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartContext'

export default function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, totalItems, totalPrecio } = useCart()
  const envio = totalPrecio >= 15000 ? 0 : 1500
  const total = totalPrecio + envio

  if (carrito.length === 0) {
    return (
      <main style={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(4rem, 12vw, 9rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.12)',
          lineHeight: 1,
          userSelect: 'none',
          marginBottom: '1rem',
        }}>
          ∅
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: 'var(--crema)',
          marginBottom: '1rem',
          fontWeight: 400,
        }}>
          Tu carrito está vacío
        </h1>
        <p style={{
          fontFamily: 'var(--font-editorial)',
          color: 'var(--crema-apagada)',
          fontSize: '1rem',
          marginBottom: '2.5rem',
          lineHeight: '1.8',
          maxWidth: '420px',
          fontWeight: 300,
        }}>
          Todavía no agregaste ningún vino. Explorá nuestra selección y encontrá tu próxima botella favorita.
        </p>
        <Link href="/catalogo" className="btn-hover" style={{
          background: 'var(--dorado)',
          color: 'var(--negro)',
          padding: '0.9rem 2.5rem',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          fontWeight: '700',
          display: 'inline-block',
        }}>
          Ver catálogo
        </Link>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)' }}>

      {/* HEADER */}
      <header style={{ marginBottom: '3rem', borderBottom: '1px solid rgba(201,168,76,0.12)', paddingBottom: '2rem' }}>
        <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          — Resumen
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: 'var(--crema)',
            fontWeight: 400,
          }}>
            Tu carrito
          </h1>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 340px',
        gap: '3rem',
        alignItems: 'start',
      }}>

        {/* LISTA */}
        <section aria-label="Productos en el carrito">
          <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0' }}>
            {carrito.map((item, i) => (
              <li key={item.id} role="listitem" style={{
                display: 'grid',
                gridTemplateColumns: '80px 1fr auto',
                gap: '1.5rem',
                alignItems: 'center',
                padding: '1.5rem 0',
                borderBottom: '1px solid rgba(201,168,76,0.08)',
              }}>
                {/* Imagen miniatura */}
                <div style={{
                  height: '80px',
                  background: '#0c0c0c',
                  border: '1px solid rgba(201,168,76,0.1)',
                  position: 'relative',
                  flexShrink: 0,
                }}>
                  {item.imagen && (
                    <Image src={item.imagen} alt={item.nombre} fill style={{ objectFit: 'contain', padding: '6px' }} />
                  )}
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span className="varietal-tag">{item.varietal}</span>
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: 'var(--crema)',
                    marginBottom: '0.15rem',
                  }}>
                    {item.nombre}
                  </h2>
                  <p style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem' }}>{item.bodega}</p>

                  {/* Cantidad */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.75rem' }}>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      style={{
                        width: '26px', height: '26px',
                        border: '1px solid var(--gris-claro)',
                        background: 'transparent',
                        color: 'var(--crema)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s',
                      }}
                    >−</button>
                    <span style={{ color: 'var(--crema)', minWidth: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      style={{
                        width: '26px', height: '26px',
                        border: '1px solid var(--gris-claro)',
                        background: 'transparent',
                        color: 'var(--crema)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'border-color 0.2s',
                      }}
                    >+</button>
                  </div>
                </div>

                {/* Precio + eliminar */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-editorial)',
                    color: 'var(--dorado)',
                    fontSize: '1.3rem',
                    fontWeight: 300,
                    whiteSpace: 'nowrap',
                  }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                  </p>
                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    aria-label={`Eliminar ${item.nombre}`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--crema-apagada)',
                      cursor: 'pointer',
                      fontSize: '0.7rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      opacity: 0.5,
                      transition: 'opacity 0.2s',
                      padding: 0,
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/catalogo" style={{
              color: 'var(--crema-apagada)',
              fontSize: '0.75rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              opacity: 0.6,
            }}>
              ← Seguir comprando
            </Link>
          </div>
        </section>

        {/* RESUMEN */}
        <aside aria-label="Resumen del pedido" style={{
          background: 'var(--gris)',
          border: '1px solid rgba(201,168,76,0.15)',
          padding: '2rem',
          position: 'sticky',
          top: '80px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--crema)',
            fontSize: '1.1rem',
            fontWeight: 400,
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}>
            Resumen del pedido
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
              <span style={{ color: 'var(--crema-apagada)' }}>Subtotal ({totalItems})</span>
              <span style={{ color: 'var(--crema)' }}>${totalPrecio.toLocaleString('es-AR')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
              <span style={{ color: 'var(--crema-apagada)' }}>Envío</span>
              <span style={{ color: envio === 0 ? '#6fcf97' : 'var(--crema)' }}>
                {envio === 0 ? 'Gratis' : `$${envio.toLocaleString('es-AR')}`}
              </span>
            </div>
            {totalPrecio < 15000 && (
              <p style={{ fontSize: '0.7rem', color: 'var(--crema-apagada)', opacity: 0.6, lineHeight: '1.5', marginTop: '0.25rem' }}>
                Agregá ${(15000 - totalPrecio).toLocaleString('es-AR')} más para obtener envío gratis
              </p>
            )}
          </div>

          <div style={{
            borderTop: '1px solid rgba(201,168,76,0.15)',
            paddingTop: '1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '1.5rem',
          }}>
            <span style={{ color: 'var(--crema-apagada)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Total</span>
            <span style={{
              fontFamily: 'var(--font-editorial)',
              color: 'var(--dorado)',
              fontSize: '2rem',
              fontWeight: 300,
            }}>
              ${total.toLocaleString('es-AR')}
            </span>
          </div>

          <Link href="/checkout" className="btn-hover" style={{
            display: 'block',
            width: '100%',
            background: 'var(--dorado)',
            color: 'var(--negro)',
            padding: '1rem',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: '700',
            textAlign: 'center',
            fontFamily: 'var(--font-body)',
          }}>
            Finalizar compra
          </Link>

          <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.68rem', color: 'var(--crema-apagada)', opacity: 0.5, letterSpacing: '0.05em' }}>
            Pago seguro · SSL encriptado
          </p>
        </aside>

      </div>
    </main>
  )
}
