import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAdmin } from '@/lib/auth'

// GET /api/productos — catálogo público (solo productos activos).
// Filtros: ?destacado=true · ?varietal=Malbec · ?slug=mi-vino · ?limit=3
// Con sesión de admin, ?todos=true incluye también los inactivos (panel).
export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const incluirInactivos = searchParams.get('todos') === 'true' && (await getAdmin())
  const supabase = incluirInactivos ? createAdminClient() : await createClient()

  let query = supabase.from('productos').select('*').order('nombre')

  if (!incluirInactivos) {
    query = query.eq('activo', true)
  }
  if (searchParams.get('destacado') === 'true') {
    query = query.eq('destacado', true)
  }
  if (searchParams.has('varietal')) {
    query = query.eq('varietal', searchParams.get('varietal'))
  }
  if (searchParams.has('slug')) {
    query = query.eq('slug', searchParams.get('slug'))
  }
  if (searchParams.has('limit')) {
    query = query.limit(Number(searchParams.get('limit')))
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/productos — crear producto (solo admin)
export async function POST(request) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()

  const { nombre, bodega, varietal, precio, stock, slug } = body
  if (!nombre || !bodega || !varietal || !precio || !slug) {
    return NextResponse.json({ error: 'Faltan campos obligatorios: nombre, bodega, varietal, precio, slug' }, { status: 400 })
  }

  const datos = {
    nombre,
    bodega,
    varietal,
    slug,
    descripcion: body.descripcion ?? null,
    imagen: body.imagen ?? null,
    precio: Number(precio),
    stock: Number(stock) || 0,
    anio: body.anio ? Number(body.anio) : null,
    activo: body.activo ?? true,
    destacado: body.destacado ?? false,
  }

  const { data, error } = await createAdminClient()
    .from('productos')
    .insert(datos)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data, { status: 201 })
}
