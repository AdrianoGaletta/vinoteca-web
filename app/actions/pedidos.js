'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { MercadoPagoConfig, Preference } from 'mercadopago'

export async function crearPedido(prevState, formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login?redirect=/checkout')

  const nombre_receptor    = formData.get('nombre_receptor')?.trim()
  const direccion_entrega  = formData.get('direccion_entrega')?.trim()
  const ciudad_entrega     = formData.get('ciudad_entrega')?.trim()
  const provincia_entrega  = formData.get('provincia_entrega')?.trim()
  const notas              = formData.get('notas')?.trim()

  if (!nombre_receptor || !direccion_entrega || !ciudad_entrega) {
    return { error: 'Completá los campos obligatorios: nombre, dirección y ciudad.' }
  }

  // Obtener carrito activo
  const { data: carrito } = await supabase
    .from('carritos')
    .select('id')
    .eq('usuario_id', user.id)
    .eq('estado', 'activo')
    .maybeSingle()

  if (!carrito) return { error: 'No se encontró un carrito activo.' }

  // Obtener items del carrito con datos del producto
  const { data: items } = await supabase
    .from('carrito_items')
    .select(`
      cantidad,
      precio_unitario,
      productos (id, nombre, bodega, stock)
    `)
    .eq('carrito_id', carrito.id)

  if (!items || items.length === 0) return { error: 'El carrito está vacío.' }

  // Validar stock
  for (const item of items) {
    if (item.productos.stock < item.cantidad) {
      return { error: `Stock insuficiente para "${item.productos.nombre}". Disponible: ${item.productos.stock}.` }
    }
  }

  // Calcular totales
  const subtotal    = items.reduce((acc, item) => acc + item.precio_unitario * item.cantidad, 0)
  const costo_envio = subtotal >= 15000 ? 0 : 1500
  const total       = subtotal + costo_envio

  // Crear el pedido
  const { data: pedido, error: errPedido } = await supabase
    .from('pedidos')
    .insert({
      usuario_id: user.id,
      estado: 'pendiente',
      subtotal,
      costo_envio,
      total,
      nombre_receptor,
      direccion_entrega,
      ciudad_entrega,
      provincia_entrega,
      notas: notas || null,
    })
    .select('id')
    .single()

  if (errPedido) {
    console.error('Error creando pedido:', errPedido.message)
    return { error: 'Error al crear el pedido. Intentá de nuevo.' }
  }

  // Crear items del pedido
  const { error: errItems } = await supabase
    .from('pedido_items')
    .insert(
      items.map(item => ({
        pedido_id:        pedido.id,
        producto_id:      item.productos.id,
        nombre_producto:  item.productos.nombre,
        bodega_producto:  item.productos.bodega,
        cantidad:         item.cantidad,
        precio_unitario:  item.precio_unitario,
      }))
    )

  if (errItems) {
    console.error('Error creando items del pedido:', errItems.message)
    return { error: 'Error al guardar los productos del pedido.' }
  }

  // Crear transacción con estado pendiente
  await supabase.from('transacciones').insert({
    pedido_id: pedido.id,
    estado:    'pendiente',
    monto:     total,
    moneda:    'ARS',
  })

  // Descontar stock
  for (const item of items) {
    await supabase
      .from('productos')
      .update({ stock: item.productos.stock - item.cantidad })
      .eq('id', item.productos.id)
  }

  // Marcar carrito como convertido y vaciar items
  await supabase.from('carritos').update({ estado: 'convertido' }).eq('id', carrito.id)
  await supabase.from('carrito_items').delete().eq('carrito_id', carrito.id)

  // Intentar crear preferencia de Mercado Pago
  let checkoutUrl = null

  if (process.env.MP_ACCESS_TOKEN) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      const mpClient = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
      const preferenceClient = new Preference(mpClient)

      const pref = await preferenceClient.create({
        body: {
          items: items.map(item => ({
            id:          String(item.productos.id),
            title:       item.productos.nombre,
            quantity:    item.cantidad,
            unit_price:  item.precio_unitario,
            currency_id: 'ARS',
          })),
          back_urls: {
            success: `${baseUrl}/pedido/${pedido.id}?pago=aprobado`,
            failure: `${baseUrl}/pedido/${pedido.id}?pago=fallido`,
            pending: `${baseUrl}/pedido/${pedido.id}?pago=pendiente`,
          },
          ...(baseUrl.startsWith('https') && { auto_return: 'approved' }),
          external_reference:   String(pedido.id),
          statement_descriptor: 'Cava del Plata',
        },
      })

      checkoutUrl = pref.sandbox_init_point || pref.init_point
    } catch (mpErr) {
      console.error('Error creando preferencia MP:', mpErr.message)
    }
  }

  // redirect() debe estar fuera del try/catch (lanza excepción interna de Next.js)
  redirect(checkoutUrl ?? `/pedido/${pedido.id}`)
}
