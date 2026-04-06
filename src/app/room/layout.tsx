import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { RoomShell } from '@/components/layout/RoomShell'

export default async function RoomLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isAdmin = false
  if (user) {
    const admin = createAdminClient()
    const { data: investor } = await admin
      .from('investors')
      .select('is_admin')
      .eq('auth_user_id', user.id)
      .single()
    isAdmin = investor?.is_admin ?? false
  }

  return <RoomShell isAdmin={isAdmin}>{children}</RoomShell>
}
