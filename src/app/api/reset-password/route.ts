import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const { email, token, password } = await request.json()

  if (!email || !token || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (password.length < 12) {
    return NextResponse.json({ error: 'Password must be at least 12 characters' }, { status: 400 })
  }
  if (!/\d/.test(password)) {
    return NextResponse.json({ error: 'Password must contain at least one number' }, { status: 400 })
  }

  const admin = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()

  // Verify token
  const { data: investor } = await admin
    .from('investors')
    .select('id, notes')
    .eq('email', normalizedEmail)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  // investor.notes holds a JSON blob carrying the reset token and its expiry.
  type ResetTokenData = { reset_token?: string; reset_expires?: string }
  let tokenData: ResetTokenData = {}
  try {
    tokenData = JSON.parse(investor.notes || '{}') as ResetTokenData
  } catch {
    return NextResponse.json({ error: 'Invalid link' }, { status: 400 })
  }

  if (tokenData.reset_token !== token) {
    return NextResponse.json({ error: 'Invalid or expired link' }, { status: 400 })
  }

  if (tokenData.reset_expires && new Date(tokenData.reset_expires) < new Date()) {
    return NextResponse.json({ error: 'This link has expired. Contact brad@influunt.global for a new link.' }, { status: 400 })
  }

  // Find auth user and update password
  const { data: users } = await admin.auth.admin.listUsers()
  const authUser = users?.users?.find(u => u.email === normalizedEmail)

  if (!authUser) {
    // Create auth user
    const { error: createErr } = await admin.auth.admin.createUser({
      email: normalizedEmail,
      password,
      email_confirm: true,
    })
    if (createErr) {
      return NextResponse.json({ error: createErr.message }, { status: 500 })
    }
  } else {
    const { error: updateErr } = await admin.auth.admin.updateUserById(authUser.id, { password })
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 })
    }
  }

  // Clear the token
  await admin
    .from('investors')
    .update({ notes: null })
    .eq('id', investor.id)

  return NextResponse.json({ success: true })
}
