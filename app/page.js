'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import vinos from '@/data/vinos'
import Image from 'next/image'

export default function Home() {
  const [destacados, setDestacados] = useState([])

  useEffect(() => {
    const top = vinos.slice(0, 3)
    setDestacados(top)
  }, [])

  return (
    <>
      
      {/* HERO */}
   <section aria-labelledby="hero-titulo" style={{
      height: 'calc(100vh - 60px)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--dorado)',
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85)), url(/images/hero-bg.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      }}>
        <Image
          className="fade-in"
          src="/images/logo-hero.png"
          alt="Cava del Plata"
          width={500}
          height={370}
          style={{ objectFit: 'contain', marginBottom: '1rem' }}
          priority
        />
        <p className="fade-in delay-1" style={{
          color: 'var(--dorado)',
          fontSize: '0.8rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Selección Premium · Argentina
        </p>

        <h1 className="fade-in-up delay-2" id="hero-titulo" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
          color: 'var(--crema)',
          lineHeight: '1.1',
          marginBottom: '1rem',
          maxWidth: '800px',
        }}>
          Vinos que cuentan una historia
        </h1>

        <p className="fade-in-up delay-3" style={{
          color: 'var(--crema)',
          opacity: 0.7,
          fontSize: '1rem',
          maxWidth: '500px',
          lineHeight: '1.7',
          marginBottom: '1rem',
        }}>
          Boutique de vinos de autor seleccionados por sommeliers. 
          Cada botella es una experiencia única.
        </p>

        <Link className="btn-hover fade-in delay-4" href="/catalogo" style={{
          backgroundColor: 'var(--dorado)',
          color: 'var(--negro)',
          padding: '1rem 2.5rem',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontWeight: '600',
        }}>
          Ver Catálogo
        </Link>
      </section>

      {/* DESTACADOS */}
      <section aria-labelledby="destacados-titulo" style={{
        padding: '5rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h2 id="destacados-titulo" style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--dorado)',
          fontSize: '2rem',
          marginBottom: '0.5rem',
          textAlign: 'center',
        }}>
          Destacados de la semana
        </h2>
        <p style={{
          textAlign: 'center',
          color: 'var(--crema)',
          opacity: 0.6,
          marginBottom: '3rem',
          fontSize: '0.9rem',
          letterSpacing: '0.05em',
        }}>
          Seleccionados por nuestros sommeliers
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
        }}>
          {destacados.map(vino => (
            <article className="card-hover" key={vino.id} aria-label={vino.nombre} style={{
              backgroundColor: 'var(--gris)',
              border: '1px solid var(--gris-claro)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}>
              <p style={{
                color: 'var(--dorado)',
                fontSize: '0.75rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}>
                {vino.varietal} · {vino.año}
              </p>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                color: 'var(--crema)',
              }}>
                {vino.nombre}
              </h3>
              <p style={{
                color: 'var(--crema)',
                opacity: 0.6,
                fontSize: '0.85rem',
                lineHeight: '1.6',
              }}>
                {vino.descripcion.slice(0, 100)}...
              </p>
              <p style={{
                color: 'var(--dorado)',
                fontSize: '1.2rem',
                fontWeight: '600',
                marginTop: 'auto',
              }}>
                ${vino.precio.toLocaleString('es-AR')}
              </p>
              <Link className="btn-hover" href={`/vino/${vino.id}`} style={{
                border: '1px solid var(--dorado)',
                color: 'var(--dorado)',
                padding: '0.6rem 1rem',
                textAlign: 'center',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}>
                Ver más
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* BANNER */}
      <section aria-label="Propuesta de valor" style={{
        backgroundColor: 'var(--gris)',
        borderTop: '1px solid var(--dorado)',
        borderBottom: '1px solid var(--dorado)',
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '2rem',
        textAlign: 'center',
      }}>
        {[
          { titulo: 'Envío gratis', descripcion: 'En compras mayores a $15.000' },
          { titulo: 'Selección sommelier', descripcion: 'Cada vino es elegido por expertos' },
          { titulo: 'Pago seguro', descripcion: 'Medios de pago protegidos' },
        ].map(item => (
          <div key={item.titulo}>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--dorado)',
              fontSize: '1.1rem',
              marginBottom: '0.5rem',
            }}>
              {item.titulo}
            </h3>
            <p style={{
              color: 'var(--crema)',
              opacity: 0.6,
              fontSize: '0.85rem',
            }}>
              {item.descripcion}
            </p>
          </div>
        ))}
      </section>
    </>
  )
}