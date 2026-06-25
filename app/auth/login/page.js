'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function validarEmail(email) {
  if (!email?.trim()) return 'El email es requerido'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Ingresá un email válido'
  return ''
}

function validarPassword(password) {
  if (!password) return 'La contraseña es requerida'
  if (password.length < 6) return 'Mínimo 6 caracteres'
  return ''
}

const inputBase = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#1a1a1a',
  border: '1px solid var(--gris-claro)',
  borderRadius: '6px',
  color: 'var(--crema)',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

function LoginForm() {
  const searchParams = useSearchParams()
  const reset = searchParams.get('reset')
  const redirectTo = searchParams.get('redirect') || '/mi-cuenta'
  const router = useRouter()

  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState('')
  const [pending, setPending] = useState(false)

  function validarCampo(campo, valor) {
    const fn = campo === 'email' ? validarEmail : validarPassword
    setErrores(prev => ({ ...prev, [campo]: fn(valor) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorGeneral('')

    const fd = new FormData(e.currentTarget)
    const email = fd.get('email')
    const password = fd.get('password')

    const nuevoErrores = {
      email:    validarEmail(email),
      password: validarPassword(password),
    }
    setErrores(nuevoErrores)
    if (Object.values(nuevoErrores).some(Boolean)) return

    setPending(true)

    // Login del lado del cliente: el cliente de Supabase setea la sesión
    // y dispara onAuthStateChange de inmediato → la sesión se reconoce al
    // instante en toda la app (navbar, carrito, checkout).
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setPending(false)
      if (error.message.includes('Email not confirmed')) {
        setErrorGeneral('Tenés que confirmar tu email antes de ingresar. Revisá tu bandeja de entrada.')
      } else {
        setErrorGeneral('Email o contraseña incorrectos.')
      }
      return
    }

    // Refresca los Server Components (que ahora leen la cookie de sesión)
    // y navega al destino.
    router.refresh()
    router.push(redirectTo)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--negro)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: 'var(--crema)', marginBottom: '0.5rem' }}>
            Iniciar Sesión
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            ¿No tenés cuenta?{' '}
            <Link href="/auth/registro" style={{ color: 'var(--dorado)', textDecoration: 'none' }}>
              Registrate
            </Link>
          </p>
        </div>

        {reset === 'ok' && (
          <div role="alert" style={{ background: '#1a2e1a', border: '1px solid #2d5a2d', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#4caf50', fontSize: '0.9rem', textAlign: 'center' }}>
            Contraseña actualizada correctamente. Ya podés iniciar sesión.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

          <div>
            <label htmlFor="email" style={{ display: 'block', color: 'var(--crema)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              aria-describedby={errores.email ? 'email-error' : undefined}
              aria-invalid={!!errores.email}
              onBlur={e => validarCampo('email', e.target.value)}
              onChange={e => errores.email && validarCampo('email', e.target.value)}
              style={{ ...inputBase, borderColor: errores.email ? '#f44336' : 'var(--gris-claro)' }}
            />
            {errores.email && (
              <p id="email-error" role="alert" style={{ color: '#f44336', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                {errores.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" style={{ display: 'block', color: 'var(--crema)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-describedby={errores.password ? 'password-error' : undefined}
              aria-invalid={!!errores.password}
              onBlur={e => validarCampo('password', e.target.value)}
              onChange={e => errores.password && validarCampo('password', e.target.value)}
              style={{ ...inputBase, borderColor: errores.password ? '#f44336' : 'var(--gris-claro)' }}
            />
            {errores.password && (
              <p id="password-error" role="alert" style={{ color: '#f44336', fontSize: '0.78rem', marginTop: '0.3rem' }}>
                {errores.password}
              </p>
            )}
            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
              <Link href="/auth/recuperar" style={{ color: '#888', fontSize: '0.82rem', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
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
            {pending ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
