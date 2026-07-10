'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from './CartContext'

const enlaces = [
  { href: '/', label: 'Inicio' },
  { href: '/catalogo', label: 'Catálogo' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const { totalItems, usuario } = useCart()
  const [menuAbierto, setMenuAbierto] = useState(false)

  return (
    <nav className="navbar" aria-label="Navegación principal">

      {/* MARCA — la copa es parte del enlace al inicio */}
      <Link href="/" className="navbar-brand" onClick={() => setMenuAbierto(false)}>
        <Image
          src="/images/logo-copa.png"
          alt=""
          width={30}
          height={30}
          style={{ objectFit: 'contain' }}
          priority
        />
        <span className="navbar-brand-texto">
          <span className="navbar-brand-titulo">Cava del Plata</span>
          <span className="navbar-brand-sub">· Vinoteca ·</span>
        </span>
      </Link>

      {/* NAVEGACIÓN CENTRAL (escritorio) */}
      <ul role="list" className="navbar-links">
        {enlaces.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} className="nav-link" style={{ color: 'var(--crema)' }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      {/* ACCIONES — cuenta, carrito y menú móvil */}
      <div className="navbar-acciones">
        {usuario ? (
          <Link
            href="/mi-cuenta"
            aria-label="Mi cuenta"
            title={usuario.email}
            className="navbar-icono"
            onClick={() => setMenuAbierto(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        ) : (
          <Link
            href="/auth/login"
            aria-label="Iniciar sesión"
            className="navbar-icono"
            onClick={() => setMenuAbierto(false)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </Link>
        )}

        <Link
          href="/carrito"
          aria-label={`Carrito con ${totalItems} productos`}
          className="navbar-icono navbar-carrito"
          onClick={() => setMenuAbierto(false)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {totalItems > 0 && <span className="navbar-badge">{totalItems}</span>}
        </Link>

        <button
          type="button"
          className="navbar-hamburguesa"
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuAbierto(a => !a)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {menuAbierto ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* MENÚ MÓVIL desplegable */}
      <ul
        role="list"
        id="menu-movil"
        className={`navbar-menu-movil ${menuAbierto ? 'abierto' : ''}`}
      >
        {enlaces.map(({ href, label }) => (
          <li key={href}>
            <Link href={href} onClick={() => setMenuAbierto(false)}>
              {label}
            </Link>
          </li>
        ))}
      </ul>

    </nav>
  )
}
