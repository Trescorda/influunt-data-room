import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// TEMPORARY: Set or update a password for an investor's auth account.
// Usage: POST /api/setup-password { "email": "...", "password": "..." }
// If the user doesn't exist in auth.users yet, creates them first.
// Remove or protect this route before production.
export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  const admin = createAdminClient()
  const normalizedEmail = email.toLowerCase().trim()

  // Check investor exists
  const { data: investor } = await admin
    .from('investors')
    .select('id')
    .eq('email', normalizedEmail)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Email not found in investors table' }, { status: 404 })
  }

  // Check if auth user already exists
  const { data: existingUsers } = await admin.auth.admin.listUsers()
  const existingUser = existingUsers?.users?.find(u => u.email === normalizedEmail)

  if (existingUser) {
    // Update password for existing user
    const { error } = await admin.auth.admin.updateUserById(existingUser.id, {
      password,
    })
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: true, message: 'Password updated', userId: existingUser.id })
  }

  // Create new auth user with password
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
  })

  if (createError) {
    return NextResponse.json({ error: createError.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'User created with password', userId: newUser.user.id })
}
