'use server'

import { revalidatePath } from 'next/cache'
import { getAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'

const ESTADOS_VALIDOS = [
  'pendiente', 'pagado', 'confirmado', 'en_preparacion',
  'enviado', 'entregado', 'cancelado',
]

export async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
  if (!(await getAdmin())) return { error: 'No autorizado' }
  if (!ESTADOS_VALIDOS.includes(nuevoEstado)) return { error: 'Estado inválido' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', pedidoId)

  if (error) return { error: error.message }

  revalidatePath('/admin/pedidos')
  return { ok: true }
}
