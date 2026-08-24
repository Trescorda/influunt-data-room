import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  console.log('[Admin Investors GET] Service key present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { data, error: queryError } = await admin
    .from('investors')
    .select('*')
    .eq('is_admin', false)
    .order('created_at', { ascending: false })

  console.log('[Admin Investors GET] Result:', data?.length, 'rows, error:', queryError?.message)

  if (queryError) {
    return NextResponse.json({ investors: [], error: queryError.message }, { status: 500 })
  }

  return NextResponse.json({ investors: data || [] })
}

export async function DELETE(request: Request) {
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

  const { investorId, authUserId } = await request.json()

  // Delete auth user if they have one
  if (authUserId) {
    try {
      await admin.auth.admin.deleteUser(authUserId)
    } catch (err) {
      console.error('[Delete] Could not delete auth user:', err)
    }
  }

  // Delete investor record
  await admin.from('investors').delete().eq('id', investorId)

  return NextResponse.json({ success: true })
}
