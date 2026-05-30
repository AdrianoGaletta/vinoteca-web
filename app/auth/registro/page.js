'use client'

import { useActionState } from 'react'
import { registro } from '@/app/actions/auth'
import Link from 'next/link'

export default function RegistroPage() {
  const [state, action, pending] = useActionState(registro, undefined)

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

        {state?.success ? (
          <div style={{ background: '#1a2e1a', border: '1px solid #2d5a2d', borderRadius: '8px', padding: '1.5rem', color: '#4caf50', textAlign: 'center' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>¡Cuenta creada!</p>
            <p style={{ fontSize: '0.9rem' }}>{state.success}</p>
          </div>
        ) : (
          <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label htmlFor="nombre" style={labelStyle}>Nombre *</label>
                <input id="nombre" name="nombre" type="text" required autoComplete="given-name" style={inputStyle} />
              </div>
              <div>
                <label htmlFor="apellido" style={labelStyle}>Apellido</label>
                <input id="apellido" name="apellido" type="text" autoComplete="family-name" style={inputStyle} />
              </div>
            </div>

            <div>
              <label htmlFor="email" style={labelStyle}>Email *</label>
              <input id="email" name="email" type="email" required autoComplete="email" style={inputStyle} />
            </div>

            <div>
              <label htmlFor="password" style={labelStyle}>Contraseña * (mínimo 6 caracteres)</label>
              <input id="password" name="password" type="password" required autoComplete="new-password" style={inputStyle} />
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

const labelStyle = {
  display: 'block',
  color: 'var(--crema)',
  fontSize: '0.85rem',
  marginBottom: '0.5rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const inputStyle = {
  width: '100%',
  padding: '0.75rem 1rem',
  background: '#1a1a1a',
  border: '1px solid var(--gris-claro)',
  borderRadius: '6px',
  color: 'var(--crema)',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
}
