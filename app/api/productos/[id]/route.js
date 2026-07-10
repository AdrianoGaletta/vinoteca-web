import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdmin } from '@/lib/auth'

// Campos que la API permite modificar (todo lo demás se ignora)
const CAMPOS_EDITABLES = [
  'nombre', 'bodega', 'varietal', 'anio', 'descripcion',
  'precio', 'imagen', 'stock', 'destacado', 'activo', 'slug',
]

// GET /api/productos/:id — detalle (público; inactivos solo para admin)
export async function GET(request, { params }) {
  const { id } = await params
  const esAdmin = await getAdmin()
  const supabase = esAdmin ? createAdminClient() : await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !data) return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
  return NextResponse.json(data)
}

// PUT /api/productos/:id — editar producto (solo admin)
export async function PUT(request, { params }) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()

  const datos = {}
  for (const campo of CAMPOS_EDITABLES) {
    if (body[campo] !== undefined) datos[campo] = body[campo]
  }
  if (datos.precio !== undefined) datos.precio = Number(datos.precio)
  if (datos.stock !== undefined) datos.stock = Number(datos.stock)
  if (datos.anio !== undefined) datos.anio = datos.anio ? Number(datos.anio) : null

  if (Object.keys(datos).length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })
  }

  const { data, error } = await createAdminClient()
    .from('productos')
    .update(datos)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

// DELETE /api/productos/:id — eliminar producto (solo admin)
export async function DELETE(request, { params }) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { id } = await params

  const { error } = await createAdminClient()
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
