'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  validarNombrePersona, validarCiudad, validarDireccion,
  validarTelefono, validarCodigoPostal,
} from '@/lib/validacion'

export async function actualizarPerfil(prevState, formData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const datos = {
    nombre: formData.get('nombre')?.trim() || null,
    apellido: formData.get('apellido')?.trim() || null,
    telefono: formData.get('telefono')?.trim() || null,
    direccion: formData.get('direccion')?.trim() || null,
    ciudad: formData.get('ciudad')?.trim() || null,
    provincia: formData.get('provincia')?.trim() || null,
    codigo_postal: formData.get('codigo_postal')?.trim() || null,
  }

  // Los campos son opcionales, pero si se completan tienen que tener sentido
  const errorValidacion =
    validarNombrePersona(datos.nombre, { etiqueta: 'El nombre', requerido: false }) ||
    validarNombrePersona(datos.apellido, { etiqueta: 'El apellido', requerido: false }) ||
    validarTelefono(datos.telefono) ||
    (datos.direccion ? validarDireccion(datos.direccion) : '') ||
    validarCiudad(datos.ciudad, { requerido: false }) ||
    validarCiudad(datos.provincia, { etiqueta: 'La provincia', requerido: false }) ||
    validarCodigoPostal(datos.codigo_postal)
  if (errorValidacion) {
    return { error: errorValidacion }
  }

  const { error } = await supabase
    .from('profiles')
    .update(datos)
    .eq('id', user.id)

  if (error) {
    console.error('Error actualizando perfil:', error.message)
    return { error: 'No se pudo actualizar el perfil. Intentá de nuevo.' }
  }

  return { success: 'Perfil actualizado correctamente.' }
}
