import { createClient } from '@/lib/supabase/client'

export async function fetchVinos() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('nombre')
  if (error) throw error
  return data ?? []
}

export async function fetchDestacados() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .eq('destacado', true)
    .limit(3)
  if (error) throw error
  return data ?? []
}

export async function fetchVino(slug) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) throw error
  return data
}
