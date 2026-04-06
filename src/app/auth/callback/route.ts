import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')

  const baseUrl = request.headers.get('x-forwarded-host')
    ? `https://${request.headers.get('x-forwarded-host')}`
    : origin

  if (code) {
    // PKCE flow — exchange code for session
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${baseUrl}/login?error=auth&message=${encodeURIComponent(error.message)}`)
    }

    if (sessionData?.user) {
      const redirectPath = await getRedirectPath(sessionData.user.id)
      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }
  }

  if (token_hash && type) {
    // Implicit/magic link flow — verify OTP with token hash
    const supabase = await createClient()
    const { data: sessionData, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'email' | 'magiclink',
    })

    if (error) {
      console.error('verifyOtp error:', error.message)
      return NextResponse.redirect(`${baseUrl}/login?error=auth&message=${encodeURIComponent(error.message)}`)
    }

    if (sessionData?.user) {
      const redirectPath = await getRedirectPath(sessionData.user.id)
      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth`)
}

async function getRedirectPath(userId: string): Promise<string> {
  const admin = createAdminClient()
  const { data: investor } = await admin
    .from('investors')
    .select('nda_signed, is_admin')
    .eq('auth_user_id', userId)
    .single()

  if (investor?.is_admin) return '/admin'
  if (investor?.nda_signed) return '/room'
  return '/nda'
}
