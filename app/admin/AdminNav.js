'use client'

import Link from 'next/link'

const tabs = [
  { clave: 'productos', href: '/admin', label: 'Productos' },
  { clave: 'pedidos', href: '/admin/pedidos', label: 'Pedidos y ventas' },
]

export default function AdminNav({ activa }) {
  return (
    <nav aria-label="Secciones del panel" style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(201,168,76,0.1)', marginBottom: '2rem' }}>
      {tabs.map(tab => (
        <Link
          key={tab.clave}
          href={tab.href}
          aria-current={activa === tab.clave ? 'page' : undefined}
          style={{
            padding: '0.75rem 1.5rem',
            borderBottom: activa === tab.clave ? '2px solid var(--dorado)' : '2px solid transparent',
            color: activa === tab.clave ? 'var(--dorado)' : 'var(--crema-apagada)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            marginBottom: '-1px',
            transition: 'all 0.2s',
          }}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  )
}
