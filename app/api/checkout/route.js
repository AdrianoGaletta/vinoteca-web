import { MercadoPagoConfig, Preference } from 'mercadopago'
import { NextResponse } from 'next/server'

export async function POST(request) {
  const { items, pedidoId } = await request.json()

  if (!items?.length || !pedidoId) {
    return NextResponse.json({ error: 'items y pedidoId son requeridos' }, { status: 400 })
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    return NextResponse.json({ error: 'MP_ACCESS_TOKEN no configurado' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const client = new MercadoPagoConfig({ accessToken })
    const preference = new Preference(client)

    const result = await preference.create({
      body: {
        items: items.map(item => ({
          id: String(item.id),
          title: item.nombre,
          quantity: Number(item.cantidad),
          unit_price: Number(item.precio_unitario),
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

    return NextResponse.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    })
  } catch (err) {
    console.error('Error creando preferencia MP:', err)
    return NextResponse.json({ error: 'Error al crear preferencia de pago' }, { status: 500 })
  }
}
