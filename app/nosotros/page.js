import Image from 'next/image'

export default function Nosotros() {
  return (
    <>
      {/* PÁGINA COMPLETA CON IMAGEN DE FONDO */}
      <div style={{
        position: 'relative',
        minHeight: '100vh',
      }}>
        <Image
          src="/images/nosotros-bg.jpg"
          alt="Nuestra bodega"
          fill
          style={{ objectFit: 'cover', objectPosition: 'center' }}
          priority
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.85))',
        }} />

        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          padding: '5rem 2rem',
        }}>

          {/* ENCABEZADO */}
          <header style={{ marginBottom: '4rem', textAlign: 'center' }}>
            <p style={{
              color: 'var(--dorado)',
              fontSize: '0.75rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
            }}>
              Nuestra historia
            </p>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              color: 'var(--crema)',
              lineHeight: '1.2',
            }}>
              Somos una vinoteca boutique con alma argentina
            </h1>
          </header>

          {/* TEXTO PRINCIPAL */}
          <section aria-labelledby="historia" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}>
            <div>
              <h2 id="historia" style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--dorado)',
                fontSize: '1.3rem',
                marginBottom: '1rem',
              }}>
                Nuestros orígenes
              </h2>
              <p style={{
                color: 'var(--crema)',
                opacity: 0.8,
                lineHeight: '1.9',
                fontSize: '0.95rem',
              }}>
                Nacimos en 2018 con una obsesión simple: llevar vinos de autor a quienes 
                los aprecian de verdad. No queremos ser la vinoteca más grande, 
                sino la más cuidada.
              </p>
            </div>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--dorado)',
                fontSize: '1.3rem',
                marginBottom: '1rem',
              }}>
                Nuestra selección
              </h2>
              <p style={{
                color: 'var(--crema)',
                opacity: 0.8,
                lineHeight: '1.9',
                fontSize: '0.95rem',
              }}>
                Cada vino pasa por un proceso de curaduría con sommeliers certificados. 
                Visitamos bodegas, conocemos a los productores y elegimos solo 
                lo que genuinamente nos emociona.
              </p>
            </div>
          </section>

          {/* VALORES */}
          <section aria-labelledby="valores-titulo" style={{ marginBottom: '4rem' }}>
            <h2 id="valores-titulo" style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--crema)',
              fontSize: '1.8rem',
              marginBottom: '2rem',
              textAlign: 'center',
            }}>
              Lo que nos define
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {[
                { titulo: 'Autenticidad', texto: 'Solo trabajamos con bodegas que priorizan el terroir sobre la producción masiva.' },
                { titulo: 'Conocimiento', texto: 'Nuestro equipo está formado por sommeliers y apasionados del vino.' },
                { titulo: 'Experiencia', texto: 'Queremos que cada compra sea el inicio de una historia, no solo una transacción.' },
              ].map(item => (
                <article key={item.titulo} style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  border: '1px solid var(--dorado)',
                  padding: '2rem',
                  backdropFilter: 'blur(8px)',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--dorado)',
                    fontSize: '1.1rem',
                    marginBottom: '0.75rem',
                  }}>
                    {item.titulo}
                  </h3>
                  <p style={{
                    color: 'var(--crema)',
                    opacity: 0.8,
                    fontSize: '0.85rem',
                    lineHeight: '1.7',
                  }}>
                    {item.texto}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* NÚMEROS */}
          <section style={{
            borderTop: '1px solid var(--dorado)',
            borderBottom: '1px solid var(--dorado)',
            padding: '3rem 0',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '2rem',
            textAlign: 'center',
          }}>
            {[
              { numero: '+200', label: 'Vinos en catálogo' },
              { numero: '+50', label: 'Bodegas aliadas' },
              { numero: '6', label: 'Años de experiencia' },
              { numero: '+5000', label: 'Clientes felices' },
            ].map(item => (
              <div key={item.label}>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  color: 'var(--dorado)',
                  marginBottom: '0.25rem',
                }}>
                  {item.numero}
                </p>
                <p style={{
                  color: 'var(--crema)',
                  opacity: 0.7,
                  fontSize: '0.8rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {item.label}
                </p>
              </div>
            ))}
          </section>

        </div>
      </div>
    </>
  )
}