import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import MiCuentaCliente from './MiCuentaCliente'

export const metadata = { title: 'Mi Cuenta | Cava del Plata' }

export default async function MiCuentaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const [{ data: profile }, { data: pedidos }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('pedidos')
      .select(`*, pedido_items (id, nombre_producto, bodega_producto, cantidad, precio_unitario)`)
      .eq('usuario_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  return <MiCuentaCliente user={user} profile={profile} pedidos={pedidos ?? []} />
}
