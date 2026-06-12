'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function Home() {
  const [destacados, setDestacados] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .eq('destacado', true)
      .limit(3)
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setDestacados(data ?? [])
        setCargando(false)
      })
  }, [])

  return (
    <>
      {/* ═══════════════ HERO ═══════════════ */}
      <section aria-labelledby="hero-titulo" style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fondo */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <Image
            src="/images/hero-bg.jpg"
            alt=""
            fill
            priority
            style={{ objectFit: 'cover', objectPosition: 'center 30%' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(8,8,8,0.92) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,0.88) 100%)',
          }} />
        </div>

        {/* Contenido central */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: 'clamp(2rem, 6vw, 6rem)',
          maxWidth: '100%',
          width: '100%',
        }}>
          {/* Eyebrow */}
          <p className="fade-in delay-1" style={{
            color: 'var(--dorado)',
            fontSize: '0.7rem',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}>
            <span style={{ display: 'inline-block', width: '32px', height: '1px', background: 'var(--dorado)' }} />
            Vinoteca Boutique · Mendoza
          </p>

          <div className="fade-in-up delay-2">
            <Image
              src="/images/logo-hero.png"
              alt="Cava del Plata"
              width={320}
              height={240}
              style={{ objectFit: 'contain', marginBottom: '1.5rem' }}
              priority
            />
          </div>

          <h1 className="fade-in-up delay-3" id="hero-titulo" style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            color: 'var(--crema)',
            lineHeight: '1.08',
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
          }}>
            Vinos que cuentan<br />
            <em style={{ fontStyle: 'italic', color: 'var(--dorado)' }}>una historia</em>
          </h1>

          <p className="fade-in-up delay-4" style={{
            fontFamily: 'var(--font-editorial)',
            color: 'var(--crema-apagada)',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            maxWidth: '520px',
            marginBottom: '2.5rem',
            fontWeight: 300,
          }}>
            Selección de vinos de autor curados por sommeliers.
            Cada botella es el resultado de años de dedicación y terroir único.
          </p>

          <div className="fade-in delay-5" style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              Ver Catálogo
            </Link>
            <Link href="/nosotros" style={{
              color: 'var(--crema-apagada)',
              fontSize: '0.75rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              borderBottom: '1px solid rgba(201,168,76,0.3)',
              paddingBottom: '2px',
              transition: 'color 0.3s, border-color 0.3s',
            }}>
              Nuestra historia →
            </Link>
          </div>
        </div>

        {/* Estadísticas en la parte inferior */}
        <div className="fade-in delay-6" style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          borderTop: '1px solid rgba(201,168,76,0.15)',
          width: '100%',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {[
            { num: '+200', label: 'Etiquetas' },
            { num: '15+', label: 'Bodegas' },
            { num: '100%', label: 'Origen Argentina' },
          ].map(({ num, label }, i) => (
            <div key={label} style={{
              padding: '1.5rem 2rem',
              borderRight: i < 2 ? '1px solid rgba(201,168,76,0.15)' : 'none',
            }}>
              <p style={{ fontFamily: 'var(--font-editorial)', fontSize: '1.6rem', color: 'var(--dorado)', fontWeight: 300 }}>{num}</p>
              <p style={{ color: 'var(--crema-apagada)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════ EDITORIAL ═══════════════ */}
      <section aria-label="Editorial" style={{
        position: 'relative',
        height: '480px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        <Image
          src="/images/editorial-bg.jpg"
          alt="Bodega Cava del Plata"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.7) 50%, rgba(8,8,8,0.4) 100%)',
        }} />
        {/* Número editorial de fondo */}
        <span style={{
          position: 'absolute',
          right: '5%',
          bottom: '-2rem',
          fontFamily: 'var(--font-editorial)',
          fontSize: 'clamp(8rem, 20vw, 18rem)',
          fontWeight: 300,
          fontStyle: 'italic',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(201,168,76,0.08)',
          lineHeight: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}>
          2025
        </span>
        <div style={{ position: 'relative', zIndex: 1, padding: 'clamp(2rem, 6vw, 6rem)', maxWidth: '600px' }}>
          <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            — Nuestra filosofía
          </p>
          <h2 style={{
            fontFamily: 'var(--font-editorial)',
            fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
            color: 'var(--crema)',
            lineHeight: '1.3',
            fontWeight: 300,
            marginBottom: '2rem',
          }}>
            Cada botella es el resultado<br />
            <em>de años de dedicación</em>
          </h2>
          <Link href="/nosotros" style={{
            color: 'var(--dorado)',
            fontSize: '0.72rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            borderBottom: '1px solid rgba(201,168,76,0.4)',
            paddingBottom: '3px',
            transition: 'all 0.3s',
          }}>
            Conocé nuestra historia
          </Link>
        </div>
      </section>

      {/* ═══════════════ DESTACADOS ═══════════════ */}
      <section aria-labelledby="destacados-titulo" style={{
        padding: 'clamp(4rem, 8vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
        maxWidth: '1300px',
        margin: '0 auto',
      }}>
        {/* Header de sección */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '4rem', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              — Selección sommelier
            </p>
            <h2 id="destacados-titulo" style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: 'var(--crema)',
              lineHeight: '1.1',
            }}>
              Destacados<br />de la semana
            </h2>
          </div>
          <Link href="/catalogo" className="btn-hover" style={{
            border: '1px solid rgba(201,168,76,0.3)',
            color: 'var(--crema-apagada)',
            padding: '0.7rem 1.5rem',
            fontSize: '0.72rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>
            Ver todos →
          </Link>
        </div>

        {/* Grid de vinos destacados */}
        {error && (
          <p style={{ color: 'var(--crema-apagada)', fontFamily: 'var(--font-editorial)', fontSize: '1rem', textAlign: 'center', padding: '3rem 0', opacity: 0.6 }}>
            No se pudieron cargar los vinos destacados.
          </p>
        )}

        {cargando && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.08)' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: 'var(--gris)', height: '460px', animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </div>
        )}

        {!cargando && !error && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5px',
          background: 'rgba(201,168,76,0.08)',
          border: '1px solid rgba(201,168,76,0.08)',
        }}>
          {destacados.map((vino, i) => (
            <article key={vino.id} className="card-hover" style={{
              background: 'var(--gris)',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'visible',
            }}>
              {/* Número editorial */}
              <span style={{
                position: 'absolute',
                top: '-1.5rem',
                left: '1.5rem',
                fontFamily: 'var(--font-editorial)',
                fontSize: '4.5rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'transparent',
                WebkitTextStroke: '1px rgba(201,168,76,0.2)',
                lineHeight: 1,
                zIndex: 0,
                userSelect: 'none',
              }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Imagen */}
              <div style={{
                height: '300px',
                position: 'relative',
                background: '#0c0c0c',
                overflow: 'hidden',
              }}>
                <Image
                  src={vino.imagen}
                  alt={vino.nombre}
                  fill
                  style={{ objectFit: 'contain', padding: '1.5rem', transition: 'transform 0.6s cubic-bezier(0.25,0.1,0.25,1)' }}
                />
              </div>

              {/* Contenido */}
              <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flexGrow: 1, position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span className="varietal-tag">{vino.varietal}</span>
                  {vino.anio && (
                    <span style={{ color: 'var(--crema-apagada)', fontSize: '0.7rem', letterSpacing: '0.1em' }}>{vino.anio}</span>
                  )}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.35rem',
                  color: 'var(--crema)',
                  lineHeight: '1.25',
                }}>
                  {vino.nombre}
                </h3>
                <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                  {vino.bodega}
                </p>
                <p style={{
                  color: 'var(--crema)',
                  opacity: 0.55,
                  fontSize: '0.82rem',
                  lineHeight: '1.7',
                  flexGrow: 1,
                  fontFamily: 'var(--font-editorial)',
                  fontWeight: 300,
                }}>
                  {vino.descripcion?.slice(0, 100)}...
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--gris-claro)' }}>
                  <p style={{
                    fontFamily: 'var(--font-editorial)',
                    fontSize: '1.6rem',
                    color: 'var(--dorado)',
                    fontWeight: 300,
                  }}>
                    ${vino.precio.toLocaleString('es-AR')}
                  </p>
                  <Link href={`/vino/${vino.slug}`} className="btn-hover" style={{
                    border: '1px solid var(--dorado)',
                    color: 'var(--dorado)',
                    padding: '0.55rem 1.2rem',
                    fontSize: '0.68rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                  }}>
                    Ver más
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        )}
      </section>

      {/* ═══════════════ PROPUESTA DE VALOR ═══════════════ */}
      <section aria-label="Propuesta de valor" style={{
        borderTop: '1px solid rgba(201,168,76,0.12)',
        borderBottom: '1px solid rgba(201,168,76,0.12)',
        background: 'linear-gradient(180deg, var(--gris) 0%, var(--negro) 100%)',
        padding: 'clamp(3rem, 6vw, 5rem) clamp(1.5rem, 5vw, 4rem)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '0',
      }}>
        {[
          { icon: '◈', titulo: 'Envío gratis', desc: 'En compras mayores a $15.000' },
          { icon: '◇', titulo: 'Selección sommelier', desc: 'Cada vino elegido por expertos' },
          { icon: '◆', titulo: 'Pago seguro', desc: 'Medios de pago protegidos' },
        ].map((item, i) => (
          <div key={item.titulo} style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            textAlign: 'center',
            borderRight: i < 2 ? '1px solid rgba(201,168,76,0.1)' : 'none',
          }}>
            <div style={{ color: 'var(--dorado)', fontSize: '1.2rem', marginBottom: '1rem', opacity: 0.7 }}>{item.icon}</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--crema)',
              fontSize: '1rem',
              marginBottom: '0.5rem',
              fontWeight: 400,
            }}>
              {item.titulo}
            </h3>
            <p style={{ color: 'var(--crema-apagada)', fontSize: '0.8rem', lineHeight: '1.6' }}>
              {item.desc}
            </p>
          </div>
        ))}
      </section>
    </>
  )
}
