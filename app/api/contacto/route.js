import { NextResponse } from 'next/server'
import { validarNombrePersona, validarEmail } from '@/lib/validacion'

// POST /api/contacto — recibe el mensaje del formulario de contacto.
// Valida el contenido también en el servidor (la validación del cliente
// se puede saltear). En una tienda real acá se enviaría un email o se
// guardaría el mensaje para el equipo de atención.
export async function POST(request) {
  const { nombre, email, mensaje } = await request.json().catch(() => ({}))

  const error =
    validarNombrePersona(nombre, { etiqueta: 'El nombre' }) ||
    validarEmail(email) ||
    (!mensaje?.trim()
      ? 'El mensaje es obligatorio'
      : mensaje.trim().length < 10
        ? 'El mensaje debe tener al menos 10 caracteres'
        : '')

  if (error) return NextResponse.json({ error }, { status: 400 })

  console.log('Nuevo mensaje de contacto:', { nombre, email, mensaje: mensaje.trim() })
  return NextResponse.json({ ok: true })
}
