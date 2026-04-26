export default function Footer() {
  return (
    <footer role="contentinfo" style={{
      backgroundColor: 'var(--gris)',
      borderTop: '1px solid var(--dorado)',
      padding: '3rem 2rem',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
    }}>

      <div>
        <h3 style={{
          fontFamily: 'var(--font-display)',
          color: 'var(--dorado)',
          fontSize: '1.2rem',
          marginBottom: '1rem',
          letterSpacing: '0.1em',
        }}>
          VINOTECA
        </h3>
        <p style={{
          color: 'var(--crema)',
          fontSize: '0.85rem',
          lineHeight: '1.7',
          opacity: 0.7,
        }}>
          Selección premium de vinos argentinos de autor. Cada botella cuenta una historia.
        </p>
      </div>

      <div>
        <h4 style={{
          color: 'var(--crema)',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Navegación
        </h4>
        <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {['Inicio', 'Catálogo', 'Nosotros', 'Contacto'].map(item => (
            <li key={item}>
              <a href={item === 'Inicio' ? '/' : `/${item.toLowerCase()}`} style={{
                color: 'var(--crema)',
                fontSize: '0.85rem',
                opacity: 0.7,
              }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 style={{
          color: 'var(--crema)',
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          marginBottom: '1rem',
          textTransform: 'uppercase',
        }}>
          Contacto
        </h4>
        <address style={{
          fontStyle: 'normal',
          color: 'var(--crema)',
          fontSize: '0.85rem',
          lineHeight: '1.9',
          opacity: 0.7,
        }}>
          <p>Av. del Vino 1420, Palermo</p>
          <p>Buenos Aires, Argentina</p>
          <p>hola@vinoteca.com.ar</p>
          <p>+54 11 4567-8900</p>
        </address>
      </div>

      <div style={{
        gridColumn: '1 / -1',
        borderTop: '1px solid var(--gris-claro)',
        paddingTop: '1.5rem',
        textAlign: 'center',
        color: 'var(--crema)',
        fontSize: '0.75rem',
        opacity: 0.5,
      }}>
        © {new Date().getFullYear()} Vinoteca Boutique. Todos los derechos reservados.
      </div>

    </footer>
  )
}