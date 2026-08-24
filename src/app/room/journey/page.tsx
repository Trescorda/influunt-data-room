import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { JourneyView } from './JourneyView'

/**
 * Server wrapper. The journey content is a client component (framer-motion),
 * so the auth gate has to live here — the middleware only enforces access
 * expiry, it does not redirect anonymous users. Same pattern as /room.
 */
export default async function JourneyPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <JourneyView />
}
