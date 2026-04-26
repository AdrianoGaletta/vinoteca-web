'use client'

import { useState } from 'react'
import vinos from '@/data/vinos'
import ProductCard from '@/components/ProductCard'

export default function Catalogo() {
  const [filtro, setFiltro] = useState('Todos')

  const variatales = ['Todos', ...new Set(vinos.map(v => v.varietal))]

  const vinosFiltrados = filtro === 'Todos'
    ? vinos
    : vinos.filter(v => v.varietal === filtro)

  return (
    <section style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          color: 'var(--crema)',
          marginBottom: '0.5rem',
        }}>
          Catálogo
        </h1>
        <p style={{
          color: 'var(--crema)',
          opacity: 0.6,
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
        }}>
          {vinosFiltrados.length} vinos disponibles
        </p>
      </header>

      {/* FILTROS */}
      <nav aria-label="Filtros por varietal" style={{
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: '3rem',
      }}>
        {variatales.map(varietal => (
          <button
            key={varietal}
            onClick={() => setFiltro(varietal)}
            aria-pressed={filtro === varietal}
            style={{
              padding: '0.5rem 1.25rem',
              border: '1px solid',
              borderColor: filtro === varietal ? 'var(--dorado)' : 'var(--gris-claro)',
              backgroundColor: filtro === varietal ? 'var(--dorado)' : 'transparent',
              color: filtro === varietal ? 'var(--negro)' : 'var(--crema)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {varietal}
          </button>
        ))}
      </nav>

      {/* GRID DE PRODUCTOS */}
      <div
        role="list"
        aria-label="Lista de vinos"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        {vinosFiltrados.map(vino => (
          <ProductCard key={vino.id} vino={vino} />
        ))}
      </div>

    </section>
  )
}