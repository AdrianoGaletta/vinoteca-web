'use client'

import Link from 'next/link'
import { useCart } from './CartContext'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <nav aria-label="Navegación principal" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderBottom: '1px solid var(--dorado)',
      padding: '1.2rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backdropFilter: 'blur(8px)',
    }}>

      <Link href="/" style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1.5rem',
        color: 'var(--dorado)',
        letterSpacing: '0.1em',
      }}>
        VINOTECA
      </Link>

      <ul role="list" style={{
        display: 'flex',
        gap: '2rem',
        listStyle: 'none',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        letterSpacing: '0.05em',
      }}>
        <li><Link href="/" style={{ color: 'var(--crema)' }}>Inicio</Link></li>
        <li><Link href="/catalogo" style={{ color: 'var(--crema)' }}>Catálogo</Link></li>
        <li><Link href="/nosotros" style={{ color: 'var(--crema)' }}>Nosotros</Link></li>
        <li><Link href="/contacto" style={{ color: 'var(--crema)' }}>Contacto</Link></li>
        <li>
          <Link href="/carrito" aria-label={`Carrito con ${totalItems} productos`} style={{
            color: 'var(--dorado)',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            🛒
            {totalItems > 0 && (
              <span style={{
                backgroundColor: 'var(--dorado)',
                color: 'var(--negro)',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
              }}>
                {totalItems}
              </span>
            )}
          </Link>
        </li>
      </ul>

    </nav>
  )
}