'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// El login y el registro se resuelven del lado del cliente (ver
// app/auth/login y app/auth/registro) para que la sesión se reconozca al
// instante en toda la app. Acá quedan las acciones que sí necesitan el server.

function siteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || ''
  return url.startsWith('https://') && !url.includes('localhost')
    ? url
    : 'https://vinoteca-web.vercel.app'
}

export async function recuperarContrasena(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')

  if (!email) {
    return { error: 'Ingresá tu email.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/auth/nueva-contrasena`,
  })

  if (error) {
    return { error: 'No pudimos procesar tu solicitud. Intentá de nuevo.' }
  }

  return { success: 'Te enviamos un email con instrucciones para restablecer tu contraseña.' }
}

export async function nuevaContrasena(prevState, formData) {
  const supabase = await createClient()

  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  if (!password || !confirmPassword) {
    return { error: 'Completá todos los campos.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Las contraseñas no coinciden.' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { error } = await supabase.auth.updateUser({ password })

  if (error) {
    return { error: 'No pudimos actualizar tu contraseña. El enlace puede haber expirado.' }
  }

  redirect('/auth/login?reset=ok')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
