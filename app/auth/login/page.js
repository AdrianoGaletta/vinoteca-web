'use client'

import { useActionState, Suspense } from 'react'
import { login } from '@/app/actions/auth'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined)
  const searchParams = useSearchParams()
  const reset = searchParams.get('reset')

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
          <div style={{ background: '#1a2e1a', border: '1px solid #2d5a2d', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem', color: '#4caf50', fontSize: '0.9rem', textAlign: 'center' }}>
            Contraseña actualizada correctamente. Ya podés iniciar sesión.
          </div>
        )}

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label htmlFor="email" style={{ display: 'block', color: 'var(--crema)', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#1a1a1a',
                border: '1px solid var(--gris-claro)',
                borderRadius: '6px',
                color: 'var(--crema)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
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
              required
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: '#1a1a1a',
                border: '1px solid var(--gris-claro)',
                borderRadius: '6px',
                color: 'var(--crema)',
                fontSize: '1rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ textAlign: 'right', marginTop: '0.4rem' }}>
              <Link href="/auth/recuperar" style={{ color: '#888', fontSize: '0.82rem', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>

          {state?.error && (
            <p style={{ color: '#f44336', fontSize: '0.88rem', margin: 0, padding: '0.75rem 1rem', background: '#2a1a1a', borderRadius: '6px', border: '1px solid #5a2a2a' }}>
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
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
