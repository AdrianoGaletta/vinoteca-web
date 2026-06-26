'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import ProductCard from '@/components/ProductCard'

export default function Catalogo() {
  const [vinos, setVinos] = useState([])
  const [filtro, setFiltro] = useState('Todos')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('nombre')
      .then(({ data }) => {
        setVinos(data ?? [])
        setCargando(false)
      })
  }, [])

  const variatales = ['Todos', ...new Set(vinos.map(v => v.varietal))]
  const vinosFiltrados = filtro === 'Todos' ? vinos : vinos.filter(v => v.varietal === filtro)

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{
        padding: 'clamp(4rem, 8vw, 7rem) clamp(1.5rem, 5vw, 4rem) 0',
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        alignItems: 'flex-end',
        gap: '2rem',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        paddingBottom: '2.5rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            — Selección completa
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            color: 'var(--crema)',
            lineHeight: '1.05',
            letterSpacing: '-0.02em',
          }}>
            Catálogo
          </h1>
        </div>
        <p style={{
          color: 'var(--crema-apagada)',
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          alignSelf: 'flex-end',
          paddingBottom: '0.5rem',
        }}>
          {cargando ? '...' : `${vinosFiltrados.length} vinos`}
        </p>
      </header>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 7rem)' }}>

        {/* FILTROS */}
        {!cargando && (
          <nav aria-label="Filtros por varietal" style={{
            display: 'flex',
            gap: '0',
            flexWrap: 'wrap',
            margin: '2.5rem 0',
            borderBottom: '1px solid rgba(201,168,76,0.1)',
          }}>
            {variatales.map(varietal => (
              <button
                key={varietal}
                onClick={() => setFiltro(varietal)}
                aria-pressed={filtro === varietal}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderBottom: filtro === varietal ? '2px solid var(--dorado)' : '2px solid transparent',
                  background: 'transparent',
                  color: filtro === varietal ? 'var(--dorado)' : 'var(--crema-apagada)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  marginBottom: '-1px',
                }}
              >
                {varietal}
              </button>
            ))}
          </nav>
        )}

        {/* GRID */}
        {cargando ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '2.5rem',
          }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{
                height: '450px',
                background: 'var(--gris)',
                border: '1px solid rgba(201,168,76,0.06)',
                borderRadius: '2px',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        ) : (
          <div
            role="list"
            aria-label="Lista de vinos"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {vinosFiltrados.map((vino, i) => (
              <ProductCard key={vino.id} vino={vino} index={i} />
            ))}
          </div>
        )}

        {/* Sin resultados */}
        {!cargando && vinosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem', color: 'var(--crema-apagada)' }}>
            <p style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.5rem', marginBottom: '1rem' }}>
              Sin resultados para «{filtro}»
            </p>
            <button onClick={() => setFiltro('Todos')} style={{
              background: 'transparent', border: '1px solid rgba(201,168,76,0.3)',
              color: 'var(--dorado)', padding: '0.6rem 1.5rem',
              fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
            }}>
              Ver todos
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
