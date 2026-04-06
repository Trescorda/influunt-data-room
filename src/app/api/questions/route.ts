import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET: Fetch the current investor's questions
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  const { data: investor } = await admin
    .from('investors')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
  }

  const { data: questions } = await admin
    .from('questions')
    .select('*')
    .eq('investor_id', investor.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ questions: questions || [] })
}

// POST: Submit a new question
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { question } = await request.json()
  if (!question || typeof question !== 'string' || !question.trim()) {
    return NextResponse.json({ error: 'Question text required' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { data: investor } = await admin
    .from('investors')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 })
  }

  const { data: newQuestion, error } = await admin
    .from('questions')
    .insert({
      investor_id: investor.id,
      question: question.trim(),
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Log activity
  await admin.from('activity_log').insert({
    investor_id: investor.id,
    action: 'submit_question',
  })

  return NextResponse.json({ question: newQuestion })
}
