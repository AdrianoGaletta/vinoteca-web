import { createClient } from '@/lib/supabase/server'

// Devuelve el usuario autenticado solo si es administrador; si no, null.
// El rol vive en app_metadata, que solo puede modificarse desde el servidor
// de Auth (nunca desde el navegador), por eso es una fuente confiable.
export async function getAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}
