'use client'

import Link from 'next/link'
import { useCart } from '@/components/CartContext'

export default function Carrito() {
  const { carrito, eliminarDelCarrito, actualizarCantidad, totalItems, totalPrecio } = useCart()

  if (carrito.length === 0) {
    return (
      <main style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          color: 'var(--crema)',
          marginBottom: '1rem',
        }}>
          Tu carrito está vacío
        </h1>
        <p style={{
          color: 'var(--crema)',
          opacity: 0.6,
          fontSize: '0.95rem',
          marginBottom: '2rem',
          lineHeight: '1.7',
        }}>
          Todavía no agregaste ningún vino. Explorá nuestro catálogo y encontrá tu próxima botella favorita.
        </p>
        <Link href="/catalogo" style={{
          backgroundColor: 'var(--dorado)',
          color: 'var(--negro)',
          padding: '1rem 2.5rem',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}>
          Ver catálogo
        </Link>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>

      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          color: 'var(--crema)',
          marginBottom: '0.5rem',
        }}>
          Tu carrito
        </h1>
        <p style={{
          color: 'var(--crema)',
          opacity: 0.5,
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
        }}>
          {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '3rem',
        alignItems: 'start',
      }}>

        {/* LISTA DE PRODUCTOS */}
        <section aria-label="Productos en el carrito">
          <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {carrito.map(item => (
              <li key={item.id} role="listitem" style={{
                backgroundColor: 'var(--gris)',
                border: '1px solid var(--gris-claro)',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{
                      color: 'var(--dorado)',
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '0.25rem',
                    }}>
                      {item.varietal} · {item.año}
                    </p>
                    <h2 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem',
                      color: 'var(--crema)',
                    }}>
                      {item.nombre}
                    </h2>
                    <p style={{
                      color: 'var(--crema)',
                      opacity: 0.5,
                      fontSize: '0.8rem',
                      marginTop: '0.2rem',
                    }}>
                      {item.bodega}
                    </p>
                  </div>

                  <button
                    onClick={() => eliminarDelCarrito(item.id)}
                    aria-label={`Eliminar ${item.nombre} del carrito`}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--crema)',
                      opacity: 0.4,
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>

                  {/* SELECTOR DE CANTIDAD */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      aria-label="Reducir cantidad"
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '1px solid var(--gris-claro)',
                        backgroundColor: 'transparent',
                        color: 'var(--crema)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      −
                    </button>
                    <span aria-label={`Cantidad: ${item.cantidad}`} style={{
                      color: 'var(--crema)',
                      minWidth: '20px',
                      textAlign: 'center',
                      fontSize: '0.9rem',
                    }}>
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      aria-label="Aumentar cantidad"
                      style={{
                        width: '28px',
                        height: '28px',
                        border: '1px solid var(--gris-claro)',
                        backgroundColor: 'transparent',
                        color: 'var(--crema)',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      +
                    </button>
                  </div>

                  <p style={{
                    color: 'var(--dorado)',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                  }}>
                    ${(item.precio * item.cantidad).toLocaleString('es-AR')}
                  </p>

                </div>

              </li>
            ))}
          </ul>
        </section>

        {/* RESUMEN */}
        <aside aria-label="Resumen del pedido" style={{
          backgroundColor: 'var(--gris)',
          border: '1px solid var(--dorado)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          position: 'sticky',
          top: '100px',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--crema)',
            fontSize: '1.3rem',
            marginBottom: '0.5rem',
          }}>
            Resumen del pedido
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--crema)',
            opacity: 0.6,
            fontSize: '0.85rem',
          }}>
            <span>Productos ({totalItems})</span>
            <span>${totalPrecio.toLocaleString('es-AR')}</span>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'var(--crema)',
            opacity: 0.6,
            fontSize: '0.85rem',
          }}>
            <span>Envío</span>
            <span style={{ color: '#4caf50' }}>
              {totalPrecio >= 15000 ? 'Gratis' : '$1.500'}
            </span>
          </div>

          <div style={{
            borderTop: '1px solid var(--gris-claro)',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}>
            <span style={{
              color: 'var(--crema)',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Total
            </span>
            <span style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--dorado)',
              fontSize: '1.5rem',
            }}>
              ${(totalPrecio >= 15000 ? totalPrecio : totalPrecio + 1500).toLocaleString('es-AR')}
            </span>
          </div>

          <button
            style={{
              backgroundColor: 'var(--dorado)',
              color: 'var(--negro)',
              border: 'none',
              padding: '1rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              marginTop: '0.5rem',
            }}
          >
            Finalizar compra
          </button>

          <Link href="/catalogo" style={{
            textAlign: 'center',
            color: 'var(--crema)',
            opacity: 0.5,
            fontSize: '0.8rem',
            letterSpacing: '0.05em',
          }}>
            ← Seguir comprando
          </Link>

        </aside>
      </div>
    </main>
  )
}