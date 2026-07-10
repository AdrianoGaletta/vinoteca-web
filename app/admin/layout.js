import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata = { title: 'Administración | Cava del Plata' }

// Segunda barrera de acceso al panel (la primera es el proxy): ninguna
// página bajo /admin se renderiza sin sesión de administrador.
export default async function AdminLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login?redirect=/admin')
  if (user.app_metadata?.role !== 'admin') redirect('/')

  return children
}
