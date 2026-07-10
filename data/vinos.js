// Capa de datos del catálogo: el front consume la API interna
// (/api/productos) en lugar de consultar la base directamente.

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Error ${res.status} al consultar la API`)
  }
  return res.json()
}

export function fetchVinos() {
  return fetchJson('/api/productos')
}

export function fetchDestacados() {
  return fetchJson('/api/productos?destacado=true&limit=3')
}

export async function fetchVino(slug) {
  const data = await fetchJson(`/api/productos?slug=${encodeURIComponent(slug)}`)
  return data[0] ?? null
}
