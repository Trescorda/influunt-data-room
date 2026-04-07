import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, answerEmail } from '@/lib/email'

export async function GET() {
  const admin = createAdminClient()

  const { data: questions, error } = await admin
    .from('questions')
    .select('*, investors(name, email, organisation)')
    .order('created_at', { ascending: false })

  console.log('[Admin Questions GET] Result:', questions?.length, 'rows, error:', error?.message)

  if (error) {
    return NextResponse.json({ questions: [], error: error.message }, { status: 500 })
  }

  return NextResponse.json({ questions: questions || [] })
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: investor } = await admin
    .from('investors')
    .select('id, is_admin')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor?.is_admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, answer } = await request.json()

  // Fetch the question first so we have the original text + investor info for the email
  const { data: question } = await admin
    .from('questions')
    .select('*, investors(name, email)')
    .eq('id', id)
    .single()

  const { error } = await admin
    .from('questions')
    .update({
      answer,
      answered_by: investor.id,
      answered_at: new Date().toISOString(),
      status: 'answered',
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Notify the investor via email (don't block on failure)
  if (question?.investors) {
    const investorEmail = (question.investors as any).email
    const investorName = (question.investors as any).name
    if (investorEmail) {
      try {
        await sendEmail(
          investorEmail,
          'Your question has been answered — Influunt Data Room',
          answerEmail(question.question, answer),
        )
        console.log('[Admin Questions PATCH] Notified', investorName, '<', investorEmail, '>')
      } catch (emailErr) {
        console.error('[Admin Questions PATCH] Email notify failed:', emailErr)
      }
    }
  }

  return NextResponse.json({ success: true })
}
