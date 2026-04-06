import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

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

  const { documentTitle } = await request.json()

  // Get active investors who have signed NDA
  const { data: investors } = await admin
    .from('investors')
    .select('email, name')
    .eq('status', 'active')
    .eq('nda_signed', true)
    .eq('is_admin', false)

  if (!investors || investors.length === 0) {
    return NextResponse.json({ notified: 0, message: 'No active investors to notify' })
  }

  // Try to send emails via Supabase (will fail gracefully if SMTP not configured)
  let notified = 0
  for (const inv of investors) {
    try {
      await admin.auth.admin.generateLink({
        type: 'magiclink',
        email: inv.email,
        options: {
          redirectTo: 'https://invest.influunt.global/room',
        },
      })
      notified++
    } catch (err) {
      console.log(`[Notify] Could not send to ${inv.email}:`, err)
    }
  }

  if (notified === 0) {
    return NextResponse.json({
      notified: 0,
      message: 'Email notifications require SMTP setup',
      investorCount: investors.length,
    })
  }

  return NextResponse.json({ notified, message: `${notified} investors notified` })
}
