import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, documentViewedEmail } from '@/lib/email'

const ADMIN_EMAILS = ['brad@influunt.global', 'kayde@influunt.global']

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, document_id, duration_seconds, metadata } = body

  const admin = createAdminClient()

  // Get investor record (need name/email/org for the email below)
  const { data: investor } = await admin
    .from('investors')
    .select('id, name, email, organisation, is_admin')
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

  // Notify admins on every document view (skip when admin is testing the room)
  if (action === 'view_document' && document_id && !investor.is_admin) {
    try {
      const { data: doc } = await admin
        .from('documents')
        .select('title')
        .eq('id', document_id)
        .single()

      if (doc?.title) {
        // Fire and forget — never block the activity log response on email
        sendEmail(
          ADMIN_EMAILS,
          `${investor.name} viewed: ${doc.title}`,
          documentViewedEmail(
            investor.name,
            investor.email,
            investor.organisation,
            doc.title,
            new Date(),
          ),
        ).catch((err) => console.error('[Activity] Email notify failed:', err))
      }
    } catch (emailErr) {
      console.error('[Activity] Email setup failed:', emailErr)
    }
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
