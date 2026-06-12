'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function PagarMercadoPago({ pedidoId }) {
  const [mpUrl, setMpUrl] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/mp-preference?pedido_id=${pedidoId}`)
      .then(r => r.json())
      .then(data => { if (data.mpUrl) setMpUrl(data.mpUrl) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [pedidoId])

  return (
    <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
      {loading ? (
        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', opacity: 0.5, marginBottom: '1rem' }}>
          Cargando opciones de pago...
        </p>
      ) : mpUrl ? (
        <div style={{ marginBottom: '1.25rem' }}>
          <a href={mpUrl} style={{
            display: 'inline-block',
            background: '#009ee3', color: '#fff',
            padding: '0.85rem 2.5rem', fontSize: '0.75rem',
            letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700,
            borderRadius: '2px',
          }}>
            Pagar con Mercado Pago
          </a>
        </div>
      ) : null}

      <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', marginBottom: '0.6rem', opacity: 0.4 }}>
        — entorno de pruebas —
      </p>
      <Link href={`/pedido/${pedidoId}?pago=aprobado`} style={{
        display: 'inline-block',
        border: '1px dashed rgba(201,168,76,0.25)',
        color: 'var(--crema-apagada)',
        padding: '0.55rem 1.4rem',
        fontSize: '0.68rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: 0.5,
      }}>
        Simular pago aprobado
      </Link>
    </div>
  )
}
