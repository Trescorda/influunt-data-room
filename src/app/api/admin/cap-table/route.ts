import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireAdmin } from '@/lib/auth'

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

async function verifyAdmin(supabase: SupabaseServerClient) {
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
  const admin = await requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await admin.from('cap_table_entries').select('*').order('sort_order')
  console.log('[CapTable API] GET entries:', data?.length, 'error:', error?.message)
  if (error) {
    return NextResponse.json({ entries: [], error: error.message }, { status: 500 })
  }
  return NextResponse.json({ entries: data || [] })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  console.log('[CapTable API] POST body:', JSON.stringify(body).slice(0, 500))

  if (body.entries && Array.isArray(body.entries)) {
    const errors: string[] = []

    for (const entry of body.entries) {
      if (entry.id) {
        const { error } = await admin.from('cap_table_entries').update({
          shareholder_name: entry.shareholder_name,
          entity_type: entry.entity_type,
          share_class: entry.share_class,
          shares_held: entry.shares_held,
          ownership_percentage: entry.ownership_percentage,
          investment_amount: entry.investment_amount,
          sort_order: entry.sort_order,
        }).eq('id', entry.id)
        if (error) {
          console.error('[CapTable API] Update error:', error.message)
          errors.push(error.message)
        }
      } else {
        const { error } = await admin.from('cap_table_entries').insert({
          shareholder_name: entry.shareholder_name || '',
          entity_type: entry.entity_type || 'seed',
          share_class: entry.share_class || 'Ordinary',
          shares_held: entry.shares_held || 0,
          ownership_percentage: entry.ownership_percentage || 0,
          investment_amount: entry.investment_amount || 0,
          sort_order: entry.sort_order || 0,
        })
        if (error) {
          console.error('[CapTable API] Insert error:', error.message)
          errors.push(error.message)
        }
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join('; ') }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const { data, error } = await admin.from('cap_table_entries').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entry: data })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  const admin = await verifyAdmin(supabase)
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await request.json()
  const { error } = await admin.from('cap_table_entries').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
