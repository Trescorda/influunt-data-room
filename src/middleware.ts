import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
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

  // Refresh session tokens
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // Skip auth checks for public routes and API
  if (pathname === '/login' || pathname === '/expired' || pathname.startsWith('/api/')) {
    return supabaseResponse
  }

  const isProtected =
    pathname.startsWith('/room') || pathname.startsWith('/admin') || pathname === '/nda'

  // Anonymous visitors never reach a protected route.
  //
  // Gating used to be done per-page with redirect('/login'), which only covers
  // Server Components — every 'use client' page under /room rendered its markup
  // to anyone with the URL. On /room/invest that meant the raise terms (target
  // raise, pre-money valuation, minimum cheque, all four stages) were public,
  // because that page hardcodes them rather than fetching them. Enforcing here
  // covers every current and future page in one place.
  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  // Check access expiration for authenticated users on protected routes
  if (user && isProtected) {
    const { data: investor } = await supabase
      .from('investors')
      .select('access_expires_at')
      .eq('auth_user_id', user.id)
      .single()

    if (investor?.access_expires_at && new Date(investor.access_expires_at) < new Date()) {
      const url = request.nextUrl.clone()
      url.pathname = '/expired'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
