import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  let query = supabase.from('productos').select('*').order('nombre')

  if (searchParams.has('activo')) {
    query = query.eq('activo', searchParams.get('activo') === 'true')
  }
  if (searchParams.get('destacado') === 'true') {
    query = query.eq('destacado', true)
  }
  if (searchParams.has('varietal')) {
    query = query.eq('varietal', searchParams.get('varietal'))
  }
  if (searchParams.has('limit')) {
    query = query.limit(Number(searchParams.get('limit')))
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request) {
  const supabase = await createClient()
  const body = await request.json()

  const { nombre, bodega, varietal, precio, stock, slug } = body
  if (!nombre || !bodega || !varietal || !precio || !slug) {
    return NextResponse.json({ error: 'Faltan campos obligatorios: nombre, bodega, varietal, precio, slug' }, { status: 400 })
  }

  const datos = {
    ...body,
    precio: Number(precio),
    stock: Number(stock) || 0,
    anio: body.anio ? Number(body.anio) : null,
    activo: body.activo ?? true,
    destacado: body.destacado ?? false,
  }

  const { data, error } = await supabase
    .from('productos')
    .insert(datos)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
