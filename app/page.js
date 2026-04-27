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
          style={{ objectFit: 'contain', marginBottom: '0rem' }}
          priority
        />

        <h1 className="fade-in-up delay-2" id="hero-titulo" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
          color: 'var(--crema)',
          lineHeight: '1.05',
          marginBottom: '1rem',
          maxWidth: '900px',
          letterSpacing: '-0.02em',
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

      {/* SECCIÓN EDITORIAL */}
      <section aria-label="Editorial" style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Image
          src="/images/editorial-bg.jpg"
          alt="Bodega Cava del Plata"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.9))',
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '700px',
        }}>
          <p style={{
            color: 'var(--dorado)',
            fontSize: '0.75rem',
            letterSpacing: '0.4em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem',
          }}>
            Nuestra filosofía
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: 'var(--crema)',
            lineHeight: '1.2',
            marginBottom: '1.5rem',
          }}>
            Cada botella es el resultado de años de dedicación
          </h2>
          <Link href="/nosotros" style={{
            color: 'var(--dorado)',
            fontSize: '0.8rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderBottom: '1px solid var(--dorado)',
            paddingBottom: '0.25rem',
          }}>
            Conocé nuestra historia
          </Link>
        </div>
      </section>
      
      {/* DEGRADADO DE TRANSICIÓN */}
      <div style={{
        height: '120px',
        background: 'linear-gradient(to bottom, #1a1a1a, var(--negro))',
        marginTop: '-1px',
      }} />
      
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          margin: '0.75rem auto 0.5rem',
          maxWidth: '300px',
        }}>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--dorado)', opacity: 0.5 }} />
          <span style={{ color: 'var(--dorado)', fontSize: '0.8rem' }}>✦</span>
          <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--dorado)', opacity: 0.5 }} />
        </div>
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
              <div style={{
                width: '100%',
                height: '250px',
                position: 'relative',
                backgroundColor: '#111111',
                borderBottom: '1px solid var(--dorado)',
                marginBottom: '0.5rem',
              }}>
                <Image
                  src={vino.imagen}
                  alt={vino.nombre}
                  fill
                  style={{ objectFit: 'contain', padding: '0.5rem' }}
                />
              </div>

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