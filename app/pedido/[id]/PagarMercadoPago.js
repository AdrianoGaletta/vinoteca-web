'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PagarMercadoPago({ pedidoId, total }) {
  const [fase, setFase] = useState('cargando') // cargando | listo | procesando | rechazado | error | sin-clave
  const controllerRef = useRef(null)
  const router = useRouter()
  const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY

  useEffect(() => {
    if (!publicKey) {
      setFase('sin-clave')
      return
    }

    let script
    let mounted = true

    async function cargarSDK() {
      // Si ya está cargado, inicializar directo
      if (window.MercadoPago) {
        if (mounted) await initBrick()
        return
      }
      script = document.createElement('script')
      script.src = 'https://sdk.mercadopago.com/js/v2'
      script.async = true
      script.onload = async () => { if (mounted) await initBrick() }
      script.onerror = () => { if (mounted) setFase('error') }
      document.head.appendChild(script)
    }

    async function initBrick() {
      try {
        const mp = new window.MercadoPago(publicKey, { locale: 'es-AR' })
        const bricks = mp.bricks()
        controllerRef.current = await bricks.create('cardPayment', 'mp-brick-container', {
          initialization: { amount: Number(total) },
          customization: {
            visual: {
              style: { theme: 'dark' },
              hideFormTitle: true,
              hideRedirectionPanel: true,
            },
            paymentMethods: { minInstallments: 1, maxInstallments: 1 },
          },
          callbacks: {
            onReady: () => { if (mounted) setFase('listo') },
            onError: (err) => {
              console.error('Brick error:', err)
              if (mounted) setFase('error')
            },
            onSubmit: async (data) => {
              setFase('procesando')
              try {
                const res = await fetch('/api/mp-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...data, pedido_id: pedidoId }),
                })
                const result = await res.json()

                if (result.status === 'approved') {
                  router.push(`/pedido/${pedidoId}?pago=aprobado`)
                } else if (result.status === 'pending') {
                  router.push(`/pedido/${pedidoId}?pago=pendiente`)
                } else {
                  setFase('rechazado')
                }
              } catch {
                setFase('error')
              }
            },
          },
        })
      } catch (err) {
        console.error('initBrick error:', err)
        if (mounted) setFase('error')
      }
    }

    cargarSDK()

    return () => {
      mounted = false
      controllerRef.current?.unmount?.()
    }
  }, [publicKey, pedidoId, total, router])

  return (
    <div style={{ marginTop: '2.5rem' }}>
      <p style={{ color: 'var(--dorado)', fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '1.5rem', textAlign: 'center' }}>
        — Pagar con tarjeta de crédito o débito —
      </p>

      {/* Aviso de entorno de prueba con la tarjeta de test */}
      {fase !== 'sin-clave' && (
        <div style={{ background: 'rgba(0,158,227,0.07)', border: '1px solid rgba(0,158,227,0.25)', borderRadius: '2px', padding: '0.9rem 1.1rem', marginBottom: '1.25rem' }}>
          <p style={{ color: '#4aa8d8', fontSize: '0.72rem', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
            Entorno de prueba — usá esta tarjeta de test
          </p>
          <div style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', lineHeight: 1.7, fontFamily: 'monospace' }}>
            <div>N°: <span style={{ color: 'var(--crema)' }}>5031 7557 3453 0604</span></div>
            <div>Venc: <span style={{ color: 'var(--crema)' }}>11/30</span> · CVV: <span style={{ color: 'var(--crema)' }}>123</span></div>
            <div>Titular: <span style={{ color: 'var(--crema)' }}>APRO</span> · DNI: <span style={{ color: 'var(--crema)' }}>12345678</span></div>
          </div>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', marginTop: '0.5rem', opacity: 0.7 }}>
            No uses una tarjeta real: el sitio está en modo de prueba de Mercado Pago.
          </p>
        </div>
      )}

      {fase === 'cargando' && (
        <p style={{ color: 'var(--crema-apagada)', fontSize: '0.78rem', opacity: 0.5, textAlign: 'center', marginBottom: '1rem' }}>
          Cargando formulario de pago...
        </p>
      )}

      {fase === 'procesando' && (
        <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '2px', marginBottom: '1rem' }}>
          <p style={{ color: 'var(--dorado)', fontSize: '0.88rem' }}>Procesando pago...</p>
        </div>
      )}

      {fase === 'rechazado' && (
        <div role="alert" style={{ background: '#1a0a0a', border: '1px solid rgba(244,67,54,0.3)', padding: '1rem 1.25rem', marginBottom: '1rem', borderRadius: '2px' }}>
          <p style={{ color: '#f44336', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Pago rechazado</p>
          <p style={{ color: '#f44336', fontSize: '0.78rem', opacity: 0.8 }}>
            Verificá los datos de la tarjeta. En pruebas: usá nombre <strong>APRO</strong> para aprobar.
          </p>
        </div>
      )}

      {fase === 'error' && (
        <div role="alert" style={{ background: '#1a0a0a', border: '1px solid rgba(244,67,54,0.3)', padding: '1rem 1.25rem', marginBottom: '1rem', borderRadius: '2px' }}>
          <p style={{ color: '#f44336', fontSize: '0.85rem' }}>Error al procesar el pago. Intentá de nuevo.</p>
        </div>
      )}

      {/* El Brick se monta acá — siempre presente en el DOM */}
      <div
        id="mp-brick-container"
        style={{ display: fase === 'procesando' ? 'none' : 'block' }}
      />

      {/* Fallback para pruebas sin clave pública */}
      {fase === 'sin-clave' && (
        <div style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '2px', padding: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.82rem', marginBottom: '1rem' }}>
            Formulario de pago con tarjeta disponible en producción.
          </p>
          <Link
            href={`/pedido/${pedidoId}?pago=aprobado`}
            style={{
              display: 'inline-block',
              background: '#009ee3', color: '#fff',
              padding: '0.75rem 2rem', fontSize: '0.75rem',
              letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
              borderRadius: '2px',
            }}
          >
            Simular pago aprobado
          </Link>
        </div>
      )}

      {/* Simulación — solo como respaldo si el formulario de MP no carga */}
      {fase === 'error' && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <p style={{ color: 'var(--crema-apagada)', fontSize: '0.68rem', marginBottom: '0.5rem', opacity: 0.35 }}>
            — ¿problemas con el formulario? —
          </p>
          <Link href={`/pedido/${pedidoId}?pago=aprobado`} style={{
            display: 'inline-block',
            border: '1px dashed rgba(201,168,76,0.2)',
            color: 'var(--crema-apagada)',
            padding: '0.5rem 1.2rem',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            opacity: 0.45,
          }}>
            Simular pago aprobado
          </Link>
        </div>
      )}
    </div>
  )
}
