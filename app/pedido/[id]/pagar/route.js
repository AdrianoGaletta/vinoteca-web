import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || ''
  return url.startsWith('https://') && !url.includes('localhost')
    ? url
    : 'https://vinoteca-web.vercel.app'
}

// Crea la preferencia de Checkout Pro y redirige al checkout de Mercado Pago.
export async function GET(request, { params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('id, estado, pedido_items (producto_id, nombre_producto, cantidad, precio_unitario)')
    .eq('id', id)
    .eq('usuario_id', user.id)
    .single()

  if (!pedido) {
    return NextResponse.redirect(new URL('/mi-cuenta', request.url))
  }
  // Si ya está pagado, no volver a cobrar
  if (pedido.estado === 'pagado') {
    return NextResponse.redirect(new URL(`/pedido/${id}`, request.url))
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return NextResponse.redirect(new URL(`/pedido/${id}?pago=error`, request.url))
  }

  const base = siteUrl()

  try {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
    const pref = await new Preference(client).create({
      body: {
        items: pedido.pedido_items.map(it => ({
          id: String(it.producto_id),
          title: it.nombre_producto,
          quantity: it.cantidad,
          unit_price: Number(it.precio_unitario),
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${base}/pedido/${id}`,
          failure: `${base}/pedido/${id}`,
          pending: `${base}/pedido/${id}`,
        },
        auto_return: 'approved',
        external_reference: String(id),
        notification_url: `${base}/api/webhook/mercadopago`,
        statement_descriptor: 'Cava del Plata',
      },
    })

    const url = pref.sandbox_init_point || pref.init_point
    if (!url) {
      return NextResponse.redirect(new URL(`/pedido/${id}?pago=error`, request.url))
    }
    return NextResponse.redirect(url)
  } catch (e) {
    console.error('MP preference error:', e.message)
    return NextResponse.redirect(new URL(`/pedido/${id}?pago=error`, request.url))
  }
}
