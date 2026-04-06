import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, document_id, duration_seconds, metadata } = body

  const admin = createAdminClient()

  // Get investor_id from auth user
  const { data: investor } = await admin
    .from('investors')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
  }

  const { data, error } = await admin.from('activity_log').insert({
    investor_id: investor.id,
    action,
    document_id: document_id || null,
    duration_seconds: duration_seconds || null,
    metadata: metadata || {},
  }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, id: data.id })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, duration_seconds } = body

  const admin = createAdminClient()

  const { error } = await admin
    .from('activity_log')
    .update({ duration_seconds })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
