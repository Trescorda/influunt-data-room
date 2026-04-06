import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST: Create investor record + auth user + generate invite link
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Verify admin
  const { data: currentInvestor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!currentInvestor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { name, email, organisation, investor_type } = await request.json()
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

  // Create auth user with a random temporary password
  const tempPassword = crypto.randomUUID() + '-Aa1!'
  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password: tempPassword,
    email_confirm: true,
  })

  if (createError) {
    console.error('[Invite] createUser error:', createError.message)
    // User might already exist — that's OK
  }

  // Generate a recovery link (password reset) so the investor can set their password
  let inviteLink = ''
  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: normalizedEmail,
    options: {
      redirectTo: 'https://invest.influunt.global/login',
    },
  })

  if (linkError) {
    console.error('[Invite] generateLink error:', linkError.message)
  } else if (linkData?.properties?.action_link) {
    inviteLink = linkData.properties.action_link
    console.log('[Invite] Generated invite link for', normalizedEmail, ':', inviteLink)
  }

  return NextResponse.json({
    success: true,
    inviteLink,
  })
}

// GET: Generate an invite link for an existing investor
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

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

  const normalizedEmail = email.toLowerCase().trim()

  // Ensure auth user exists — try to create, ignore if already exists
  const tempPassword = crypto.randomUUID() + '-Aa1!'
  const { error: createErr } = await admin.auth.admin.createUser({
    email: normalizedEmail,
    password: tempPassword,
    email_confirm: true,
  })
  if (createErr && !createErr.message.includes('already')) {
    console.error('[Invite GET] createUser error:', createErr.message)
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: normalizedEmail,
    options: {
      redirectTo: 'https://invest.influunt.global/login',
    },
  })

  if (linkError) {
    console.error('[Invite GET] generateLink error:', linkError.message)
    return NextResponse.json({ error: linkError.message }, { status: 500 })
  }

  const inviteLink = linkData?.properties?.action_link || ''
  console.log('[Invite GET] Generated link for', normalizedEmail, inviteLink ? 'OK' : 'EMPTY')

  return NextResponse.json({ inviteLink })
}
