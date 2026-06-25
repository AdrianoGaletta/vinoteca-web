import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Payment } from 'mercadopago'

export async function POST(request) {
  const body = await request.json()
  const { pedido_id, ...paymentData } = body

  if (!pedido_id) {
    return NextResponse.json({ error: 'pedido_id requerido' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const { data: pedido } = await supabase
    .from('pedidos')
    .select('id, total, estado')
    .eq('id', pedido_id)
    .eq('usuario_id', user.id)
    .single()

  if (!pedido) {
    return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
  }

  if (pedido.estado === 'pagado') {
    return NextResponse.json({ error: 'Pedido ya pagado' }, { status: 409 })
  }

  if (!process.env.MP_ACCESS_TOKEN) {
    return NextResponse.json({ error: 'MP no configurado' }, { status: 503 })
  }

  // El email del pagador debe ser un email común. Los @testuser.com de MP
  // y el email del propio vendedor son rechazados ("Payer email forbidden").
  const emailBrick = paymentData.payer?.email
  const emailUsuario = user.email
  const esEmailValido = (e) => e && !e.endsWith('@testuser.com')
  const payerEmail = esEmailValido(emailBrick)
    ? emailBrick
    : esEmailValido(emailUsuario)
      ? emailUsuario
      : 'comprador@cavadelplata.com'

  try {
    const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
    const payment = await new Payment(mpClient).create({
      body: {
        token:                paymentData.token,
        issuer_id:            paymentData.issuer_id,
        payment_method_id:    paymentData.payment_method_id,
        transaction_amount:   Number(paymentData.transaction_amount),
        installments:         paymentData.installments,
        description:          'Cava del Plata',
        external_reference:   pedido_id,
        payer:                { ...paymentData.payer, email: payerEmail },
      },
    })

    if (payment.status === 'approved') {
      await Promise.all([
        supabase.from('pedidos').update({ estado: 'pagado' }).eq('id', pedido_id),
        supabase.from('transacciones')
          .update({ estado: 'aprobado', monto: paymentData.transaction_amount })
          .eq('pedido_id', pedido_id),
      ])
    }

    return NextResponse.json({
      status:  payment.status,
      detail:  payment.status_detail,
      id:      payment.id,
    })
  } catch (e) {
    console.error('MP payment error:', e.message)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
