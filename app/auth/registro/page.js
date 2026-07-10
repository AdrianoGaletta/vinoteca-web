'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { validarNombrePersona, validarEmail, validarPassword } from '@/lib/validacion'

// ── Validadores ──────────────────────────────────────────
function v(campo, valor) {
  switch (campo) {
    case 'nombre':
      return validarNombrePersona(valor, { etiqueta: 'El nombre' })
    case 'apellido':
      // Opcional, pero si se completa tiene que ser un apellido real
      return validarNombrePersona(valor, { etiqueta: 'El apellido', requerido: false })
    case 'email':
      return validarEmail(valor)
    case 'password':
      return validarPassword(valor)
    default:
      return ''
  }
}

const labelStyle = {
  display: 'block',
  color: 'var(--crema)',
  fontSize: '0.85rem',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

function inputStyle(error) {
  return {
    width: '100%',
    padding: '0.75rem 1rem',
    background: '#1a1a1a',
    border: `1px solid ${error ? '#f44336' : 'var(--gris-claro)'}`,
    borderRadius: '6px',
    color: 'var(--crema)',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }
}

function FieldError({ id, msg }) {
  if (!msg) return null
  return <p id={id} role="alert" style={{ color: '#f44336', fontSize: '0.78rem', marginTop: '0.3rem' }}>{msg}</p>
}

export default function RegistroPage() {
  const router = useRouter()
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [success, setSuccess] = useState('')
  const [pending, setPending] = useState(false)

  function validarCampo(campo, valor) {
    setErrores(prev => ({ ...prev, [campo]: v(campo, valor) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const fd = new FormData(e.currentTarget)
    const nombre = fd.get('nombre')
    const apellido = fd.get('apellido')
    const email = fd.get('email')
    const password = fd.get('password')

    const nuevoErrores = Object.fromEntries(['nombre', 'apellido', 'email', 'password'].map(c => [c, v(c, fd.get(c))]))
    setErrores(nuevoErrores)
    if (Object.values(nuevoErrores).some(Boolean)) return

    setPending(true)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre, apellido } },
    })

    if (error) {
      setPending(false)
      if (error.message.includes('already registered')) {
        setErrorGeneral('Este email ya está registrado.')
      } else {
        setErrorGeneral('Error al crear la cuenta. Intentá de nuevo.')
      }
      return
    }

    // Si requiere confirmación por email, no hay sesión todavía
    if (data.user && !data.session) {
      setPending(false)
      setSuccess('Te enviamos un email de confirmación. Revisá tu bandeja de entrada.')
      return
    }

    // Sesión activa: guardar perfil y entrar
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, nombre, apellido: apellido || null })
    }

    router.refresh()
    router.push('/mi-cuenta')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--negro)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: 'var(--crema)', marginBottom: '0.5rem' }}>
            Crear Cuenta
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            ¿Ya tenés cuenta?{' '}
            <Link href="/auth/login" style={{ color: 'var(--dorado)', textDecoration: 'none' }}>
              Iniciá sesión
            </Link>
          </p>
        </div>

        {success ? (
          <div role="alert" style={{ background: '#1a2e1a', border: '1px solid #2d5a2d', borderRadius: '8px', padding: '1.5rem', color: '#4caf50', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Cuenta creada!</p>
            <p style={{ fontSize: '0.9rem' }}>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="nombre" style={labelStyle}>Nombre *</label>
                <input
                  id="nombre" name="nombre" type="text" autoComplete="given-name"
                  aria-describedby={errores.nombre ? 'nombre-error' : undefined}
                  aria-invalid={!!errores.nombre}
                  onBlur={e => validarCampo('nombre', e.target.value)}
                  onChange={e => errores.nombre && validarCampo('nombre', e.target.value)}
                  style={inputStyle(errores.nombre)}
                />
                <FieldError id="nombre-error" msg={errores.nombre} />
              </div>
              <div>
                <label htmlFor="apellido" style={labelStyle}>Apellido</label>
                <input
                  id="apellido" name="apellido" type="text" autoComplete="family-name"
                  aria-describedby={errores.apellido ? 'apellido-error' : undefined}
                  aria-invalid={!!errores.apellido}
                  onBlur={e => validarCampo('apellido', e.target.value)}
                  onChange={e => errores.apellido && validarCampo('apellido', e.target.value)}
                  style={inputStyle(errores.apellido)}
                />
                <FieldError id="apellido-error" msg={errores.apellido} />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email *</label>
              <input
                id="email" name="email" type="email" autoComplete="email"
                aria-describedby={errores.email ? 'email-error' : undefined}
                aria-invalid={!!errores.email}
                onBlur={e => validarCampo('email', e.target.value)}
                onChange={e => errores.email && validarCampo('email', e.target.value)}
                style={inputStyle(errores.email)}
              />
              <FieldError id="email-error" msg={errores.email} />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>
                Contraseña * <span style={{ color: '#888', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(mín. 6 caracteres, letras y números)</span>
              </label>
              <input
                id="password" name="password" type="password" autoComplete="new-password"
                aria-describedby={errores.password ? 'password-error' : 'password-hint'}
                aria-invalid={!!errores.password}
                onBlur={e => validarCampo('password', e.target.value)}
                onChange={e => errores.password && validarCampo('password', e.target.value)}
                style={inputStyle(errores.password)}
              />
              <FieldError id="password-error" msg={errores.password} />
            </div>

            {errorGeneral && (
              <p role="alert" style={{ color: '#f44336', fontSize: '0.88rem', margin: 0, padding: '0.75rem 1rem', background: '#2a1a1a', borderRadius: '6px', border: '1px solid #5a2a2a' }}>
                {errorGeneral}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              aria-busy={pending}
              style={{
                width: '100%',
                padding: '0.85rem',
                background: pending ? '#666' : 'var(--dorado)',
                color: '#0a0a0a',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: pending ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                marginTop: '0.5rem',
              }}
            >
              {pending ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>

            <p style={{ color: '#666', fontSize: '0.8rem', textAlign: 'center', margin: 0 }}>
              Al registrarte aceptás nuestros términos y condiciones.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
