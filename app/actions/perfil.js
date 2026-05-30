'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function actualizarPerfil(prevState, formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { error } = await supabase
    .from('profiles')
    .update({
      nombre: formData.get('nombre')?.trim() || null,
      apellido: formData.get('apellido')?.trim() || null,
      telefono: formData.get('telefono')?.trim() || null,
      direccion: formData.get('direccion')?.trim() || null,
      ciudad: formData.get('ciudad')?.trim() || null,
      provincia: formData.get('provincia')?.trim() || null,
      codigo_postal: formData.get('codigo_postal')?.trim() || null,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error actualizando perfil:', error.message)
    return { error: 'No se pudo actualizar el perfil. Intentá de nuevo.' }
  }

  return { success: 'Perfil actualizado correctamente.' }
}
