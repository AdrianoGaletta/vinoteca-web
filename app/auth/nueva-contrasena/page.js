'use client'

import { useActionState } from 'react'
import { nuevaContrasena } from '@/app/actions/auth'

export default function NuevaContrasenaPage() {
  const [state, action, pending] = useActionState(nuevaContrasena, undefined)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--negro)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '2rem', color: 'var(--crema)', marginBottom: '0.5rem' }}>
            Nueva Contraseña
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Ingresá tu nueva contraseña.
          </p>
        </div>

        <form action={action} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label htmlFor="password" style={labelStyle}>Nueva contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              style={inputStyle}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" style={labelStyle}>Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              style={inputStyle}
            />
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
            }}
          >
            {pending ? 'Actualizando...' : 'Actualizar Contraseña'}
          </button>
        </form>
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
