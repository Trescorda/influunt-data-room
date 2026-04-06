import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: Request) {
  const { userId } = await request.json()

  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ redirectTo: '/nda' })
  }

  const supabase = createAdminClient()

  const { data: investor } = await supabase
    .from('investors')
    .select('nda_signed, is_admin')
    .eq('auth_user_id', userId)
    .single()

  let redirectTo = '/nda'
  if (investor?.is_admin) {
    redirectTo = '/admin'
  } else if (investor?.nda_signed) {
    redirectTo = '/room'
  }

  return NextResponse.json({ redirectTo })
}
