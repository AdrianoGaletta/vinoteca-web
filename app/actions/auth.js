'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Completá todos los campos.' }
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    if (error.message.includes('Email not confirmed')) {
      return { error: 'Tenés que confirmar tu email antes de ingresar. Revisá tu bandeja de entrada.' }
    }
    return { error: 'Email o contraseña incorrectos.' }
  }

  redirect('/mi-cuenta')
}

export async function registro(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')
  const password = formData.get('password')
  const nombre = formData.get('nombre')
  const apellido = formData.get('apellido')

  if (!email || !password || !nombre) {
    return { error: 'Completá todos los campos obligatorios.' }
  }

  if (password.length < 6) {
    return { error: 'La contraseña debe tener al menos 6 caracteres.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre, apellido },
    },
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: 'Este email ya está registrado.' }
    }
    return { error: 'Error al crear la cuenta. Intentá de nuevo.' }
  }

  // Si el email necesita confirmación
  if (data.user && !data.session) {
    return { success: 'Te enviamos un email de confirmación. Revisá tu bandeja de entrada.' }
  }

  // Guardar nombre/apellido en profiles (upsert por si el trigger todavía no corrió)
  if (data.user) {
    await supabase
      .from('profiles')
      .upsert({ id: data.user.id, nombre, apellido: apellido || null })
  }

  redirect('/mi-cuenta')
}

export async function recuperarContrasena(prevState, formData) {
  const supabase = await createClient()

  const email = formData.get('email')

  if (!email) {
    return { error: 'Ingresá tu email.' }
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/nueva-contrasena`,
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
