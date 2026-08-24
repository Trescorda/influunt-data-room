import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type QuestionInvestorJoin = { email: string | null; name: string | null }

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { questionId } = await request.json()

  // Get the question with investor info
  const { data: question } = await admin
    .from('questions')
    .select('*, investors(email, name)')
    .eq('id', questionId)
    .single()

  if (!question || !question.investors) {
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const investorEmail = (question.investors as unknown as QuestionInvestorJoin).email
  if (!investorEmail) {
    return NextResponse.json({ error: 'Investor has no email on record' }, { status: 422 })
  }

  try {
    await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: investorEmail,
      options: {
        redirectTo: 'https://invest.influunt.global/room/qa',
      },
    })
    return NextResponse.json({ success: true, message: 'Investor notified' })
  } catch (err) {
    console.log(`[Notify] Could not notify ${investorEmail}:`, err)
    return NextResponse.json({
      success: false,
      message: 'Email notifications require SMTP setup',
    })
  }
}
