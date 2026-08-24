import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireUser } from '@/lib/auth'

export async function GET() {
  const admin = await requireUser()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: settings, error } = await admin.from('settings').select('*').single()
  console.log('[Settings GET] result:', settings ? 'OK' : 'NULL', 'error:', error?.message)
  if (error) {
    return NextResponse.json({ settings: null, error: error.message }, { status: 500 })
  }
  return NextResponse.json({ settings })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updates = await request.json()
  const { id, ...fields } = updates

  if (!id) {
    return NextResponse.json({ error: 'Settings ID required' }, { status: 400 })
  }

  const { error } = await admin
    .from('settings')
    .update(fields)
    .eq('id', id)

  if (error) {
    console.error('[Settings] Update error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
