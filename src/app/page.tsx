import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: investor } = await supabase
      .from('investors')
      .select('is_admin, nda_signed')
      .eq('auth_user_id', user.id)
      .single()

    if (investor?.is_admin) redirect('/admin')
    if (investor && !investor.nda_signed) redirect('/nda')
    if (investor) redirect('/room')
  }

  redirect('/login')
}
