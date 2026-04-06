import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import crypto from 'crypto'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: currentInvestor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!currentInvestor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { email } = await request.json()
  const normalizedEmail = email.toLowerCase().trim()

  // Ensure auth user exists
  await admin.auth.admin.createUser({
    email: normalizedEmail,
    password: crypto.randomUUID() + '-Aa1!',
    email_confirm: true,
  })
  // Ignore error if user already exists

  // Generate a unique reset token and store it
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days

  // Store token in investor notes (temporary — ideally a dedicated column)
  await admin
    .from('investors')
    .update({ notes: JSON.stringify({ reset_token: token, reset_expires: expiresAt }) })
    .eq('email', normalizedEmail)

  const baseUrl = 'https://invest.influunt.global'
  const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}`

  return NextResponse.json({ resetLink })
}
