import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// TEMPORARY: Dev-only login bypass for testing. Remove before production.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const email = searchParams.get('email')?.toLowerCase().trim()

  if (!email) {
    return NextResponse.json({ error: 'Email required. Usage: /api/dev-login?email=you@example.com' }, { status: 400 })
  }

  const admin = createAdminClient()

  // Check investor exists
  const { data: investor } = await admin
    .from('investors')
    .select('id')
    .eq('email', email)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Email not found in investors table' }, { status: 404 })
  }

  // Generate a magic link using admin API
  const { data: linkData, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error || !linkData) {
    return NextResponse.json({ error: error?.message || 'Failed to generate link' }, { status: 500 })
  }

  // The generated link contains a token_hash and type we can use directly
  const hashed_token = linkData.properties?.hashed_token
  if (hashed_token) {
    // Verify the OTP server-side to create the session, then redirect
    const { data: verifyData, error: verifyError } = await admin.auth.admin.getUserById(linkData.user.id)

    // Use the action_link which is a ready-to-use verification URL
    const actionLink = linkData.properties?.action_link
    if (actionLink) {
      return NextResponse.redirect(actionLink)
    }
  }

  return NextResponse.json({ error: 'Could not generate login link' }, { status: 500 })
}
