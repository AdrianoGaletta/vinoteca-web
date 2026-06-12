import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(request, { params }) {
  const supabase = await createClient()
  const { id } = await params
  const body = await request.json()

  const datos = {
    ...body,
    precio: body.precio !== undefined ? Number(body.precio) : undefined,
    stock: body.stock !== undefined ? Number(body.stock) : undefined,
    anio: body.anio ? Number(body.anio) : null,
  }

  // Remove undefined values
  Object.keys(datos).forEach(k => datos[k] === undefined && delete datos[k])

  const { data, error } = await supabase
    .from('productos')
    .update(datos)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(request, { params }) {
  const supabase = await createClient()
  const { id } = await params

  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
