import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const admin = createAdminClient()
  const { data: investor } = await admin
    .from('investors')
    .select('is_admin')
    .eq('auth_user_id', user.id)
    .single()
  return investor?.is_admin ? admin : null
}

export async function GET() {
  const admin = createAdminClient()
  const { data, error } = await admin.from('faqs').select('*').order('sort_order')
  console.log('[FAQ API] GET faqs:', data?.length, 'error:', error?.message)
  if (error) {
    return NextResponse.json({ faqs: [], error: error.message }, { status: 500 })
  }
  return NextResponse.json({ faqs: data || [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const { data, error } = await admin.from('faqs').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ faq: data })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id, ...updates } = await request.json()
  const { error } = await admin.from('faqs').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await admin.from('faqs').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
