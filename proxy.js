import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function proxy(request) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresca la sesión del usuario — no elimines esta línea
  const { data: { user } } = await supabase.auth.getUser()

  // El panel /admin exige sesión iniciada con rol de administrador.
  // Sin sesión → login (con retorno); sin rol admin → inicio.
  const { pathname } = request.nextUrl
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const url = request.nextUrl.clone()
    if (!user) {
      url.pathname = '/auth/login'
      url.search = `redirect=${encodeURIComponent(pathname)}`
    } else if (user.app_metadata?.role !== 'admin') {
      url.pathname = '/'
      url.search = ''
    } else {
      return supabaseResponse
    }
    // Conservar las cookies de sesión refrescadas también al redirigir
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach(cookie =>
      redirectResponse.cookies.set(cookie)
    )
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
