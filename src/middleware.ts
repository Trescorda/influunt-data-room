import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Idle timeout. A session survives as long as the person keeps using the room;
 * once they go quiet for this long, the next request forces a fresh sign-in.
 *
 * This is enforced here because Supabase does not do it for us: the access
 * token expires hourly but the client silently refreshes it, so a session
 * created in April was still valid in August. Time-boxing is a paid Supabase
 * Auth feature; this achieves the same outcome on any plan.
 *
 * Inactivity rather than a hard cap on purpose — a hard cap logs an investor
 * out mid-document, which is the one moment they are most engaged.
 */
const IDLE_TIMEOUT_MINUTES = 60

/** Cookie holding the last-seen timestamp. Not security-critical on its own —
 *  clearing it only forces an earlier re-login, never a later one. */
const LAST_SEEN_COOKIE = 'inf_last_seen'

function redirectTo(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  url.search = ''
  url.hash = ''
  return NextResponse.redirect(url)
}

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

  // Refresh session tokens
  const { data: { user } } = await supabase.auth.getUser()

  // Normalise the path before matching so no spelling of a URL slips past:
  // trailing slashes, repeated slashes and casing are all folded away, and
  // query strings and fragments are ignored entirely.
  const pathname = request.nextUrl.pathname
    .toLowerCase()
    .replace(/\/{2,}/g, '/')
    .replace(/\/+$/, '') || '/'

  // Public routes. Everything else is treated as protected by default, so a
  // page added later is gated unless it is deliberately listed here.
  const isPublic =
    pathname === '/login' ||
    pathname === '/expired' ||
    pathname === '/reset-password' ||
    pathname === '/auth/reset' ||
    pathname.startsWith('/api/')

  if (isPublic) return supabaseResponse

  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isProtected =
    isAdminRoute || pathname === '/room' || pathname.startsWith('/room/') || pathname === '/nda'

  if (!isProtected) return supabaseResponse

  // 1. Anonymous visitors never reach a protected route.
  //
  // Gating used to be done per-page with redirect('/login'), which only covers
  // Server Components — every 'use client' page under /room rendered its markup
  // to anyone with the URL. On /room/invest that meant the raise terms were
  // public, because that page hardcodes them rather than fetching them.
  if (!user) return redirectTo(request, '/login')

  // 2. Idle timeout.
  const now = Date.now()
  const lastSeenRaw = request.cookies.get(LAST_SEEN_COOKIE)?.value
  const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : null

  if (lastSeen && Number.isFinite(lastSeen) && now - lastSeen > IDLE_TIMEOUT_MINUTES * 60_000) {
    await supabase.auth.signOut()
    const res = redirectTo(request, '/login')
    res.cookies.delete(LAST_SEEN_COOKIE)
    return res
  }

  // 3. Admin gate. Read the flag once and reuse it for both checks below.
  //
  // Only /admin is a Server Component that checked this itself; investors,
  // documents, qa, activity, cap-table, faq and settings are client components
  // and had no check at all, so any signed-in investor could open the admin UI.
  const { data: investor } = await supabase
    .from('investors')
    .select('is_admin, access_expires_at')
    .eq('auth_user_id', user.id)
    .single()

  if (isAdminRoute && investor?.is_admin !== true) {
    // Send them to their own room rather than /login — they are legitimately
    // signed in, just not an admin.
    return redirectTo(request, '/room')
  }

  // 4. Access expiry (admin-issued, per investor).
  if (investor?.access_expires_at && new Date(investor.access_expires_at) < new Date()) {
    return redirectTo(request, '/expired')
  }

  // Touch the idle clock. Done last so a request that ends in a redirect above
  // does not extend a session it just rejected.
  supabaseResponse.cookies.set(LAST_SEEN_COOKIE, String(now), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  })

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
