import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && sessionData?.user) {
      // Use admin client to check investor NDA status (bypasses RLS)
      const admin = createAdminClient()
      const { data: investor } = await admin
        .from('investors')
        .select('nda_signed, is_admin')
        .eq('auth_user_id', sessionData.user.id)
        .single()

      let redirectPath = '/nda'
      if (investor?.is_admin) {
        redirectPath = '/admin'
      } else if (investor?.nda_signed) {
        redirectPath = '/room'
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
