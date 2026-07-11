'use client'

import { useState } from 'react'
import { validarNombrePersona, validarEmail } from '@/lib/validacion'

export default function Contacto() {
  const [form, setForm] = useState({ nombre: '', email: '', mensaje: '' })
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)
  const [pending, setPending] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  function validar() {
    const nuevosErrores = {}

    const errNombre = validarNombrePersona(form.nombre, { etiqueta: 'El nombre' })
    if (errNombre) nuevosErrores.nombre = errNombre

    const errEmail = validarEmail(form.email)
    if (errEmail) nuevosErrores.email = errEmail

    if (!form.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es obligatorio'
    } else if (form.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres'
    }

    return nuevosErrores
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrores(prev => ({ ...prev, [name]: '' }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')
    const erroresEncontrados = validar()

    if (Object.keys(erroresEncontrados).length > 0) {
      setErrores(erroresEncontrados)
      return
    }

    // El mensaje se envía a la API interna, que vuelve a validar el
    // contenido en el servidor antes de aceptarlo.
    setPending(true)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorGeneral(body.error ?? 'No pudimos enviar el mensaje. Intentá de nuevo.')
        return
      }
      setEnviado(true)
      setForm({ nombre: '', email: '', mensaje: '' })
    } catch {
      setErrorGeneral('No pudimos enviar el mensaje. Revisá tu conexión e intentá de nuevo.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main style={{ maxWidth: '700px', margin: '0 auto', padding: '4rem 2rem' }}>

      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <p style={{
          color: 'var(--dorado)',
          fontSize: '0.75rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          Escribinos
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '2.5rem',
          color: 'var(--crema)',
        }}>
          Contacto
        </h1>
      </header>

      {enviado ? (
        <div role="alert" style={{
          backgroundColor: 'var(--gris)',
          border: '1px solid var(--dorado)',
          padding: '2rem',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            color: 'var(--dorado)',
            fontSize: '1.3rem',
            marginBottom: '0.5rem',
          }}>
            ¡Mensaje enviado!
          </p>
          <p style={{ color: 'var(--crema)', opacity: 0.7, fontSize: '0.9rem' }}>
            Te respondemos en menos de 24 horas.
          </p>
          <button
            onClick={() => setEnviado(false)}
            style={{
              marginTop: '1.5rem',
              border: '1px solid var(--dorado)',
              backgroundColor: 'transparent',
              color: 'var(--dorado)',
              padding: '0.6rem 1.5rem',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
            }}
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de contacto"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div>
            <label htmlFor="nombre" style={{
              display: 'block',
              color: 'var(--crema)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? 'error-nombre' : undefined}
              placeholder="Tu nombre"
              style={{
                width: '100%',
                backgroundColor: 'var(--gris)',
                border: `1px solid ${errores.nombre ? '#e74c3c' : 'var(--gris-claro)'}`,
                color: 'var(--crema)',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            {errores.nombre && (
              <p id="error-nombre" role="alert" style={{
                color: '#e74c3c',
                fontSize: '0.78rem',
                marginTop: '0.4rem',
              }}>
                {errores.nombre}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" style={{
              display: 'block',
              color: 'var(--crema)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              aria-invalid={!!errores.email}
              aria-describedby={errores.email ? 'error-email' : undefined}
              placeholder="tu@email.com"
              style={{
                width: '100%',
                backgroundColor: 'var(--gris)',
                border: `1px solid ${errores.email ? '#e74c3c' : 'var(--gris-claro)'}`,
                color: 'var(--crema)',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
              }}
            />
            {errores.email && (
              <p id="error-email" role="alert" style={{
                color: '#e74c3c',
                fontSize: '0.78rem',
                marginTop: '0.4rem',
              }}>
                {errores.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="mensaje" style={{
              display: 'block',
              color: 'var(--crema)',
              fontSize: '0.8rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '0.5rem',
            }}>
              Mensaje
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={form.mensaje}
              onChange={handleChange}
              aria-invalid={!!errores.mensaje}
              aria-describedby={errores.mensaje ? 'error-mensaje' : undefined}
              placeholder="¿En qué podemos ayudarte?"
              rows={5}
              style={{
                width: '100%',
                backgroundColor: 'var(--gris)',
                border: `1px solid ${errores.mensaje ? '#e74c3c' : 'var(--gris-claro)'}`,
                color: 'var(--crema)',
                padding: '0.85rem 1rem',
                fontSize: '0.95rem',
                fontFamily: 'var(--font-body)',
                outline: 'none',
                resize: 'vertical',
              }}
            />
            {errores.mensaje && (
              <p id="error-mensaje" role="alert" style={{
                color: '#e74c3c',
                fontSize: '0.78rem',
                marginTop: '0.4rem',
              }}>
                {errores.mensaje}
              </p>
            )}
          </div>

          {errorGeneral && (
            <p role="alert" style={{
              color: '#e74c3c',
              fontSize: '0.85rem',
              margin: 0,
              padding: '0.75rem 1rem',
              background: '#1a0a0a',
              border: '1px solid rgba(231,76,60,0.3)',
            }}>
              {errorGeneral}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            style={{
              backgroundColor: pending ? '#555' : 'var(--dorado)',
              color: 'var(--negro)',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '0.85rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: '600',
              cursor: pending ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            {pending ? 'Enviando...' : 'Enviar mensaje'}
          </button>
        </form>
      )}

    </main>
  )
}