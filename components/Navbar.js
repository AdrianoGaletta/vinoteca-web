'use client'

import Link from 'next/link'
import { useCart } from './CartContext'
import Image from 'next/image'

export default function Navbar() {
  const { totalItems } = useCart()

  return (
    <nav aria-label="Navegación principal" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(10, 10, 10, 0.95)',
      borderBottom: '1px solid var(--dorado)',
      padding: '0.6rem 2rem',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      backdropFilter: 'blur(8px)',
    }}>

      {/* IZQUIERDA — Texto */}
      <Link href="/" style={{
        display: 'flex',
        flexDirection: 'column',
        lineHeight: '1.3',
        textDecoration: 'none',
      }}>
        <span style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--dorado)',
          fontSize: '1.2rem',
          letterSpacing: '0.08em',
        }}>
          Cava del Plata
        </span>
        <span style={{
          color: 'var(--crema)',
          fontSize: '0.6rem',
          letterSpacing: '0.4em',
          opacity: 0.6,
          textTransform: 'uppercase',
        }}>
          · Vinoteca ·
        </span>
      </Link>

      {/* CENTRO — Navegación */}
      <ul role="list" style={{
        display: 'flex',
        gap: '2.5rem',
        listStyle: 'none',
        alignItems: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
      }}>
        <li><Link href="/" className="nav-link" style={{ color: 'var(--crema)' }}>Inicio</Link></li>
        <li><Link href="/catalogo" className="nav-link" style={{ color: 'var(--crema)' }}>Catálogo</Link></li>
        <li><Link href="/nosotros" className="nav-link" style={{ color: 'var(--crema)' }}>Nosotros</Link></li>
        <li><Link href="/contacto" className="nav-link" style={{ color: 'var(--crema)' }}>Contacto</Link></li>
      </ul>

      {/* DERECHA — Copa + Carrito */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <Image
          src="/images/logo-copa.png"
          alt="Cava del Plata"
          width={30}
          height={30}
          style={{ objectFit: 'contain' }}
          priority
        />
        <Link href="/carrito" aria-label={`Carrito con ${totalItems} productos`} style={{
          color: 'var(--dorado)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
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
      </div>

    </nav>
  )
}