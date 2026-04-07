import { NextResponse } from 'next/server'
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
  const admin = createAdminClient()
  const { id, answer } = await request.json()

  if (!id || !answer || typeof answer !== 'string' || !answer.trim()) {
    return NextResponse.json({ error: 'Missing question id or answer' }, { status: 400 })
  }

  // Fetch the question first so we have the original text + investor info for the email
  const { data: question, error: fetchError } = await admin
    .from('questions')
    .select('*, investors(name, email)')
    .eq('id', id)
    .single()

  if (fetchError || !question) {
    console.error('[Admin Questions PATCH] Question not found:', fetchError?.message)
    return NextResponse.json({ error: 'Question not found' }, { status: 404 })
  }

  const { error } = await admin
    .from('questions')
    .update({
      answer: answer.trim(),
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
