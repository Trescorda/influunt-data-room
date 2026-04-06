import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ exists: false }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data } = await supabase
    .from('investors')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .single()

  return NextResponse.json({ exists: !!data })
}
