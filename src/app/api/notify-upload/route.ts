import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, newDocumentEmail } from '@/lib/email'

// Manually trigger new-document notifications to all active NDA-signed investors.
// Normally the /api/admin/upload route sends these automatically — this endpoint
// is kept for re-sending or for uploads that happen outside the admin UI.
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

  const { documentTitle } = await request.json()
  if (!documentTitle || typeof documentTitle !== 'string') {
    return NextResponse.json({ error: 'documentTitle required' }, { status: 400 })
  }

  const { data: investors } = await admin
    .from('investors')
    .select('email, name')
    .eq('status', 'active')
    .eq('nda_signed', true)
    .eq('is_admin', false)

  if (!investors || investors.length === 0) {
    return NextResponse.json({ notified: 0, message: 'No active investors to notify' })
  }

  const results = await Promise.allSettled(
    investors.map((inv) =>
      sendEmail(
        inv.email,
        `New document in the Influunt data room: ${documentTitle}`,
        newDocumentEmail(documentTitle, inv.name || undefined),
      ),
    ),
  )
  const notified = results.filter((r) => r.status === 'fulfilled' && r.value.success).length

  return NextResponse.json({
    notified,
    total: investors.length,
    message: `${notified} of ${investors.length} investors notified`,
  })
}
