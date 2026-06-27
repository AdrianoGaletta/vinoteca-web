import { MercadoPagoConfig, Payment } from 'mercadopago'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const estadoMap = {
  approved: { pedido: 'pagado', transaccion: 'aprobado' },
  pending:  { pedido: 'pendiente', transaccion: 'pendiente' },
  rejected: { pedido: 'cancelado', transaccion: 'rechazado' },
}

export async function POST(request) {
  const body = await request.json()

  if (body.type !== 'payment' || !body.data?.id) {
    return NextResponse.json({ received: true })
  }

  const accessToken = process.env.MP_ACCESS_TOKEN
  if (!accessToken) {
    console.error('Webhook MP: MP_ACCESS_TOKEN no configurado')
    return NextResponse.json({ error: 'no configurado' }, { status: 500 })
  }

  try {
    const mpClient = new MercadoPagoConfig({ accessToken })
    const paymentClient = new Payment(mpClient)
    const payment = await paymentClient.get({ id: body.data.id })

    const pedidoId = payment.external_reference
    if (!pedidoId) return NextResponse.json({ received: true })

    const estados = estadoMap[payment.status] ?? estadoMap.pending
    const supabase = createAdminClient()

    await supabase
      .from('transacciones')
      .update({
        estado: estados.transaccion,
        monto: payment.transaction_amount,
      })
      .eq('pedido_id', pedidoId)

    await supabase
      .from('pedidos')
      .update({ estado: estados.pedido })
      .eq('id', pedidoId)

  } catch (err) {
    console.error('Error procesando webhook MP:', err.message)
    return NextResponse.json({ error: 'error interno' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
