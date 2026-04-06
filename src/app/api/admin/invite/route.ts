import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST: Create investor record + auth user with password
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

  const { name, email, organisation, investor_type, password } = await request.json()
  const normalizedEmail = email.toLowerCase().trim()

  // Insert investor record
  const { error: insertError } = await admin.from('investors').insert({
    name,
    email: normalizedEmail,
    organisation: organisation || null,
    investor_type: investor_type || 'individual',
    status: 'invited',
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  // Create auth user with the provided password (or a random one)
  const userPassword = password || crypto.randomUUID().slice(0, 12) + '-Aa1!'
  const { error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password: userPassword,
    email_confirm: true,
  })

  if (createError) {
    console.error('[Invite] createUser error:', createError.message)
  }

  return NextResponse.json({ success: true, password: userPassword })
}

// PATCH: Set/reset password for an existing investor
export async function PATCH(request: Request) {
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

  const { email, password } = await request.json()
  const normalizedEmail = email.toLowerCase().trim()

  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  // Try to create user first (in case they don't have an auth account yet)
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  })

  if (createError) {
    // User already exists — find and update their password
    const { data: users } = await admin.auth.admin.listUsers()
    const existingUser = users?.users?.find(u => u.email === normalizedEmail)

    if (existingUser) {
      const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, { password })
      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }
    } else {
      return NextResponse.json({ error: 'Could not find or create auth user' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
