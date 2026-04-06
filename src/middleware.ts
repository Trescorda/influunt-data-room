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

  // Refresh session (important: writes updated cookies to response)
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // API routes — don't apply redirect logic
  if (pathname.startsWith('/api/')) {
    return supabaseResponse
  }

  // Public routes
  if (pathname === '/login') {
    if (user) {
      // Check if NDA is signed
      const { data: investor } = await supabase
        .from('investors')
        .select('nda_signed, is_admin')
        .eq('auth_user_id', user.id)
        .single()

      if (investor?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin'
        return NextResponse.redirect(url)
      }
      if (investor && !investor.nda_signed) {
        const url = request.nextUrl.clone()
        url.pathname = '/nda'
        return NextResponse.redirect(url)
      }
      if (investor) {
        const url = request.nextUrl.clone()
        url.pathname = '/room'
        return NextResponse.redirect(url)
      }
    }
    return supabaseResponse
  }

  // Protected routes - require auth
  if (pathname.startsWith('/room') || pathname.startsWith('/admin') || pathname === '/nda') {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    const { data: investor } = await supabase
      .from('investors')
      .select('nda_signed, is_admin, status')
      .eq('auth_user_id', user.id)
      .single()

    if (!investor) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Check if suspended
    if (investor.status === 'suspended') {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    // Admin routes - require admin
    if (pathname.startsWith('/admin') && !investor.is_admin) {
      const url = request.nextUrl.clone()
      url.pathname = '/room'
      return NextResponse.redirect(url)
    }

    // Room routes - require NDA
    if (pathname.startsWith('/room') && !investor.nda_signed) {
      const url = request.nextUrl.clone()
      url.pathname = '/nda'
      return NextResponse.redirect(url)
    }

    // NDA page - redirect if already signed
    if (pathname === '/nda' && investor.nda_signed) {
      const url = request.nextUrl.clone()
      url.pathname = investor.is_admin ? '/admin' : '/room'
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
