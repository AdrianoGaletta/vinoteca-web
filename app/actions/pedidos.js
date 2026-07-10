'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  // La transacción y el stock se tocan con permisos de servidor:
  // RLS no permite que un cliente modifique productos ni transacciones.
  const admin = createAdminClient()

  const { error: errTransaccion } = await admin.from('transacciones').insert({
    pedido_id:   pedido.id,
    estado:      'pendiente',
    metodo_pago: 'mercadopago',
    monto:       total,
    moneda:      'ARS',
  })
  if (errTransaccion) console.error('Error creando transacción:', errTransaccion.message)

  // Descontar stock
  for (const item of items) {
    const { error: errStock } = await admin
      .from('productos')
      .update({ stock: item.productos.stock - item.cantidad })
      .eq('id', item.productos.id)
    if (errStock) console.error('Error descontando stock:', errStock.message)
  }

  // Marcar carrito como convertido y vaciar items
  await supabase.from('carritos').update({ estado: 'convertido' }).eq('id', carrito.id)
  await supabase.from('carrito_items').delete().eq('carrito_id', carrito.id)

  redirect(`/pedido/${pedido.id}`)
}
