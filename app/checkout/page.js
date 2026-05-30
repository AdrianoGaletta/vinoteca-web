import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CheckoutForm from './CheckoutForm'

export const metadata = { title: 'Checkout | Cava del Plata' }

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/checkout')

  // Cargar carrito con productos
  const { data: carrito } = await supabase
    .from('carritos')
    .select('id')
    .eq('usuario_id', user.id)
    .eq('estado', 'activo')
    .maybeSingle()

  let items = []
  if (carrito) {
    const { data } = await supabase
      .from('carrito_items')
      .select(`
        cantidad,
        precio_unitario,
        productos (id, nombre, bodega, varietal, imagen)
      `)
      .eq('carrito_id', carrito.id)
    items = data ?? []
  }

  if (items.length === 0) redirect('/carrito')

  // Cargar perfil para pre-completar campos
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const subtotal = items.reduce((acc, i) => acc + i.precio_unitario * i.cantidad, 0)
  const costo_envio = subtotal >= 15000 ? 0 : 1500
  const total = subtotal + costo_envio

  return (
    <CheckoutForm
      items={items}
      profile={profile}
      user={user}
      subtotal={subtotal}
      costo_envio={costo_envio}
      total={total}
    />
  )
}
