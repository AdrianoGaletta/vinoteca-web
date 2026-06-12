import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const pedidoId = searchParams.get('pedido_id')

  if (!pedidoId) {
    return NextResponse.json({ error: 'pedido_id requerido' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data: pedido } = await supabase
    .from('pedidos')
    .select(`*, pedido_items (producto_id, nombre_producto, cantidad, precio_unitario)`)
    .eq('id', pedidoId)
    .eq('usuario_id', user.id)
    .single()

  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP no configurado' }, { status: 503 })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
    const pref = await new Preference(mpClient).create({
      body: {
        items: pedido.pedido_items.map(item => ({
          id: String(item.producto_id),
          title: item.nombre_producto,
          quantity: item.cantidad,
          unit_price: item.precio_unitario,
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${baseUrl}/pedido/${pedidoId}?pago=aprobado`,
          failure: `${baseUrl}/pedido/${pedidoId}?pago=fallido`,
          pending: `${baseUrl}/pedido/${pedidoId}?pago=pendiente`,
        },
        external_reference: String(pedidoId),
        statement_descriptor: 'Cava del Plata',
      },
    })

    const mpUrl = pref.sandbox_init_point || pref.init_point
    return NextResponse.json({ mpUrl })
  } catch (e) {
    console.error('MP preference error:', e.message)
    return NextResponse.json({ error: 'Error al crear preferencia MP' }, { status: 500 })
  }
}
