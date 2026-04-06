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
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data } = await admin.from('cap_table_entries').select('*').order('sort_order')
  return NextResponse.json({ entries: data || [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()

  if (body.entries && Array.isArray(body.entries)) {
    // Bulk upsert
    for (const entry of body.entries) {
      if (entry.id) {
        await admin.from('cap_table_entries').update({
          shareholder: entry.shareholder,
          entity_type: entry.entity_type,
          share_class: entry.share_class,
          shares_held: entry.shares_held,
          ownership_percentage: entry.ownership_percentage,
          investment_amount: entry.investment_amount,
          sort_order: entry.sort_order,
        }).eq('id', entry.id)
      } else {
        await admin.from('cap_table_entries').insert({
          shareholder: entry.shareholder,
          entity_type: entry.entity_type,
          share_class: entry.share_class || 'Ordinary',
          shares_held: entry.shares_held || 0,
          ownership_percentage: entry.ownership_percentage || 0,
          investment_amount: entry.investment_amount || 0,
          sort_order: entry.sort_order || 0,
        })
      }
    }
    return NextResponse.json({ success: true })
  }

  // Single insert
  const { data, error } = await admin.from('cap_table_entries').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  await admin.from('cap_table_entries').delete().eq('id', id)
  return NextResponse.json({ success: true })
}
