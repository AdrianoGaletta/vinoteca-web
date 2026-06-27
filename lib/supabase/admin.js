import { createClient } from '@supabase/supabase-js'

// Cliente con service-role: SOLO para uso en el servidor (route handlers,
// webhooks). Tiene permisos totales y omite RLS, por eso puede marcar un
// pedido como pagado de forma confiable. NUNCA importar desde el cliente.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
