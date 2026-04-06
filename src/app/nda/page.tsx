import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NdaGate } from '@/components/NdaGate'

export default async function NdaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: investor } = await supabase
    .from('investors')
    .select('id, nda_signed')
    .eq('auth_user_id', user.id)
    .single()

  if (!investor) redirect('/login')
  if (investor.nda_signed) redirect('/room')

  const { data: settings } = await supabase
    .from('settings')
    .select('nda_text')
    .single()

  const ndaText = settings?.nda_text || 'NDA text not configured.'

  return <NdaGate ndaText={ndaText} investorId={investor.id} />
}
